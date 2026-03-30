/**
 * file: types.ts
 * description: 诊断类型定义文件 · 包含所有诊断相关的 TypeScript 接口和类型
 * author: YanYuCloudCube Team
 * version: v1.0.0
 * created: 2026-03-26
 * updated: 2026-03-26
 * status: active
 * tags: [diagnostics],[types],[typescript]
 *
 * copyright: YanYuCloudCube Team
 * license: MIT
 *
 * brief: 诊断相关的类型定义
 *
 * details:
 * - DiagnosticResult: 单个诊断结果接口
 * - DiagnosticReport: 完整诊断报告接口
 * - 支持多语言（中文/English）
 * - 包含详细的错误信息
 * - 提供时间戳和统计信息
 *
 * dependencies: 无
 * exports: DiagnosticResult, DiagnosticReport
 * notes: 所有接口均支持扩展，便于添加新的诊断项
 */

export interface DiagnosticResult {
  name: string;
  passed: boolean;
  message: string;
  error?: string;
}

export interface DiagnosticReport {
  timestamp: string;
  overallStatus: 'HEALTHY' | 'WARNING' | 'CRITICAL';
  passedChecks: number;
  failedChecks: number;
  results: DiagnosticResult[];
}
