/**
 * file: manager.ts
 * description: WebSocket 管理器 · 提供非 React 环境下的 WebSocket 高级管理功能
 * author: YanYuCloudCube Team
 * version: v1.0.0
 * created: 2026-03-26
 * updated: 2026-03-26
 * status: active
 * tags: [websocket],[manager],[utility]
 *
 * copyright: YanYuCloudCube Team
 * license: MIT
 *
 * brief: WebSocket 管理器，适用于非 React 环境
 *
 * details:
 * - 连接管理（连接、断开、重连）
 * - 消息发送和接收
 * - 统计信息收集
 * - 适用于原生 JavaScript、Vue、Angular 等框架
 * - 提供完整的 API 接口
 *
 * dependencies: 无
 * exports: WebSocketManager, createWebSocketManager
 * notes: 当前版本为简化实现，完整功能待后续开发
 */

import type {
  WebSocketConfig,
  WebSocketConnectionInfo,
  WebSocketStatistics,
  WebSocketMessage,
  WebSocketMessageType,
} from './types';

/**
 * WebSocket 管理器接口 / WebSocket manager interface
 */
export interface WebSocketManager {
  /** 连接信息 / Connection info */
  connection: WebSocketConnectionInfo;
  /** 统计信息 / Statistics */
  statistics: WebSocketStatistics;
  /** 发送消息 / Send message */
  send: <T = unknown>(type: WebSocketMessageType, data: T) => void;
  /** 连接 / Connect */
  connect: () => void;
  /** 断开连接 / Disconnect */
  disconnect: () => void;
  /** 重置统计 / Reset statistics */
  resetStatistics: () => void;
}

/**
 * 创建 WebSocket 管理器 / Create WebSocket manager
 */
export function createWebSocketManager(
  config: WebSocketConfig
): WebSocketManager {
  // 简化实现 / Simplified implementation
  return {
    connection: {
      state: 'disconnected',
      connectedDuration: 0,
      reconnectAttempts: 0,
      serverUrl: config.url,
    },
    statistics: {
      messagesSent: 0,
      messagesReceived: 0,
      bytesSent: 0,
      bytesReceived: 0,
      errorCount: 0,
      averageLatency: 0,
      lastActivityAt: new Date(),
    },
    send: () => {},
    connect: () => {},
    disconnect: () => {},
    resetStatistics: () => {},
  };
}
