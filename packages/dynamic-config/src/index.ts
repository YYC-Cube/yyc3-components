/**
 * file: index.ts
 * description: @yyc3/dynamic-config 包主入口文件 · 导出所有动态配置相关类型和 Hooks
 * author: YanYuCloudCube Team
 * version: v1.0.0
 * created: 2026-03-26
 * updated: 2026-03-26
 * status: active
 * tags: [config],[dynamic],[settings]
 *
 * copyright: YanYuCloudCube Team
 * license: MIT
 *
 * brief: 提供完整的动态配置管理解决方案
 *
 * details:
 * - 动态配置管理（运行时修改配置）
 * - 配置热重载（无需重启应用）
 * - 配置版本控制（配置历史、回滚）
 * - 配置验证（Schema validation）
 * - 配置持久化（localStorage、IndexedDB）
 * - 配置订阅（配置变化通知）
 *
 * dependencies: React, localStorage
 * exports: useDynamicConfig, 所有动态配置相关类型
 * notes: 支持配置热重载和版本控制
 */

// Hooks
export { useDynamicConfig } from './hooks/useDynamicConfig';

// Types
export type {
  DynamicConfig,
  ConfigSchema,
  ConfigVersion,
  ConfigChange,
  UseDynamicConfigReturn,
} from './types/dynamic-config';
