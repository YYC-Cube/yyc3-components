/**
 * file: index.ts
 * description: @yyc3/terminal 包主入口文件 · 导出所有终端相关类型、Hooks 和工具函数
 * author: YanYuCloudCube Team
 * version: v1.0.0
 * created: 2026-03-26
 * updated: 2026-03-26
 * status: active
 * tags: [terminal],[shell],[hook]
 *
 * copyright: YanYuCloudCube Team
 * license: MIT
 *
 * brief: 提供终端会话管理的完整解决方案
 *
 * details:
 * - 终端会话管理（创建、关闭、查询）
 * - 命令执行（支持异步执行）
 * - 命令历史（历史记录和清理）
 * - 快捷命令（自定义快捷方式）
 * - 统计信息（会话数、命令数、成功率等）
 * - 多 Shell 支持（bash, zsh, sh, powershell, cmd, fish）
 *
 * dependencies: React (useState, useEffect, useCallback, useRef)
 * exports: useTerminal, 所有终端相关类型
 * notes: 当前版本为简化实现，使用模拟服务
 */

// Types
export type {
  TerminalSession,
  TerminalSessionConfig,
  TerminalSessionStatus,
  ShellType,
  CommandExecutionResult,
  CommandHistoryEntry,
  TerminalShortcut,
  TerminalMetrics,
} from "./types";

// Hooks
export { useTerminal } from "./useTerminal";
export type { UseTerminalReturn } from "./useTerminal";
