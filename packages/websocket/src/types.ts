/**
 * file: types.ts
 * description: WebSocket 类型定义文件 · 包含所有 WebSocket 相关的 TypeScript 接口和类型
 * author: YanYuCloudCube Team
 * version: v1.0.0
 * created: 2026-03-26
 * updated: 2026-03-26
 * status: active
 * tags: [websocket],[types],[typescript]
 *
 * copyright: YanYuCloudCube Team
 * license: MIT
 *
 * brief: WebSocket 相关的类型定义
 *
 * details:
 * - WebSocketState: 连接状态枚举
 * - WebSocketMessageType: 消息类型枚举
 * - WebSocketMessage: 通用消息接口
 * - WebSocketConfig: WebSocket 配置接口
 * - WebSocketConnectionInfo: 连接信息接口
 * - WebSocketStatistics: 统计信息接口
 * - WebSocketSubscriptionOptions: 订阅选项接口
 * - FallbackStrategyConfig: 降级策略配置接口
 *
 * dependencies: 无
 * exports: 所有 WebSocket 相关类型
 * notes: 所有类型均支持泛型，确保类型安全
 */

/**
 * WebSocket 连接状态 / WebSocket connection state
 */
export type WebSocketState =
  | 'connecting' // 连接中 / Connecting
  | 'connected' // 已连接 / Connected
  | 'disconnected' // 已断开 / Disconnected
  | 'reconnecting' // 重连中 / Reconnecting
  | 'failed'; // 连接失败 / Failed

/**
 * WebSocket 消息类型 / WebSocket message type
 */
export type WebSocketMessageType =
  | 'terminal_output' // 终端输出 / Terminal output
  | 'docker_log' // Docker 日志 / Docker log
  | 'git_operation' // Git 操作 / Git operation
  | 'system_diagnostic' // 系统诊断 / System diagnostic
  | 'workflow_execution' // 工作流执行 / Workflow execution
  | 'heartbeat' // 心跳 / Heartbeat
  | 'error' // 错误 / Error
  | 'ping' // Ping
  | 'pong'; // Pong

/**
 * WebSocket 消息 / WebSocket message
 */
export interface WebSocketMessage<T = unknown> {
  /** 消息ID / Message ID */
  id: string;
  /** 消息类型 / Message type */
  type: WebSocketMessageType;
  /** 消息数据 / Message data */
  data: T;
  /** 时间戳 / Timestamp */
  timestamp: Date;
  /** 来源 / Source */
  source?: string;
  /** 优先级 / Priority */
  priority?: 'low' | 'normal' | 'high';
}

/**
 * WebSocket 配置 / WebSocket configuration
 */
export interface WebSocketConfig {
  /** WebSocket URL */
  url: string;
  /** 重连间隔（毫秒）/ Reconnect interval in milliseconds */
  reconnectInterval?: number;
  /** 最大重连次数 / Maximum reconnection attempts */
  maxReconnectAttempts?: number;
  /** 心跳间隔（毫秒）/ Heartbeat interval in milliseconds */
  heartbeatInterval?: number;
  /** 心跳超时（毫秒）/ Heartbeat timeout in milliseconds */
  heartbeatTimeout?: number;
  /** 自动重连 / Auto reconnect */
  autoReconnect?: boolean;
  /** 协议 / Protocols */
  protocols?: string | string[];
}

/**
 * WebSocket 连接信息 / WebSocket connection info
 */
export interface WebSocketConnectionInfo {
  /** 连接状态 / Connection state */
  state: WebSocketState;
  /** 已连接时长（毫秒）/ Connected duration in milliseconds */
  connectedDuration: number;
  /** 重连次数 / Reconnection attempts */
  reconnectAttempts: number;
  /** 最后连接时间 / Last connected time */
  lastConnectedAt?: Date;
  /** 最后断开时间 / Last disconnected time */
  lastDisconnectedAt?: Date;
  /** 最后错误 / Last error */
  lastError?: string;
  /** 服务器 URL / Server URL */
  serverUrl: string;
}

/**
 * WebSocket 统计信息 / WebSocket statistics
 */
