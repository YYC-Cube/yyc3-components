/**
 * file: index.ts
 * description: @yyc3/backend-bridge 包主入口文件 · 导出所有后端桥接相关类型和服务
 * author: YanYuCloudCube Team
 * version: v1.0.0
 * created: 2026-03-26
 * updated: 2026-03-26
 * status: active
 * tags: [backend],[bridge],[websocket]
 *
 * copyright: YanYuCloudCube Team
 * license: MIT
 *
 * brief: 提供完整的后端桥接解决方案
 *
 * details:
 * - 后端桥接（WebSocket 连接、API 调用）
 * - 消息代理（消息路由、过滤、转换）
 * - 连接管理（自动重连、心跳、超时）
 * - 错误处理（错误捕获、重试、降级）
 * - 状态同步（客户端状态同步）
 * - 事件总线（事件发布、订阅、广播）
 *
 * dependencies: WebSocket API, Fetch API
 * exports: BackendBridge, WebSocketProxy, 所有后端桥接相关类型
 * notes: 提供统一的后端通信接口
 */

// Services
export { BackendBridge, getBackendBridge } from './services/backend-bridge';

// Types
export type {
  ConnectionState,
  BackendMessage,
  BridgeConfig,
  BridgeEvent,
  ConnectionStats,
  UseBackendBridgeReturn,
} from './types/backend-bridge';
