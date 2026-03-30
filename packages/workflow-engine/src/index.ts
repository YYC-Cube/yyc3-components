/**
 * file: index.ts
 * description: @yyc3/workflow-engine 包主入口文件 · 导出所有工作流引擎相关类型和服务
 * author: YanYuCloudCube Team
 * version: v1.0.0
 * created: 2026-03-26
 * updated: 2026-03-26
 * status: active
 * tags: [workflow],[automation],[engine]
 *
 * copyright: YanYuCloudCube Team
 * license: MIT
 *
 * brief: 提供完整的工作流引擎解决方案
 *
 * details:
 * - 工作流引擎（工作流定义、执行、暂停、恢复）
 * - 工作流步骤（顺序、并行、条件、循环）
 * - 工作流变量（上下文、输入输出）
 * - 工作流事件（开始、完成、失败、超时）
 * - 工作流历史（执行历史、日志）
 * - 工作流编排（子工作流、依赖关系）
 *
 * dependencies: 无
 * exports: WorkflowEngine, AgentRouter, IntentParser, 所有工作流引擎相关类型
 * notes: 支持复杂的工作流编排和自动化
 */

// Services
export { WorkflowEngine } from './services/workflow-engine';

// Types
export type {
  Workflow,
  WorkflowStep,
  WorkflowExecution,
  WorkflowVariable,
  WorkflowEvent,
  AgentRoute,
  Intent,
  ParsedIntent,
} from './types/workflow';
