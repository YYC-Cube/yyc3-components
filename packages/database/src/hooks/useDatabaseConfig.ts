import { useState, useEffect, useCallback } from 'react';
import { databaseService } from '../services/DatabaseService';
import type {
  DatabaseConfig,
  LocalAPIProxyConfig,
  ConnectionHealth,
  SyncStrategy,
} from '../services/DatabaseService';
import type { ConnectionStatus } from '../types/database';

/**
 * useDatabaseConfig Hook 返回类型 / useDatabaseConfig Hook return type
 */
interface UseDatabaseConfigReturn {
  config: DatabaseConfig;
  proxyConfig: LocalAPIProxyConfig;
  connectionStatus: ConnectionStatus;
  health: ConnectionHealth | null;
  stats: ReturnType<typeof databaseService.getStats>;
  syncStrategy: SyncStrategy;
  isConnecting: boolean;
  isMockMode: boolean;
  reconnectStats: ReturnType<typeof databaseService.getReconnectStats>;
  lastError: string | null;
  saveConfig: (newConfig: Partial<DatabaseConfig>) => void;
  saveProxyConfig: (newProxyConfig: Partial<LocalAPIProxyConfig>) => void;
  connect: () => Promise<boolean>;
  disconnect: () => void;
  testConnection: () => Promise<boolean>;
  syncNow: () => Promise<boolean>;
  updateSyncStrategy: (strategy: SyncStrategy) => void;
}

/**
 * 数据库配置管理 Hook
 * Database configuration management hook
 */
export function useDatabaseConfig(): UseDatabaseConfigReturn {
  const [config, setConfig] = useState<DatabaseConfig>(() =>
    databaseService.getDatabaseConfig()
  );
  const [proxyConfig, setProxyConfig] = useState<LocalAPIProxyConfig>(() =>
    databaseService.getProxyConfig()
  );
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>('disconnected');
  const [health, setHealth] = useState<ConnectionHealth | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const [syncStrategy, setSyncStrategy] = useState<SyncStrategy>(() =>
    databaseService.getSyncStrategy()
  );

  /** 加载保存的配置 / Load saved config */
  useEffect(() => {
    const savedConfig = databaseService.getConfig();
    if (savedConfig) {
      setConfig(savedConfig);
    }

    const savedProxy = databaseService.getProxyConfig();
    if (savedProxy) {
      setProxyConfig(savedProxy);
    }
  }, []);

  /**
   * 订阅状态变化 / Subscribe to status changes
   */
  useEffect(() => {
    const unsubscribe = databaseService.onStatusChange((event) => {
      setConnectionStatus(event.currentStatus);

      // 从 Mock 恢复到真实连接时，更新状态 / When recovering from mock to real, update state
      if (
        event.previousStatus === 'error' &&
        event.currentStatus === 'connected'
      ) {
        setLastError(null);
      }

      // 进入 Mock 模式时，记录错误 / When entering mock mode, record error
      if (event.isMockMode && event.currentStatus === 'error') {
        setLastError(
          `MOCK_MODE_ACTIVE / 模拟模式激活 (重连尝试: ${event.reconnectAttempts})`
        );
      }
    });

    return unsubscribe;
  }, []);

  /**
   * 保存数据库配置 / Save database config
   */
  const saveConfig = useCallback(
    (newConfig: Partial<DatabaseConfig>) => {
      const updated = { ...config, ...newConfig };
      setConfig(updated);
      databaseService.saveConfig(updated);
    },
    [config]
  );

  /**
   * 保存代理配置 / Save proxy config
   */
  const saveProxyConfig = useCallback(
    (newProxyConfig: Partial<LocalAPIProxyConfig>) => {
      const updated = { ...proxyConfig, ...newProxyConfig };
      setProxyConfig(updated);
      databaseService.saveProxyConfig(updated);
    },
    [proxyConfig]
  );

  /**
   * 连接数据库 / Connect to database
   */
  const connect = useCallback(async () => {
    try {
      setIsConnecting(true);
      setLastError(null);
      setConnectionStatus('connecting');

      const result = await databaseService.initializeConnection(config);

      if (result.success) {
        setConnectionStatus('connected');
        return true;
      } else {
        setConnectionStatus('error');
        setLastError(result.error);
        return false;
      }
    } catch (error) {
      setConnectionStatus('error');
      setLastError(
        error instanceof Error ? error.message : 'UNKNOWN_ERROR / 未知错误'
      );
      return false;
    } finally {
      setIsConnecting(false);
    }
  }, [config]);

  /**
   * 断开连接 / Disconnect
   */
  const disconnect = useCallback(() => {
    databaseService.disconnect();
    setConnectionStatus('disconnected');
    setHealth(null);
    setLastError(null);
  }, []);

  /**
   * 测试连接 / Test connection
   */
  const testConnection = useCallback(async () => {
    try {
      setIsConnecting(true);
      const result = await databaseService.initializeConnection(config);
      const success = result.success;

      if (!success) {
        setLastError(result.error);
      }

      // 测试后断开 / Disconnect after test
      databaseService.disconnect();
      setConnectionStatus('disconnected');

      return success;
    } catch (error) {
      setLastError(
        error instanceof Error ? error.message : 'TEST_FAILED / 测试失败'
      );
      return false;
    } finally {
      setIsConnecting(false);
    }
  }, [config]);

  /**
   * 立即同步 / Sync now
   */
  const syncNow = useCallback(async () => {
    try {
      const result = await databaseService.syncNow();
      return result.success;
    } catch {
      return false;
    }
  }, []);

  /**
   * 更新同步策略 / Update sync strategy
   */
  const updateSyncStrategy = useCallback((strategy: SyncStrategy) => {
    setSyncStrategy(strategy);
    databaseService.setSyncStrategy(strategy);
  }, []);

  /**
   * 清理函数 / Cleanup function
   */
  useEffect(() => {
    return () => {
      databaseService.disconnect();
    };
  }, []);

  return {
    config,
    proxyConfig,
    connectionStatus,
    health,
    stats: databaseService.getStats(),
    syncStrategy,
    isConnecting,
    isMockMode: databaseService.isMockMode(),
    reconnectStats: databaseService.getReconnectStats(),
    lastError,
    saveConfig,
    saveProxyConfig,
    connect,
    disconnect,
    testConnection,
    syncNow,
    updateSyncStrategy,
  };
}
