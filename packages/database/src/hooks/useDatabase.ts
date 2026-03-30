/**
 * @file 数据库管理 Hook / Database Management Hook
 * @description React 状态桥接层
 * @module hooks/useDatabase
 * @version 1.0.0
 */

import { useState, useCallback } from "react";
import { databaseService } from "../services/DatabaseService";
import type {
  DatabaseConnection,
  SQLQueryInput,
  SQLQueryResult,
  DatabaseTable,
  DatabaseStatistics,
} from "../types/database";

export interface UseDatabaseReturn {
  /* 连接管理 */
  connections: DatabaseConnection[];
  activeConnection: DatabaseConnection | null;
  loading: boolean;
  error: string | null;
  
  /* 操作方法 */
  loadConnections: () => Promise<void>;
  createConnection: (conn: Omit<DatabaseConnection, "id" | "createdAt" | "lastConnectedAt" | "status">) => Promise<void>;
  testConnection: (id: string) => Promise<void>;
  executeQuery: (input: SQLQueryInput) => Promise<SQLQueryResult>;
  getTables: (connectionId: string) => Promise<DatabaseTable[]>;
  getStatistics: (connectionId: string) => Promise<DatabaseStatistics>;
}

export function useDatabase(): UseDatabaseReturn {
  const [connections, setConnections] = useState<DatabaseConnection[]>([]);
  const [activeConnection, setActiveConnection] = useState<DatabaseConnection | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadConnections = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const conns = databaseService.getConnections();
      setConnections(conns);
      const active = databaseService.getActiveConnection();
      setActiveConnection(active);
    } catch (err) {
      setError(err instanceof Error ? err.message : "LOAD_FAILED / 加载连接失败");
    } finally {
      setLoading(false);
    }
  }, []);

  const createConnection = useCallback(async (conn: Omit<DatabaseConnection, "id" | "createdAt" | "lastConnectedAt" | "status">) => {
    setLoading(true);
    setError(null);
    try {
      await databaseService.createConnection(conn);
      await loadConnections();
    } catch (err) {
      setError(err instanceof Error ? err.message : "CREATE_FAILED / 创建连接失败");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadConnections]);

  const testConnection = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await databaseService.testConnection(id);
      await loadConnections();
    } catch (err) {
      setError(err instanceof Error ? err.message : "TEST_FAILED / 测试连接失败");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadConnections]);

  const executeQuery = useCallback(async (input: SQLQueryInput): Promise<SQLQueryResult> => {
    setLoading(true);
    setError(null);
    try {
      return await databaseService.executeQuery(input);
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "QUERY_FAILED / 查询失败";
      setError(errMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getTables = useCallback(async (connectionId: string): Promise<DatabaseTable[]> => {
    setLoading(true);
    setError(null);
    try {
      return await databaseService.getTables(connectionId);
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "GET_TABLES_FAILED / 获取表列表失败";
      setError(errMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getStatistics = useCallback(async (connectionId: string): Promise<DatabaseStatistics> => {
    setLoading(true);
    setError(null);
    try {
      return await databaseService.getStatistics(connectionId);
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "GET_STATS_FAILED / 获取统计信息失败";
      setError(errMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    connections,
    activeConnection,
    loading,
    error,
    loadConnections,
    createConnection,
    testConnection,
    executeQuery,
    getTables,
    getStatistics,
  };
}