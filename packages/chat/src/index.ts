/**
 * file: index.ts
 * description: @yyc3/chat 包主入口文件 · 导出所有聊天相关的组件、Hooks 和类型
 * author: YanYuCloudCube Team
 * version: v1.0.0
 * created: 2026-03-26
 * updated: 2026-03-26
 * status: active
 * tags: [chat],[components],[hooks]
 *
 * copyright: YanYuCloudCube Team
 * license: MIT
 *
 * brief: 提供聊天功能的完整解决方案
 *
 * details:
 * - 聊天持久化（localStorage 自动保存和加载）
 * - 频道管理（创建、删除、更新频道）
 * - 数据导入导出（JSON 格式）
 * - 自动清理（存储空间和过期数据）
 * - 打字指示器（视觉反馈组件）
 * - 完整的 TypeScript 类型支持
 *
 * dependencies: React, localStorage, lucide-react
 * exports: useChatPersistence, useChannelManager, TypingIndicator, 所有聊天相关类型
 * notes: 所有数据存储在 localStorage 中，支持多频道隔离
 */

// Components
export { TypingIndicator } from './components/TypingIndicator';

// Hooks
export { useChatPersistence } from './useChatPersistence';
export { useChannelManager } from './useChannelManager';

// Types
export type {
  Chat,
  Message,
  Channel,
  UseChatPersistenceReturn,
  UseChannelManagerReturn,
} from './types';
