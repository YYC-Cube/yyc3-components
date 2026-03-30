/**
 * TerminalPanel - 可交互终端面板 UI 组件
 *
 * 职责：
 * - 渲染 useTerminalVFS 的终端输出行
 * - 命令输入框 + Enter 执行
 * - 命令历史导航（↑/↓）
 * - 自动滚动到底部
 * - 行着色（input/output/error/info/success）
 * - CWD 提示符显示
 * - 清屏 / 全屏切换
 *
 * Step 10a: 终端面板 UI 组件化
 *
 * @file components/collaboration/TerminalPanel.tsx
 */

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Terminal,
  Trash2,
  Maximize2,
  Minimize2,
  ChevronRight,
  Circle,
  Copy,
  Check,
  X,
} from 'lucide-react';
import { cn } from './ui/utils';
import type {
  TerminalLine,
  UseTerminalVFSReturn,
} from '../hooks/useTerminalVFS';

// ==========================================
// Types
// ==========================================

export interface TerminalPanelProps {
  /** useTerminalVFS 返回值 */
  terminal: UseTerminalVFSReturn;
  /** 面板高度类名 */
  className?: string;
  /** 是否可见 */
  visible?: boolean;
  /** 关闭回调 */
  onClose?: () => void;
  /** 全屏状态 */
  isFullscreen?: boolean;
  /** 全屏切换 */
  onToggleFullscreen?: () => void;
}

// ==========================================
// Line Renderer
// ==========================================

const LINE_COLORS: Record<TerminalLine['type'], string> = {
  input: 'text-cyan-400',
  output: 'text-slate-300',
  error: 'text-red-400',
  info: 'text-amber-400',
  success: 'text-emerald-400',
};

const LINE_PREFIXES: Record<TerminalLine['type'], string> = {
  input: '',
  output: '',
  error: '✗ ',
  info: 'ℹ ',
  success: '✓ ',
};

function TerminalLineRow({ line }: { line: TerminalLine }) {
  return (
    <div
      className={cn(
        'whitespace-pre-wrap break-all px-3 py-[1px] font-mono text-[11px] leading-[18px] transition-colors hover:bg-white/[0.02]',
        LINE_COLORS[line.type]
      )}
    >
      <span className="select-none opacity-60">{LINE_PREFIXES[line.type]}</span>
      {line.content}
    </div>
  );
}

// ==========================================
// Component
// ==========================================

