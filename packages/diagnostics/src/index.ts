/**
 * file: index.ts
 * description: @yyc3/diagnostics 包主入口文件 · 导出所有诊断相关类型和工具函数
 * author: YanYuCloudCube Team
 * version: v1.0.0
 * created: 2026-03-26
 * updated: 2026-03-26
 * status: active
 * tags: [diagnostics],[utility],[health-check]
 *
 * copyright: YanYuCloudCube Team
 * license: MIT
 *
 * brief: 提供系统健康检查和数据修复的完整解决方案
 *
 * details:
 * - 浏览器环境检查（API 可用性）
 * - localStorage 检查（读写功能）
 * - 配置数据检查（JSON 有效性）
 * - 系统诊断报告（完整的状态报告）
 * - 数据修复（自动修复损坏数据）
 * - 数据清理（清除所有应用数据）
 * - 报告格式化（美观的文本报告）
 *
 * dependencies: localStorage, Browser APIs
 * exports: runDiagnostics, clearAllData, repairConfigData, formatDiagnosticReport, 所有诊断相关类型
 * notes: 所有操作均在客户端执行，无需服务器支持
 */

// Types
export type { DiagnosticResult, DiagnosticReport } from "./types";

// Functions
export {
  runDiagnostics,
  clearAllData,
  repairConfigData,
  formatDiagnosticReport,
} from "./diagnostics";
