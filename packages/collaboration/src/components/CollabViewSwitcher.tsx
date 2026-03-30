/**
 * CollabViewSwitcher - 视图切换栏
 *
 * 职责：
 * - 返回上一级/主页
 * - 预览视图切换（合并中栏和右栏）
 * - 代码视图切换（显示右栏代码编辑）
 * - 全局搜索
 * - 扩展菜单
 *
 * 对应规格：Functional-Spec §视图切换栏
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Eye,
  Code2,
  Search,
  MoreHorizontal,
  Columns2,
  Maximize2,
  Minimize2,
  Layout,
  Download,
  Share2,
  Keyboard,
  X,
} from 'lucide-react';
import { cn } from './ui/utils';

// ==========================================
// Types
// ==========================================

export type ViewMode = 'split' | 'preview' | 'code';

export interface CollabViewSwitcherProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  onBack: () => void;
  onSearch?: (query: string) => void;
}

// ==========================================
// Component
// ==========================================

export function CollabViewSwitcher({
  currentView,
  onViewChange,
  onBack,
  onSearch,
}: CollabViewSwitcherProps) {
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const moreMenuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close more menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        moreMenuRef.current &&
        !moreMenuRef.current.contains(e.target as Node)
      ) {
        setShowMoreMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto focus search input
  useEffect(() => {
    if (showSearch) {
      searchInputRef.current?.focus();
    }
  }, [showSearch]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showSearch) {
          setShowSearch(false);
          setSearchQuery('');
        }
        if (showMoreMenu) setShowMoreMenu(false);
      }
      // Ctrl+1 = Preview, Ctrl+2 = Code, Ctrl+3 = Split
      if (e.ctrlKey || e.metaKey) {
        if (e.key === '1') {
          e.preventDefault();
          onViewChange('preview');
        }
        if (e.key === '2') {
          e.preventDefault();
          onViewChange('code');
        }
        if (e.key === '3') {
          e.preventDefault();
          onViewChange('split');
        }
        if (e.key === 'f' && e.shiftKey) {
          e.preventDefault();
          setShowSearch(true);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showSearch, showMoreMenu, onViewChange]);

  const handleSearchSubmit = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && searchQuery.trim()) {
        onSearch?.(searchQuery.trim());
      }
    },
    [searchQuery, onSearch]
  );

  return (
    <div className="flex items-center gap-1 border-b border-white/[0.06] bg-slate-950/60 px-2 py-1.5 backdrop-blur-sm">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-1 rounded-md px-2 py-1 font-mono text-[10px] text-slate-500 transition-all hover:bg-white/5 hover:text-slate-200"
        title="返回 (Esc)"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">返回</span>
      </button>

      <div className="mx-1 h-4 w-px bg-white/[0.06]" />

      {/* View Mode Buttons */}
      <div className="flex items-center gap-0.5 rounded-lg border border-white/[0.04] bg-black/20 p-0.5">
        <button
          onClick={() => onViewChange('preview')}
          className={cn(
            'flex items-center gap-1.5 rounded-md px-2.5 py-1 font-mono text-[10px] transition-all',
            currentView === 'preview'
              ? 'border border-emerald-500/20 bg-emerald-500/15 text-emerald-400'
              : 'border border-transparent text-slate-500 hover:text-slate-300'
          )}
          title="预览视图 (Ctrl+1)"
        >
          <Eye className="h-3 w-3" />
          <span className="hidden md:inline">预览</span>
        </button>

        <button
          onClick={() => onViewChange('code')}
          className={cn(
            'flex items-center gap-1.5 rounded-md px-2.5 py-1 font-mono text-[10px] transition-all',
            currentView === 'code'
              ? 'border border-blue-500/20 bg-blue-500/15 text-blue-400'
              : 'border border-transparent text-slate-500 hover:text-slate-300'
          )}
          title="代码视图 (Ctrl+2)"
        >
          <Code2 className="h-3 w-3" />
          <span className="hidden md:inline">代码</span>
        </button>

        <button
          onClick={() => onViewChange('split')}
          className={cn(
            'flex items-center gap-1.5 rounded-md px-2.5 py-1 font-mono text-[10px] transition-all',
            currentView === 'split'
              ? 'border border-violet-500/20 bg-violet-500/15 text-violet-400'
              : 'border border-transparent text-slate-500 hover:text-slate-300'
          )}
          title="分栏视图 (Ctrl+3)"
        >
          <Columns2 className="h-3 w-3" />
          <span className="hidden md:inline">分栏</span>
        </button>
      </div>

      <div className="mx-1 h-4 w-px bg-white/[0.06]" />

      {/* Search */}
      <AnimatePresence>
        {showSearch ? (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 220, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative overflow-hidden"
          >
            <Search className="absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-600" />
            <input
              ref={searchInputRef}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchSubmit}
              placeholder="搜索文件、代码..."
              className="w-full rounded-md border border-white/[0.06] bg-black/30 py-1 pl-7 pr-7 font-mono text-[10px] text-slate-300 placeholder-slate-600 focus:border-emerald-500/30 focus:outline-none"
            />
            <button
              onClick={() => {
                setShowSearch(false);
                setSearchQuery('');
              }}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400"
            >
              <X className="h-3 w-3" />
            </button>
          </motion.div>
        ) : (
          <button
            onClick={() => setShowSearch(true)}
            className="flex items-center gap-1 rounded-md px-2 py-1 font-mono text-[10px] text-slate-500 transition-all hover:bg-white/5 hover:text-slate-300"
            title="搜索 (Ctrl+Shift+F)"
          >
            <Search className="h-3.5 w-3.5" />
            <span className="hidden lg:inline">搜索</span>
          </button>
        )}
      </AnimatePresence>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Keyboard Shortcuts hint */}
      <div className="hidden items-center gap-2 font-mono text-[9px] text-slate-700 xl:flex">
        <span className="flex items-center gap-0.5">
          <kbd className="rounded border border-white/[0.06] bg-black/30 px-1 py-0.5">
            ⌘1
          </kbd>
          预览
        </span>
        <span className="flex items-center gap-0.5">
          <kbd className="rounded border border-white/[0.06] bg-black/30 px-1 py-0.5">
            ⌘2
          </kbd>
          代码
        </span>
      </div>

      {/* More Menu */}
      <div className="relative" ref={moreMenuRef}>
        <button
          onClick={() => setShowMoreMenu(!showMoreMenu)}
          className={cn(
            'rounded-md p-1.5 transition-all',
            showMoreMenu
              ? 'bg-white/10 text-white'
              : 'text-slate-500 hover:bg-white/5 hover:text-slate-300'
          )}
          title="更多选项"
        >
          <MoreHorizontal className="h-3.5 w-3.5" />
        </button>

        <AnimatePresence>
          {showMoreMenu && (
            <motion.div
              initial={{ opacity: 0, y: -4, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.96 }}
              className="absolute right-0 top-full z-50 mt-1 min-w-[180px] rounded-xl border border-white/[0.08] bg-slate-900/95 py-1 shadow-2xl shadow-black/50 backdrop-blur-xl"
            >
              {[
                {
                  icon: <Layout className="h-3.5 w-3.5" />,
                  label: '重置布局',
                  shortcut: '',
                },
                {
                  icon: <Maximize2 className="h-3.5 w-3.5" />,
                  label: '全屏模式',
                  shortcut: 'F11',
                },
                {
                  icon: <Download className="h-3.5 w-3.5" />,
                  label: '导出项目',
                  shortcut: '',
                },
                {
                  icon: <Share2 className="h-3.5 w-3.5" />,
                  label: '分享协作',
                  shortcut: '',
                },
                {
                  icon: <Keyboard className="h-3.5 w-3.5" />,
                  label: '快捷键指南',
                  shortcut: '?',
                },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => setShowMoreMenu(false)}
                  className="flex w-full items-center gap-2.5 px-3 py-1.5 font-mono text-[11px] text-slate-400 transition-all hover:bg-white/[0.04] hover:text-slate-200"
                >
                  {item.icon}
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.shortcut && (
                    <span className="text-[9px] text-slate-600">
                      {item.shortcut}
                    </span>
                  )}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
