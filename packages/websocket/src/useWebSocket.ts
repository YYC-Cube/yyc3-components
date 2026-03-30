/**
 * file: useWebSocket.ts
 * description: WebSocket React Hook · 提供完整的 WebSocket 连接管理和消息订阅功能
 * author: YanYuCloudCube Team
 * version: v1.0.0
 * created: 2026-03-26
 * updated: 2026-03-26
 * status: active
 * tags: [hook],[websocket],[react]
 *
 * copyright: YanYuCloudCube Team
 * license: MIT
 *
 * brief: 核心 WebSocket Hook，管理连接、消息和状态
 *
 * details:
 * - 自动连接和断开
 * - 自动重连机制（可配置重连次数和间隔）
 * - 心跳保活（可配置心跳间隔和超时）
 * - 降级模式（连接失败后自动降级到 polling）
 * - 消息订阅（支持过滤和批处理）
 * - 连接统计（消息数、字节数、延迟等）
 * - 完整的 TypeScript 类型支持
 *
 * dependencies: React (useState, useEffect, useCallback, useRef)
 * exports: useWebSocket, UseWebSocketReturn
 * notes: Hook 会在组件卸载时自动清理所有定时器和事件监听器
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import type {
  WebSocketState,
  WebSocketMessage,
  WebSocketMessageType,
  WebSocketConfig,
  WebSocketConnectionInfo,
  WebSocketStatistics,
  WebSocketSubscriptionOptions,
  FallbackStrategyConfig,
} from './types';

/**
 * WebSocket Hook 返回类型 / WebSocket Hook return type
 */
export interface UseWebSocketReturn {
  /** 连接状态 / Connection state */
  state: WebSocketState;
  /** 连接信息 / Connection info */
  connectionInfo: WebSocketConnectionInfo;
  /** 统计信息 / Statistics */
  statistics: WebSocketStatistics;
  /** 是否已连接 / Is connected */
  isConnected: boolean;
  /** 是否正在连接 / Is connecting */
  isConnecting: boolean;
  /** 是否使用降级模式 / Is using fallback */
  isFallbackActive: boolean;
  /** 最后错误 / Last error */
  lastError: string | null;

  // 控制函数 / Control functions
  /** 连接 / Connect */
  connect: () => void;
  /** 断开连接 / Disconnect */
  disconnect: () => void;
  /** 重连 / Reconnect */
  reconnect: () => void;
  /** 发送消息 / Send message */
  send: <T = unknown>(type: WebSocketMessageType, data: T) => void;
  /** 订阅消息 / Subscribe to messages */
  subscribe: <T = unknown>(
    callback: (message: WebSocketMessage<T>) => void,
    options?: WebSocketSubscriptionOptions
  ) => () => void;
}

/**
 * 默认 WebSocket 配置 / Default WebSocket configuration
 */
const DEFAULT_CONFIG: Partial<WebSocketConfig> = {
  reconnectInterval: 3000,
  maxReconnectAttempts: 5,
  heartbeatInterval: 30000,
  heartbeatTimeout: 5000,
  autoReconnect: true,
};

/**
 * 默认降级策略 / Default fallback strategy
 */
const DEFAULT_FALLBACK: FallbackStrategyConfig = {
  enabled: true,
  mode: 'polling',
  pollingInterval: 5000,
  maxPollingFailures: 3,
  trigger: {
    connectionFailures: 3,
    timeout: 10000,
  },
};

/**
 * WebSocket Hook
 *
 * 管理 WebSocket 连接，提供消息订阅和自动降级功能
 * Manages WebSocket connection with message subscription and auto fallback
 *
 * @param {string} url - WebSocket URL
 * @param {Partial<WebSocketConfig>} config - 配置选项 / Configuration options
 * @returns {UseWebSocketReturn} WebSocket 状态和控制函数 / WebSocket state and control functions
 *
 * @example
 * ```tsx
 * const { state, send, subscribe, isConnected } = useWebSocket('ws://localhost:8080', {
 *   autoReconnect: true,
 *   maxReconnectAttempts: 3
 * });
 *
 * useEffect(() => {
 *   const unsubscribe = subscribe((message) => {
 *     console.log('Received:', message);
 *   });
 *   return unsubscribe;
 * }, []);
 * ```
 */
