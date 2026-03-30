/**
 * file: index.ts
 * description: @yyc3/database 包主入口文件 · 导出所有数据库管理相关类型、Hooks 和工具函数
 * author: YanYuCloudCube Team
 * version: v1.0.0
 * created: 2026-03-26
 * updated: 2026-03-26
 * status: active
 * tags: [database],[sql],[query]
 *
 * copyright: YanYuCloudCube Team
 * license: MIT
 *
 * brief: 提供完整的数据库管理解决方案
 *
 * details:
 * - 数据库连接管理（连接、断开、池管理）
 * - 查询执行（SQL 查询、参数化查询）
 * - 数据表管理（创建、修改、删除）
 * - 事务管理（开始、提交、回滚）
 * - 配置管理（连接字符串、超时、池配置）
 *
 * dependencies: React, Database Driver
 * exports: useDatabase, useDatabaseConfig, DatabaseService, 所有数据库相关类型
 * notes: 支持多种数据库驱动
 */

// Hooks
export { useDatabase } from './hooks/useDatabase';
export { useDatabaseConfig } from './hooks/useDatabaseConfig';

// Services
export { databaseService } from './services/DatabaseService';

// Types
export type {
  DatabaseConfig,
  DatabaseConnection,
  QueryResult,
  Transaction,
  UseDatabaseReturn,
  UseDatabaseConfigReturn,
} from './types/database';
