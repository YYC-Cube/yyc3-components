/**
 * file: index.ts
 * description: @yyc3/websocket 包主入口文件 · 导出所有 WebSocket 相关类型、Hooks 和工具函数
 * author: YanYuCloudCube Team
 * version: v1.0.0
 * created: 2026-03-26
 * updated: 2026-03-26
 * status: active
 * tags: [websocket],[real-time],[hook]
 *
 * copyright: YanYuCloudCube Team
 * license: MIT
 *
 * brief: 提供 WebSocket 连接管理的完整解决方案
 *
 * details:
 * - 自动重连机制（支持最大重连次数和重连间隔配置）
 * - 心跳保活（可配置心跳间隔和超时时间）
 * - 降级模式（支持 polling、long-polling、sse 三种降级策略）
 * - 消息订阅（支持类型、来源、优先级过滤）
 * - 连接统计（发送/接收消息数、字节数、延迟等）
 * - TypeScript 完整类型支持
 *
 * dependencies: React, WebSocket API
 * exports: useWebSocket, createWebSocketManager, 所有 WebSocket 相关类型
 * notes: 使用前请确保目标 WebSocket 服务器已启动
 */

// Types
export type {
  WebSocketState,
  WebSocketMessageType,
  WebSocketMessage,
  TerminalOutputMessage,
  DockerLogMessage,
  GitOperationMessage,
  SystemDiagnosticMessage,
  WorkflowExecutionMessage,
  WebSocketConfig,
  WebSocketConnectionInfo,
  WebSocketStatistics,
  WebSocketSubscriptionOptions,
  WebSocketEvent,
  LogStreamConfig,
  LogStreamFilter,
  LogStreamMessage,
  FallbackStrategyConfig,
  WebSocketManagerState,
} from "./types";

// Hooks
export { useWebSocket } from "./useWebSocket";
export type { UseWebSocketReturn } from "./useWebSocket";

// Utils
export { createWebSocketManager } from "./manager";
export type { WebSocketManager } from "./manager";
