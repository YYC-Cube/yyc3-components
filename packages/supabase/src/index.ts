/**
 * file: index.ts
 * description: @yyc3/supabase 包主入口文件 · 导出所有 Supabase 同步相关类型、Hooks 和工具函数
 * author: YanYuCloudCube Team
 * version: v1.0.0
 * created: 2026-03-26
 * updated: 2026-03-26
 * status: active
 * tags: [supabase],[sync],[database]
 *
 * copyright: YanYuCloudCube Team
 * license: MIT
 *
 * brief: 提供完整的 Supabase 数据同步解决方案
 *
 * details:
 * - Supabase 连接管理（认证、配置）
 * - 数据同步（自动同步、手动同步）
 * - 实时订阅（数据变更监听）
 * - 配置管理（项目 URL、密钥管理）
 * - 错误处理（自动重试、错误日志）
 *
 * dependencies: React, @supabase/supabase-js
 * exports: useSupabaseSync, 所有 Supabase 相关类型
 * notes: 需要 Supabase 项目
 */

// Hooks
export { useSupabaseSync } from './hooks/useSupabaseSync';

// Types
export type {
  SupabaseConfig,
  SupabaseSyncStatus,
  SupabaseSyncResult,
  UseSupabaseSyncReturn,
} from './types/supabase';
