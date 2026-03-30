/**
 * file: types.ts
 * description: 终端类型定义文件 · 包含所有终端相关的 TypeScript 接口和类型
 * author: YanYuCloudCube Team
 * version: v1.0.0
 * created: 2026-03-26
 * updated: 2026-03-26
 * status: active
 * tags: [terminal],[types],[typescript]
 *
 * copyright: YanYuCloudCube Team
 * license: MIT
 *
 * brief: 终端相关的类型定义
 *
 * details:
 * - TerminalSessionStatus: 会话状态枚举
 * - ShellType: Shell 类型枚举（支持多种 Shell）
 * - TerminalSession: 终端会话接口
 * - TerminalSessionConfig: 会话配置接口
 * - CommandExecutionResult: 命令执行结果接口
 * - CommandHistoryEntry: 命令历史条目接口
 * - TerminalShortcut: 快捷命令接口
 * - TerminalMetrics: 终端统计接口
 *
 * dependencies: 无
 * exports: 所有终端相关类型
 * notes: 支持多种操作系统和 Shell 类型
 */

export type TerminalSessionStatus = "idle" | "active" | "running" | "exited" | "error";
export type ShellType = "bash" | "zsh" | "sh" | "powershell" | "cmd" | "fish";

export interface TerminalSessionConfig {
  shell: ShellType;
  cwd: string;
  env: Record<string, string>;
  rows: number;
  cols: number;
  enableColors: boolean;
  enableUtf8: boolean;
}

export interface TerminalSession {
  id: string;
  name: string;
  status: TerminalSessionStatus;
  shell: ShellType;
  pid: number | null;
  cwd: string;
  createdAt: string;
  lastActiveAt: string;
  config: TerminalSessionConfig;
  historyCount: number;
}

export type CommandExecutionStatus = "pending" | "running" | "success" | "failed" | "timeout" | "cancelled";

export interface CommandExecutionResult {
  command: string;
  status: CommandExecutionStatus;
  exitCode: number | null;
  stdout: string;
  stderr: string;
  duration: number;
  startedAt: string;
  finishedAt: string | null;
  cwd: string;
}

export interface CommandHistoryEntry {
  sessionId: string;
  command: string;
  executedAt: string;
  exitCode: number | null;
  duration: number;
}

export interface TerminalShortcut {
  id: string;
  name: string;
  command: string;
  description?: string;
  createdAt: string;
}

export interface TerminalMetrics {
  totalSessions: number;
  activeSessions: number;
  totalCommands: number;
  successfulCommands: number;
  failedCommands: number;
  averageCommandDuration: number;
}