export function TerminalPanel({
  terminal,
  className,
  visible = true,
  onClose,
  isFullscreen = false,
  onToggleFullscreen,
}: TerminalPanelProps) {
  const [inputValue, setInputValue] = useState('');
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 自动滚动到底部
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [terminal.lines.length]);

  // 聚焦输入框
  useEffect(() => {
    if (visible) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [visible]);

  // 执行命令
  const handleExecute = useCallback(() => {
    const cmd = inputValue.trim();
    if (!cmd) return;
    terminal.execute(cmd);
    setInputValue('');
    setHistoryIndex(-1);
  }, [inputValue, terminal]);

  // 键盘事件
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleExecute();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const history = terminal.history;
        if (history.length === 0) return;
        const newIndex =
          historyIndex < history.length - 1 ? historyIndex + 1 : historyIndex;
        setHistoryIndex(newIndex);
        setInputValue(history[history.length - 1 - newIndex] || '');
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyIndex <= 0) {
          setHistoryIndex(-1);
          setInputValue('');
        } else {
          const newIndex = historyIndex - 1;
          setHistoryIndex(newIndex);
          setInputValue(
            terminal.history[terminal.history.length - 1 - newIndex] || ''
          );
        }
      } else if (e.key === 'l' && e.ctrlKey) {
        e.preventDefault();
        terminal.clear();
      } else if (e.key === 'c' && e.ctrlKey) {
        e.preventDefault();
        setInputValue('');
      }
    },
    [handleExecute, historyIndex, terminal]
  );

  // 复制输出
  const handleCopyOutput = useCallback(() => {
    const text = terminal.lines.map((l: TerminalLine) => l.content).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [terminal.lines]);

  // 点击面板聚焦输入
  const handlePanelClick = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  // 终端统计
  const stats = useMemo(
    () => ({
      commands: terminal.history.length,
      lines: terminal.lines.length,
      changes: terminal.changeCount,
    }),
    [terminal.history.length, terminal.lines.length, terminal.changeCount]
  );

  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: isFullscreen ? '100%' : 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'flex flex-col border-t border-white/[0.06] bg-slate-950/95',
        isFullscreen ? 'absolute inset-0 z-40' : '',
        className
      )}
      onClick={handlePanelClick}
    >
      {/* Terminal Header */}
      <div className="flex flex-none items-center justify-between border-b border-white/[0.04] bg-black/30 px-3 py-1.5">
        <div className="flex items-center gap-2">
          {/* 三点圆 */}
          <div className="flex items-center gap-1">
            <Circle className="h-2 w-2 fill-red-500 text-red-500" />
            <Circle className="h-2 w-2 fill-amber-500 text-amber-500" />
            <Circle className="h-2 w-2 fill-emerald-500 text-emerald-500" />
          </div>
          <div className="flex items-center gap-1.5 font-mono text-[10px] text-slate-400">
            <Terminal className="h-3 w-3" />
            <span>YYC³ Terminal</span>
            <span className="text-slate-700">|</span>
            <span className="text-cyan-500">{terminal.cwd}</span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {/* 统计 */}
          <div className="mr-2 hidden items-center gap-2 font-mono text-[9px] text-slate-600 sm:flex">
            <span>{stats.commands} cmds</span>
            <span className="text-slate-800">·</span>
            <span>{stats.changes} changes</span>
          </div>

          {/* 复制按钮 */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCopyOutput();
            }}
            className="rounded p-1 text-slate-600 transition-colors hover:bg-white/5 hover:text-slate-300"
            title="复制输出"
          >
            {copied ? (
              <Check className="h-3 w-3 text-emerald-400" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
          </button>

          {/* 清屏 */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              terminal.clear();
            }}
            className="rounded p-1 text-slate-600 transition-colors hover:bg-white/5 hover:text-slate-300"
            title="清空终端 (Ctrl+L)"
          >
            <Trash2 className="h-3 w-3" />
          </button>

          {/* 全屏 */}
          {onToggleFullscreen && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFullscreen();
              }}
              className="rounded p-1 text-slate-600 transition-colors hover:bg-white/5 hover:text-slate-300"
              title={isFullscreen ? '退出全屏' : '全屏'}
            >
              {isFullscreen ? (
                <Minimize2 className="h-3 w-3" />
              ) : (
                <Maximize2 className="h-3 w-3" />
              )}
            </button>
          )}

          {/* 关闭 */}
          {onClose && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="rounded p-1 text-slate-600 transition-colors hover:bg-white/5 hover:text-slate-300"
              title="关闭终端"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      {/* Terminal Output */}
      <div
        ref={scrollRef}
        className={cn(
          'flex-1 overflow-y-auto overflow-x-hidden',
          isFullscreen ? 'min-h-0' : 'h-[200px]'
        )}
      >
        <div className="py-1">
          {terminal.lines.map((line: TerminalLine) => (
            <TerminalLineRow key={line.id} line={line} />
          ))}
        </div>
      </div>

      {/* Command Input */}
      <div className="flex flex-none items-center border-t border-white/[0.04] bg-black/20 px-3 py-1.5">
        <span className="mr-2 flex flex-none items-center gap-1 font-mono text-[10px] text-cyan-500">
          <ChevronRight className="h-3 w-3" />
          <span className="hidden text-slate-600 sm:inline">
            {terminal.cwd}
          </span>
          <span className="text-cyan-500">$</span>
        </span>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="输入命令..."
          spellCheck={false}
          autoComplete="off"
          className="flex-1 bg-transparent font-mono text-[11px] text-slate-200 placeholder-slate-700 caret-cyan-400 outline-none"
        />
        <div className="flex flex-none items-center gap-2 font-mono text-[9px] text-slate-700">
          <span>↑↓ 历史</span>
          <span>Ctrl+L 清屏</span>
        </div>
      </div>
    </motion.div>
  );
}
