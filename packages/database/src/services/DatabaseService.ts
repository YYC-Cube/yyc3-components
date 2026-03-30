/**
 * @file 数据库管理业务逻辑层 / Database Management Service
 * @description 封装数据库管理业务逻辑、SQL 验证、连接池管理
 * @module services/DatabaseService
 * @version 1.0.0
 * @layer Service (Controller → Service → Repository → Model)
 *
 * 职责 / Responsibilities:
 * - 连接配置管理（加密存储）
 * - SQL 语句验证和安全检查
 * - 查询历史管理
 * - 表结构缓存
 * - 备份恢复业务逻辑
 */

import { databaseRepository } from "../repositories/DatabaseRepository";
import type {
  DatabaseConnection,
  ConnectionTestResult,
  SQLQueryInput,
  SQLQueryResult,
  SQLHistory,
  DatabaseTable,
  ERDiagramData,
  BackupConfig,
  BackupResult,
  RestoreConfig,
  RestoreResult,
  DatabaseStatistics,
  DatabaseType,
  ConnectionStatus,
} from "../types/database";
import { DEFAULT_PORTS, DANGEROUS_SQL_KEYWORDS } from "../types/database";

/* ══════════════════════════════════════════════════════════════════
 *  兼容旧接口类型 / Legacy Interface Types
 * ══════════════════════════════════════════════════════════════════ */

export type SyncStrategy = "realtime" | "polling" | "manual";

export interface DatabaseStats {
  totalQueries: number;
  avgResponseTime: number;
  errorRate: number;
}

export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  ssl: boolean;
}

export interface LocalAPIProxyConfig {
  enabled: boolean;
  port: number;
  host: string;
}

export interface ConnectionHealth {
  status: ConnectionStatus;
  latency: number;
  lastChecked: string;
}

/* ══════════════════════════════════════════════════════════════════
 *  常量配置 / Constants Configuration
 * ══════════════════════════════════════════════════════════════════ */

const STORAGE_KEYS = {
  CONNECTIONS: "yyc3_db_connections",
  ACTIVE_CONNECTION: "yyc3_db_active_connection",
  QUERY_HISTORY: "yyc3_db_query_history",
} as const;

const MAX_HISTORY_SIZE = 100; // 最大历史记录数

/* ══════════════════════════════════════════════════════════════════
 *  工具函数 / Utility Functions
 * ══════════════════════════════════════════════════════════════════ */

/**
 * 简单的密码加密（实际生产应使用更强加密）/ Simple password encryption
 */
function encryptPassword(password: string): string {
  // 简化实现：Base64 编码（生产环境应使用 AES 等强加密）
  return btoa(password);
}

/**
 * 简单的密码解密 / Simple password decryption
 */
function decryptPassword(encrypted: string): string {
  try {
    return atob(encrypted);
  } catch {
    return encrypted; // 如果解密失败，返回原值
  }
}

/**
 * 生成连接 ID / Generate connection ID
 */