export interface WebSocketStatistics {
  /** 发送消息数 / Messages sent */
  messagesSent: number;
  /** 接收消息数 / Messages received */
  messagesReceived: number;
  /** 发送字节数 / Bytes sent */
  bytesSent: number;
  /** 接收字节数 / Bytes received */
  bytesReceived: number;
  /** 错误次数 / Error count */
  errorCount: number;
  /** 平均延迟（毫秒）/ Average latency in milliseconds */
  averageLatency: number;
  /** 最后活动时间 / Last activity time */
  lastActivityAt: Date;
}

/**
 * WebSocket 订阅选项 / WebSocket subscription options
 */
export interface WebSocketSubscriptionOptions {
  /** 消息类型过滤 / Message type filter */
  messageTypes?: WebSocketMessageType[];
  /** 来源过滤 / Source filter */
  sources?: string[];
  /** 优先级过滤 / Priority filter */
  priorities?: ('low' | 'normal' | 'high')[];
  /** 缓冲大小 / Buffer size */
  bufferSize?: number;
  /** 批处理 / Batch processing */
  batchProcessing?: boolean;
  /** 批处理间隔（毫秒）/ Batch interval in milliseconds */
  batchInterval?: number;
}

/**
 * 降级策略配置 / Fallback strategy configuration
 */
export interface FallbackStrategyConfig {
  /** 是否启用降级 / Enable fallback */
  enabled: boolean;
  /** 降级模式 / Fallback mode */
  mode: 'polling' | 'long-polling' | 'sse';
  /** 轮询间隔（毫秒）/ Polling interval in milliseconds */
  pollingInterval?: number;
  /** 最大轮询失败次数 / Maximum polling failures */
  maxPollingFailures?: number;
  /** 降级触发条件 / Fallback trigger */
  trigger: {
    /** 连接失败次数 / Connection failure count */
    connectionFailures?: number;
    /** 超时时间（毫秒）/ Timeout in milliseconds */
    timeout?: number;
  };
}

export interface TerminalOutputMessage extends WebSocketMessage<string> {
  type: 'terminal_output';
  data: string;
  terminalId?: string;
}

export interface DockerLogMessage extends WebSocketMessage<
  Record<string, unknown>
> {
  type: 'docker_log';
  data: {
    containerId: string;
    containerName?: string;
    log: string;
    timestamp: string;
    stream?: 'stdout' | 'stderr';
  };
}

export interface GitOperationMessage extends WebSocketMessage<
  Record<string, unknown>
> {
  type: 'git_operation';
  data: {
    repository: string;
    operation: string;
    status: 'pending' | 'success' | 'error';
    progress?: number;
    message?: string;
  };
}

export interface SystemDiagnosticMessage extends WebSocketMessage<
  Record<string, unknown>
> {
  type: 'system_diagnostic';
  data: {
    cpu: number;
    memory: number;
    disk: number;
    network?: {
      bytesIn: number;
      bytesOut: number;
    };
  };
}

export interface WorkflowExecutionMessage extends WebSocketMessage<
  Record<string, unknown>
> {
  type: 'workflow_execution';
  data: {
    workflowId: string;
    stepId?: string;
    status: 'running' | 'completed' | 'failed' | 'paused';
    progress?: number;
    result?: unknown;
    error?: string;
  };
}

export type WebSocketEvent =
  | { type: 'open' }
  | { type: 'close'; code: number; reason: string }
  | { type: 'error'; error: Error }
  | { type: 'message'; data: WebSocketMessage }
  | { type: 'reconnect'; attempt: number }
  | { type: 'state_change'; from: WebSocketState; to: WebSocketState };

export interface LogStreamConfig {
  source: string;
  filter?: LogStreamFilter;
  bufferSize?: number;
  batchInterval?: number;
}

export interface LogStreamFilter {
  levels?: ('info' | 'warn' | 'error' | 'debug')[];
  sources?: string[];
  keywords?: string[];
  since?: Date;
  until?: Date;
}

export interface LogStreamMessage {
  id: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  source: string;
  message: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

export type WebSocketManagerState = WebSocketState;
