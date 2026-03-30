/**
 * useTerminalVFS - 终端 ↔ 虚拟文件系统联动 Hook
 *
 * 职责：
 * - 解析终端命令（touch/rm/cat/ls/mkdir/mv/cp/echo/pwd/clear/help）
 * - 将命令转化为 VFS 操作
 * - 输出终端结果行
 * - 发送文件变更事件（供文件树刷新监听）
 *
 * Step 9a: 终端 ↔ 文件系统联动
 *
 * @file hooks/useTerminalVFS.ts
 */

import { useState, useCallback, useRef } from 'react';
import type { UseVirtualFileSystemReturn } from './useVirtualFileSystem';

// ==========================================
// Types
// ==========================================

export interface TerminalLine {
  id: string;
  type: 'input' | 'output' | 'error' | 'info' | 'success';
  content: string;
  timestamp: number;
}

export interface VFSChangeEvent {
  type: 'create' | 'delete' | 'rename' | 'write' | 'mkdir';
  path: string;
  newPath?: string;
  timestamp: number;
}

export interface UseTerminalVFSReturn {
  /** 终端输出行 */
  lines: TerminalLine[];
  /** 执行命令 */
  execute: (command: string) => void;
  /** 清空终端 */
  clear: () => void;
  /** 当前工作目录 */
  cwd: string;
  /** 设置工作目录 */
  setCwd: (path: string) => void;
  /** 命令历史 */
  history: string[];
  /** 文件变更事件（外部可监听） */
  lastChange: VFSChangeEvent | null;
  /** 文件变更计数 */
  changeCount: number;
}

// ==========================================
// Hook 实现
// ==========================================

export function useTerminalVFS(
  vfs?: UseVirtualFileSystemReturn
): UseTerminalVFSReturn {
  const [lines, setLines] = useState<TerminalLine[]>([
    {
      id: 'welcome',
      type: 'info',
      content: 'YYC³ Virtual File System Terminal v1.0.0',
      timestamp: Date.now(),
    },
  ]);
  const [cwd, setCwd] = useState('/');
  const [history, setHistory] = useState<string[]>([]);
  const [lastChange, setLastChange] = useState<VFSChangeEvent | null>(null);
  const [changeCount, setChangeCount] = useState(0);
  const historyIndexRef = useRef(-1);

  const execute = useCallback(
    (command: string) => {
      if (!command.trim()) return;

      // 添加输入行
      const inputLine: TerminalLine = {
        id: `input-${Date.now()}`,
        type: 'input',
        content: `${cwd} $ ${command}`,
        timestamp: Date.now(),
      };
      setLines((prev) => [...prev, inputLine]);

      // 添加到历史
      setHistory((prev) => [...prev, command]);
      historyIndexRef.current = history.length;

      // 解析命令
      const parts = command.trim().split(/\s+/);
      const cmd = parts[0]?.toLowerCase();
      const args = parts.slice(1);

      // 简单命令处理（未连接 VFS 时的 mock）
      let outputLine: TerminalLine;
      switch (cmd) {
        case 'clear':
        case 'cls':
          setLines([]);
          return;

        case 'help':
          outputLine = {
            id: `output-${Date.now()}`,
            type: 'info',
            content: 'Available commands: ls, cd, pwd, mkdir, touch, rm, cat, clear, help',
            timestamp: Date.now(),
          };
          break;

        case 'pwd':
          outputLine = {
            id: `output-${Date.now()}`,
            type: 'output',
            content: cwd,
            timestamp: Date.now(),
          };
          break;

        case 'echo':
          outputLine = {
            id: `output-${Date.now()}`,
            type: 'output',
            content: args.join(' '),
            timestamp: Date.now(),
          };
          break;

        default:
          if (vfs) {
            // 实际 VFS 操作（TODO）
            outputLine = {
              id: `output-${Date.now()}`,
              type: 'info',
              content: `${cmd}: command not yet implemented with VFS`,
              timestamp: Date.now(),
            };
          } else {
            outputLine = {
              id: `error-${Date.now()}`,
              type: 'error',
              content: `${cmd}: command not found (VFS not connected)`,
              timestamp: Date.now(),
            };
          }
      }

      setLines((prev) => [...prev, outputLine]);
    },
    [cwd, history, vfs]
  );

  const clear = useCallback(() => {
    setLines([]);
    setHistory([]);
    historyIndexRef.current = -1;
  }, []);

  return {
    lines,
    execute,
    clear,
    cwd,
    setCwd,
    history,
    lastChange,
    changeCount,
  };
}