function generateConnectionId(): string {
  return `conn_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * 检测 SQL 语句类型 / Detect SQL statement type
 */
function detectSQLType(sql: string): string {
  const normalized = sql.trim().toUpperCase();
  if (normalized.startsWith("SELECT")) {return "SELECT";}
  if (normalized.startsWith("INSERT")) {return "INSERT";}
  if (normalized.startsWith("UPDATE")) {return "UPDATE";}
  if (normalized.startsWith("DELETE")) {return "DELETE";}
  if (normalized.startsWith("CREATE")) {return "CREATE";}
  if (normalized.startsWith("ALTER")) {return "ALTER";}
  if (normalized.startsWith("DROP")) {return "DROP";}
  return "UNKNOWN";
}

/**
 * 检查 SQL 是否危险 / Check if SQL is dangerous
 */
function isDangerousSQL(sql: string): boolean {
  const normalized = sql.toUpperCase();
  return DANGEROUS_SQL_KEYWORDS.some(keyword => {
    const regex = new RegExp(keyword, "i");
    return regex.test(normalized);
  });
}

/* ══════════════════════════════════════════════════════════════════
 *  DatabaseService 类 / DatabaseService Class
 * ══════════════════════════════════════════════════════════════════ */

class DatabaseService {
  private connections: Map<string, DatabaseConnection>;
  private activeConnectionId: string | null;

  constructor() {
    // 从 localStorage 加载连接配置
    this.connections = this.loadConnections();
    this.activeConnectionId = localStorage.getItem(STORAGE_KEYS.ACTIVE_CONNECTION);
  }

  /* ──────────── 连接持久化 / Connection Persistence ──────────── */

  /**
   * 从 localStorage 加载连接 / Load connections from localStorage
   */
  private loadConnections(): Map<string, DatabaseConnection> {
    const stored = localStorage.getItem(STORAGE_KEYS.CONNECTIONS);
    if (!stored) {return new Map();}

    try {
      const data: DatabaseConnection[] = JSON.parse(stored);
      const map = new Map<string, DatabaseConnection>();
      data.forEach(conn => {
        // 解密密码
        map.set(conn.id, { 
          ...conn, 
          password: conn.password ? decryptPassword(conn.password) : undefined 
        });
      });
      return map;
    } catch {
      return new Map();
    }
  }

  /**
   * 保存连接到 localStorage / Save connections to localStorage
   */
  private saveConnections(): void {
    const connections = Array.from(this.connections.values()).map(conn => ({
      ...conn,
      password: conn.password ? encryptPassword(conn.password) : undefined, // 加密密码
    }));
    localStorage.setItem(STORAGE_KEYS.CONNECTIONS, JSON.stringify(connections));
  }

  /* ──────────── 连接管理 / Connection Management ──────────── */

  /**
   * 获取所有连接 / Get all connections
   */
  getConnections(): DatabaseConnection[] {
    return Array.from(this.connections.values());
  }

  /**
   * 获取单个连接 / Get single connection
   */
  getConnection(id: string): DatabaseConnection | null {
    return this.connections.get(id) || null;
  }

  /**
   * 获取当前活跃连接 / Get active connection
   */
  getActiveConnection(): DatabaseConnection | null {
    if (!this.activeConnectionId) {return null;}
    return this.connections.get(this.activeConnectionId) || null;
  }

  /**
   * 设置活跃连接 / Set active connection
   */
  setActiveConnection(id: string): void {
    if (!this.connections.has(id)) {
      throw new Error("CONNECTION_NOT_FOUND / 连接不存在");
    }
    this.activeConnectionId = id;
    localStorage.setItem(STORAGE_KEYS.ACTIVE_CONNECTION, id);
  }

  /**
   * 创建连接 / Create connection
   */
  async createConnection(
    input: Omit<DatabaseConnection, "id" | "createdAt" | "lastConnectedAt" | "status">
  ): Promise<DatabaseConnection> {
    const connection: DatabaseConnection = {
      ...input,
      id: generateConnectionId(),
      createdAt: new Date().toISOString(),
      lastConnectedAt: null,
      status: "disconnected",
    };

    this.connections.set(connection.id, connection);
    this.saveConnections();

    return connection;
  }

  /**
   * 更新连接 / Update connection
   */
  async updateConnection(id: string, updates: Partial<DatabaseConnection>): Promise<DatabaseConnection> {
    const existing = this.connections.get(id);
    if (!existing) {
      throw new Error("CONNECTION_NOT_FOUND / 连接不存在");
    }

    const updated: DatabaseConnection = { ...existing, ...updates };
    this.connections.set(id, updated);
    this.saveConnections();

    return updated;
  }

  /**
   * 删除连接 / Delete connection
   */
  async deleteConnection(id: string): Promise<void> {
    if (!this.connections.has(id)) {
      throw new Error("CONNECTION_NOT_FOUND / 连接存在");
    }

    this.connections.delete(id);
    this.saveConnections();

    // 如果删除的是活跃连接，清空活跃状态
    if (this.activeConnectionId === id) {
      this.activeConnectionId = null;
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_CONNECTION);
    }
  }

  /**
   * 测试连接 / Test connection
   */
  async testConnection(id: string): Promise<ConnectionTestResult> {
    const connection = this.connections.get(id);
    if (!connection) {
      throw new Error("CONNECTION_NOT_FOUND / 连接存在");
    }

    try {
      const result = await databaseRepository.testConnection(id);
      
      // 更新连接状态
      if (result.success) {
        await this.updateConnection(id, {
          status: "connected",
          lastConnectedAt: new Date().toISOString(),
        });
      } else {
        await this.updateConnection(id, { status: "error" });
      }

      return result;
    } catch (error) {
      await this.updateConnection(id, { status: "error" });
      throw error;
    }
  }

  /**
   * 获取默认端口 / Get default port
   */
  getDefaultPort(type: DatabaseType): number {
    return DEFAULT_PORTS[type];
  }

  /* ──────────── SQL 查询 / SQL Query ──────────── */

  /**
   * 验证 SQL 语句 / Validate SQL statement
   */
  validateSQL(sql: string): { valid: boolean; error: string | null; warnings: string[] } {
    const warnings: string[] = [];

    // 检查空语句
    if (!sql.trim()) {
      return { valid: false, error: "EMPTY_SQL / SQL 语句为空", warnings };
    }

    // 检查危险操作
    if (isDangerousSQL(sql)) {
      warnings.push("DANGEROUS_OPERATION / 检测到危险操作（DROP/TRUNCATE/DELETE）");
    }

    // 检查多语句（简化检查）
    const statements = sql.split(";").filter(s => s.trim());
    if (statements.length > 1) {
      warnings.push("MULTIPLE_STATEMENTS / 检测到多条语句");
    }

    return { valid: true, error: null, warnings };
  }

  /**
   * 执行 SQL 查询 / Execute SQL query
   */
  async executeQuery(input: SQLQueryInput): Promise<SQLQueryResult> {
    // 验证 SQL
    const validation = this.validateSQL(input.sql);
    if (!validation.valid) {
      throw new Error(validation.error || "INVALID_SQL / 无效的 SQL 语句");
    }

    // 执行查询
    const result = await databaseRepository.executeQuery(input);

    // 保存到历史记录
    this.addToHistory({
      id: `history_${Date.now()}`,
      connectionId: input.connectionId,
      sql: input.sql,
      executedAt: new Date().toISOString(),
      executionTime: result.executionTime,
      rowCount: result.rowCount,
      success: result.success,
      affectedRows: result.affectedRows,
    });

    // 添加警告信息
    if (validation.warnings.length > 0) {
      result.warnings = [...(result.warnings || []), ...validation.warnings];
    }

    return result;
  }

  /**
   * 获取查询历史 / Get query history
   */
  getQueryHistory(connectionId?: string): SQLHistory[] {
    const stored = localStorage.getItem(STORAGE_KEYS.QUERY_HISTORY);
    if (!stored) {return [];}

    try {
      const history: SQLHistory[] = JSON.parse(stored);
      if (connectionId) {
        return history.filter(h => h.connectionId === connectionId);
      }
      return history;
    } catch {
      return [];
    }
  }

  /**
   * 添加到历史记录 / Add to history
   */
  private addToHistory(record: SQLHistory): void {
    const history = this.getQueryHistory();
    history.unshift(record);

    // 限制历史记录数量
    const trimmed = history.slice(0, MAX_HISTORY_SIZE);
    localStorage.setItem(STORAGE_KEYS.QUERY_HISTORY, JSON.stringify(trimmed));
  }

  /**
   * 清空历史记录 / Clear history
   */
  clearQueryHistory(connectionId?: string): void {
    if (connectionId) {
      const history = this.getQueryHistory();
      const filtered = history.filter(h => h.connectionId !== connectionId);
      localStorage.setItem(STORAGE_KEYS.QUERY_HISTORY, JSON.stringify(filtered));
    } else {
      localStorage.removeItem(STORAGE_KEYS.QUERY_HISTORY);
    }
  }

  /* ──────────── 表结构 / Table Structure ──────────── */

  /**
   * 获取数据库所有表 / Get all tables
   */
  async getTables(connectionId: string): Promise<DatabaseTable[]> {
    return databaseRepository.getTables(connectionId);
  }

  /**
   * 获取表详情 / Get table details
   */
  async getTableDetails(connectionId: string, tableName: string): Promise<DatabaseTable | null> {
    return databaseRepository.getTableDetails(connectionId, tableName);
  }

  /**
   * 获取表数据 / Get table data
   */
  async getTableData(
    connectionId: string,
    tableName: string,
    page: number = 1,
    pageSize: number = 100
  ): Promise<{ rows: Array<Record<string, unknown>>; total: number }> {
    return databaseRepository.getTableData(connectionId, tableName, page, pageSize);
  }

  /* ──────────── ER 关系图 / ER Diagram ──────────── */

  /**
   * 获取 ER 关系图 / Get ER diagram
   */
  async getERDiagram(connectionId: string): Promise<ERDiagramData> {
    return databaseRepository.getERDiagram(connectionId);
  }

  /* ──────────── 备份恢复 / Backup & Restore ──────────── */

  /**
   * 创建备份 / Create backup
   */
  async createBackup(config: BackupConfig): Promise<BackupResult> {
    // 验证连接存在
    if (!this.connections.has(config.connectionId)) {
      throw new Error("CONNECTION_NOT_FOUND / 连接存在");
    }

    return databaseRepository.createBackup(config);
  }

  /**
   * 恢复数据库 / Restore database
   */
  async restoreDatabase(config: RestoreConfig): Promise<RestoreResult> {
    // 验证连接存在
    if (!this.connections.has(config.connectionId)) {
      throw new Error("CONNECTION_NOT_FOUND / 连接存在");
    }

    return databaseRepository.restoreDatabase(config);
  }

  /**
   * 获取备份列表 / Get backups
   */
  async getBackups(connectionId: string): Promise<BackupResult[]> {
    return databaseRepository.getBackups(connectionId);
  }

  /* ──────────── 统计信息 / Statistics ──────────── */

  /**
   * 获取数据库统计 / Get database statistics
   */
  async getStatistics(connectionId: string): Promise<DatabaseStatistics> {
    return databaseRepository.getStatistics(connectionId);
  }

  /* ──────────── 健康检查 / Health Check ──────────── */

  /**
   * 检查数据库服务健康 / Check database service health
   */
  async checkHealth(): Promise<boolean> {
    return databaseRepository.checkHealth();
  }

  /* ──────────── 兼容旧接口方法 / Legacy Interface Methods ──────────── */

  /**
   * 获取同步策略 / Get sync strategy
   */
  getSyncStrategy(): SyncStrategy {
    const stored = localStorage.getItem("yyc3_sync_strategy");
    return (stored as SyncStrategy) || "polling";
  }

  /**
   * 设置同步策略 / Set sync strategy
   */
  setSyncStrategy(strategy: SyncStrategy): void {
    localStorage.setItem("yyc3_sync_strategy", strategy);
  }

  /**
   * 获取数据库配置 / Get database config
   */
  getDatabaseConfig(): DatabaseConfig {
    const stored = localStorage.getItem("yyc3_database_config");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        // Fallback
      }
    }
    // 浏览器环境默认配置 / Browser environment default config
    return {
      host: "localhost",
      port: 5432,
      database: "yyc3_family",
      user: "yyc3_admin",
      password: "",
      ssl: false,
    };
  }

  /**
   * 保存数据库配置 / Save database config
   */
  saveDatabaseConfig(config: Partial<DatabaseConfig>): void {
    const current = this.getDatabaseConfig();
    const updated = { ...current, ...config };
    localStorage.setItem("yyc3_database_config", JSON.stringify(updated));
  }

  /**
   * 获取代理配置 / Get proxy config
   */
  getProxyConfig(): LocalAPIProxyConfig {
    const stored = localStorage.getItem("yyc3_proxy_config");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        // Fallback
      }
    }
    return {
      enabled: true,
      port: 3721,
      host: "localhost",
    };
  }

  /**
   * 保存代理配置 / Save proxy config
   */
  saveProxyConfig(config: Partial<LocalAPIProxyConfig>): void {
    const current = this.getProxyConfig();
    const updated = { ...current, ...config };
    localStorage.setItem("yyc3_proxy_config", JSON.stringify(updated));
  }

  /**
   * 获取数据库统计（简化版）/ Get database stats (simplified)
   */
  getDatabaseStats(): DatabaseStats {
    const history = this.getQueryHistory();
    const successCount = history.filter(h => h.success).length;
    const totalDuration = history.reduce((sum, h) => sum + h.executionTime, 0);
    
    return {
      totalQueries: history.length,
      avgResponseTime: history.length > 0 ? totalDuration / history.length : 0,
      errorRate: history.length > 0 ? (history.length - successCount) / history.length : 0,
    };
  }

  /**
   * 获取连接健康信息 / Get connection health
   */
  async getConnectionHealth(connectionId: string): Promise<ConnectionHealth> {
    try {
      const result = await this.testConnection(connectionId);
      return {
        status: "connected",
        latency: result.latency,
        lastChecked: new Date().toISOString(),
      };
    } catch {
      return {
        status: "error",
        latency: 0,
        lastChecked: new Date().toISOString(),
      };
    }
  }

  /**
   * 获取统计信息（别名方法）/ Get stats (alias method)
   */
  getStats(): DatabaseStats {
    return this.getDatabaseStats();
  }

  /**
   * 是否模拟模式 / Is mock mode
   */
  isMockMode(): boolean {
    // 简化实现：检查是否有活跃连接
    return this.activeConnectionId === null;
  }

  /**
   * 获取重连统计 / Get reconnect stats
   */
  getReconnectStats(): { attempts: number; probeInterval: number; consecutiveSuccess: number } {
    const stored = localStorage.getItem("yyc3_reconnect_stats");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        // Fallback
      }
    }
    return {
      attempts: 0,
      probeInterval: 5000,
      consecutiveSuccess: 0,
    };
  }

  /**
   * 状态变化回调类型 / Status change callback type
   */
  private statusChangeListeners: Array<(event: {
    currentStatus: ConnectionStatus;
    previousStatus: ConnectionStatus;
    isMockMode: boolean;
    reconnectAttempts: number;
  }) => void> = [];

  /**
   * 订阅状态变化 / Subscribe to status change
   */
  onStatusChange(
    callback: (event: {
      currentStatus: ConnectionStatus;
      previousStatus: ConnectionStatus;
      isMockMode: boolean;
      reconnectAttempts: number;
    }) => void
  ): () => void {
    this.statusChangeListeners.push(callback);
    
    // 返回取消订阅函数 / Return unsubscribe function
    return () => {
      const index = this.statusChangeListeners.indexOf(callback);
      if (index > -1) {
        this.statusChangeListeners.splice(index, 1);
      }
    };
  }

  /**
   * 触发状态变化事件 / Trigger status change event
   */
  private notifyStatusChange(
    currentStatus: ConnectionStatus,
    previousStatus: ConnectionStatus,
    isMockMode: boolean,
    reconnectAttempts: number
  ): void {
    const event = { currentStatus, previousStatus, isMockMode, reconnectAttempts };
    this.statusChangeListeners.forEach(listener => listener(event));
  }

  /**
   * 获取配置（别名）/ Get config (alias)
   */
  getConfig(): DatabaseConfig {
    return this.getDatabaseConfig();
  }

  /**
   * 保存配置（别名）/ Save config (alias)
   */
  saveConfig(config: Partial<DatabaseConfig>): void {
    this.saveDatabaseConfig(config);
  }

  /**
   * 初始化连接 / Initialize connection
   */
  async initializeConnection(config: DatabaseConfig): Promise<{ success: boolean; error: string | null }> {
    try {
      // 保存配置
      this.saveDatabaseConfig(config);

      // 创建或更新连接
      const existingConn = Array.from(this.connections.values()).find(
        c => c.host === config.host && c.port === config.port && c.database === config.database
      );

      let conn: DatabaseConnection;
      if (existingConn) {
        conn = await this.updateConnection(existingConn.id, {
          username: config.user,
          password: config.password,
          ssl: config.ssl,
        });
      } else {
        conn = await this.createConnection({
          name: `${config.host}:${config.port}/${config.database}`,
          type: "postgresql",
          host: config.host,
          port: config.port,
          database: config.database,
          username: config.user,
          password: config.password,
          ssl: config.ssl,
          poolSize: 10,
          timeout: 5000,
          isDefault: true,
        });
      }

      // 设置为活跃连接
      this.setActiveConnection(conn.id);

      // 测试连接
      await this.testConnection(conn.id);

      return { success: true, error: null };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "INIT_FAILED / 初始化连接失败",
      };
    }
  }

  /**
   * 断开连接 / Disconnect
   */
  disconnect(): void {
    if (this.activeConnectionId) {
      const conn = this.connections.get(this.activeConnectionId);
      if (conn) {
        this.updateConnection(this.activeConnectionId, { status: "disconnected" });
      }
      this.activeConnectionId = null;
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_CONNECTION);
    }
  }

  /**
   * 立即同步 / Sync now
   */
  async syncNow(): Promise<{ success: boolean; error: string | null }> {
    if (!this.activeConnectionId) {
      return { success: false, error: "NO_ACTIVE_CONNECTION / 没有活跃连接" };
    }

    try {
      const result = await this.testConnection(this.activeConnectionId);
      return { success: result.success, error: result.error };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "SYNC_FAILED / 同步失败",
      };
    }
  }
}

/* ══════════════════════════════════════════════════════════════════
 *  导出单例 / Export Singleton
 * ══════════════════════════════════════════════════════════════════ */

export const databaseService = new DatabaseService();

/* Version: 1.0.1 - Full backward compatibility support added */