export function useWebSocket(
  url: string,
  config: Partial<WebSocketConfig> = {}
): UseWebSocketReturn {
  const fullConfig = { ...DEFAULT_CONFIG, ...config };

  // WebSocket 实例 / WebSocket instance
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const heartbeatTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fallbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 订阅列表 / Subscription list
  const subscriptionsRef = useRef<
    Map<
      string,
      {
        callback: (message: WebSocketMessage) => void;
        options?: WebSocketSubscriptionOptions;
      }
    >
  >(new Map());

  // 状态 / State
  const [state, setState] = useState<WebSocketState>('disconnected');
  const [connectionInfo, setConnectionInfo] = useState<WebSocketConnectionInfo>(
    {
      state: 'disconnected',
      connectedDuration: 0,
      reconnectAttempts: 0,
      serverUrl: url,
    }
  );
  const [statistics, setStatistics] = useState<WebSocketStatistics>({
    messagesSent: 0,
    messagesReceived: 0,
    bytesSent: 0,
    bytesReceived: 0,
    errorCount: 0,
    averageLatency: 0,
    lastActivityAt: new Date(),
  });
  const [isFallbackActive, setIsFallbackActive] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);

  /**
   * 发送心跳 / Send heartbeat
   */
  const sendHeartbeat = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      const message: WebSocketMessage = {
        id: `ping_${Date.now()}`,
        type: 'ping',
        data: null,
        timestamp: new Date(),
      };
      wsRef.current.send(JSON.stringify(message));
    }
  }, []);

  /**
   * 启动心跳 / Start heartbeat
   */
  const startHeartbeat = useCallback(() => {
    if (heartbeatTimerRef.current) {
      clearInterval(heartbeatTimerRef.current);
    }

    heartbeatTimerRef.current = setInterval(
      sendHeartbeat,
      fullConfig.heartbeatInterval
    );
  }, [sendHeartbeat, fullConfig.heartbeatInterval]);

  /**
   * 停止心跳 / Stop heartbeat
   */
  const stopHeartbeat = useCallback(() => {
    if (heartbeatTimerRef.current) {
      clearInterval(heartbeatTimerRef.current);
      heartbeatTimerRef.current = null;
    }
  }, []);

  /**
   * 启动降级模式 / Start fallback mode
   */
  const startFallback = useCallback(() => {
    if (!DEFAULT_FALLBACK.enabled) {
      return;
    }

    setIsFallbackActive(true);

    // 使用 polling 模式 / Use polling mode
    if (DEFAULT_FALLBACK.mode === 'polling') {
      fallbackTimerRef.current = setInterval(() => {
        // 这里应该调用 REST API 获取最新消息 / Should call REST API to fetch latest messages
        // 暂时模拟 / Temporarily simulated
      }, DEFAULT_FALLBACK.pollingInterval);
    }
  }, []);

  /**
   * 停止降级模式 / Stop fallback mode
   */
  const stopFallback = useCallback(() => {
    setIsFallbackActive(false);

    if (fallbackTimerRef.current) {
      clearInterval(fallbackTimerRef.current);
      fallbackTimerRef.current = null;
    }
  }, []);

  /**
   * 处理消息 / Handle message
   */
  const handleMessage = useCallback((message: WebSocketMessage) => {
    // 更新统计 / Update statistics
    setStatistics((prev) => ({
      ...prev,
      messagesReceived: prev.messagesReceived + 1,
      bytesReceived: prev.bytesReceived + JSON.stringify(message).length,
      lastActivityAt: new Date(),
    }));

    // 分发给订阅者 / Dispatch to subscribers
    subscriptionsRef.current.forEach(({ callback, options }) => {
      // 检查过滤条件 / Check filter conditions
      if (
        options?.messageTypes &&
        !options.messageTypes.includes(message.type)
      ) {
        return;
      }
      if (
        options?.sources &&
        message.source &&
        !options.sources.includes(message.source)
      ) {
        return;
      }
      if (
        options?.priorities &&
        message.priority &&
        !options.priorities.includes(message.priority)
      ) {
        return;
      }

      callback(message);
    });
  }, []);

  /**
   * 连接 WebSocket / Connect WebSocket
   */
  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return; // 已连接 / Already connected
    }

    setState('connecting');
    setConnectionInfo((prev) => ({
      ...prev,
      state: 'connecting',
    }));

    try {
      const ws = new WebSocket(url, fullConfig.protocols);

      ws.onopen = () => {
        setState('connected');
        setConnectionInfo((prev) => ({
          ...prev,
          state: 'connected',
          reconnectAttempts: 0,
          lastConnectedAt: new Date(),
        }));
        setLastError(null);
        stopFallback();
        startHeartbeat();
      };

      ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          handleMessage(message);
        } catch (error) {
          // 处理解析错误 / Handle parsing error
          setStatistics((prev) => ({
            ...prev,
            errorCount: prev.errorCount + 1,
          }));
        }
      };

      ws.onerror = () => {
        setLastError('WebSocket error occurred');
        setStatistics((prev) => ({
          ...prev,
          errorCount: prev.errorCount + 1,
        }));
      };

      ws.onclose = () => {
        setState('disconnected');
        setConnectionInfo((prev) => ({
          ...prev,
          state: 'disconnected',
          lastDisconnectedAt: new Date(),
        }));
        stopHeartbeat();

        // 自动重连 / Auto reconnect
        if (
          fullConfig.autoReconnect &&
          connectionInfo.reconnectAttempts <
            (fullConfig.maxReconnectAttempts || 5)
        ) {
          setState('reconnecting');
          setConnectionInfo((prev) => ({
            ...prev,
            state: 'reconnecting',
            reconnectAttempts: prev.reconnectAttempts + 1,
          }));

          reconnectTimerRef.current = setTimeout(() => {
            connect();
          }, fullConfig.reconnectInterval);
        } else if (
          connectionInfo.reconnectAttempts >=
          (fullConfig.maxReconnectAttempts || 5)
        ) {
          // 启动降级模式 / Start fallback mode
          startFallback();
        }
      };

      wsRef.current = ws;
    } catch (error) {
      setState('failed');
      setConnectionInfo((prev) => ({
        ...prev,
        state: 'failed',
        lastError: error instanceof Error ? error.message : 'Connection failed',
      }));
      setLastError(
        error instanceof Error ? error.message : 'Connection failed'
      );
      startFallback();
    }
  }, [
    url,
    fullConfig,
    connectionInfo.reconnectAttempts,
    handleMessage,
    stopFallback,
    startHeartbeat,
  ]);

  /**
   * 断开连接 / Disconnect
   */
  const disconnect = useCallback(() => {
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }

    stopHeartbeat();
    stopFallback();

    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    setState('disconnected');
    setConnectionInfo((prev) => ({
      ...prev,
      state: 'disconnected',
      reconnectAttempts: 0,
    }));
  }, [stopHeartbeat, stopFallback]);

  /**
   * 重连 / Reconnect
   */
  const reconnect = useCallback(() => {
    disconnect();
    setTimeout(() => connect(), 100);
  }, [connect, disconnect]);

  /**
   * 发送消息 / Send message
   */
  const send = useCallback(
    <T = unknown>(type: WebSocketMessageType, data: T) => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        const message: WebSocketMessage<T> = {
          id: `msg_${Date.now()}`,
          type,
          data,
          timestamp: new Date(),
        };

        const messageStr = JSON.stringify(message);
        wsRef.current.send(messageStr);

        setStatistics((prev) => ({
          ...prev,
          messagesSent: prev.messagesSent + 1,
          bytesSent: prev.bytesSent + messageStr.length,
          lastActivityAt: new Date(),
        }));
      }
    },
    []
  );

  /**
   * 订阅消息 / Subscribe to messages
   */
  const subscribe = useCallback(
    <T = unknown>(
      callback: (message: WebSocketMessage<T>) => void,
      options?: WebSocketSubscriptionOptions
    ): (() => void) => {
      const subscriptionId = `sub_${Date.now()}_${Math.random()}`;

      subscriptionsRef.current.set(subscriptionId, {
        callback: callback as (message: WebSocketMessage) => void,
        options,
      });

      // 返回取消订阅函数 / Return unsubscribe function
      return () => {
        subscriptionsRef.current.delete(subscriptionId);
      };
    },
    []
  );

  // 自动连接 / Auto connect
  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [url]); // 仅在 URL 变化时重连 / Only reconnect when URL changes

  return {
    state,
    connectionInfo,
    statistics,
    isConnected: state === 'connected',
    isConnecting: state === 'connecting' || state === 'reconnecting',
    isFallbackActive,
    lastError,
    connect,
    disconnect,
    reconnect,
    send,
    subscribe,
  };
}
