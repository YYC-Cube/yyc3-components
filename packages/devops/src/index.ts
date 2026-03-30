/**
 * file: index.ts
 * description: @yyc3/devops 包主入口文件 · 导出所有 DevOps 相关类型、Hooks、服务和组件
 * author: YanYuCloudCube Team
 * version: v1.0.0
 * created: 2026-03-26
 * updated: 2026-03-26
 * status: active
 * tags: [devops],[mcp],[workflow]
 *
 * copyright: YanYuCloudCube Team
 * license: MIT
 *
 * brief: 提供完整的 DevOps 智能运维解决方案
 *
 * details:
 * - MCP 服务器管理（探测、连接、断开、自动连接）
 * - MCP 工具执行（远程工具调用和结果返回）
 * - 工作流管理（创建、更新、删除、执行）
 * - 基础设施服务管理
 * - 诊断问题追踪和修复
 * - 操作日志记录和查询
 * - DevOps 指标统计和监控
 * - WebSocket 连接状态监控
 *
 * dependencies: React, WebSocket API, MCP Protocol
 * exports: useDevOps, DevOpsService, 所有 DevOps 相关组件和类型
 * notes: 支持 MCP（Model Context Protocol）标准
 */

// Hooks
export { useDevOps } from './hooks/useDevOps';

// Services
export { devOpsService } from './services/DevOpsService';

// Types
export type {
  MCPServer,
  MCPToolResult,
  MCPTool,
  MCPToolParameter,
  Workflow,
  WorkflowStep,
  WorkflowExecutionResult,
  WorkflowCreateInput,
  WorkflowUpdateInput,
  InfraService,
  InfraServiceStatus,
  DiagnosticIssue,
  DiagnosticSeverity,
  DiagnosticIssueStatus,
  OpsLogEntry,
  OpsLogLevel,
  DevOpsMetrics,
  DevOpsConfig,
  WSConnectionStatus,
  UseDevOpsReturn,
} from './types/devops';

// Components
export { default as DevOpsHub } from './components/DevOpsHub';
export { default as GitPanel } from './components/GitPanel';
export { default as SystemMonitor } from './components/SystemMonitor';
export { default as WebSocketStatus } from './components/WebSocketStatus';
