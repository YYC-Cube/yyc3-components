/**
 * ProjectTemplateSelector - 项目模板选择器组件
 *
 * 职责：
 * - 展示可用项目模板卡片
 * - 模板预览（文件列表 + 描述）
 * - 一键初始化 VFS
 * - 动画过渡
 *
 * Step 10c: 项目模板系统
 *
 * @file components/collaboration/ProjectTemplateSelector.tsx
 */

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  FolderOpen,
  FileCode,
  Check,
  ChevronRight,
  Sparkles,
  Package,
} from 'lucide-react';
import { cn } from './ui/utils';
import {
  PROJECT_TEMPLATES,
  type ProjectTemplate,
} from '../services/project-templates';

// ==========================================
// Types
// ==========================================

export interface ProjectTemplateSelectorProps {
  visible: boolean;
  onClose: () => void;
  /** 选择模板后回调（传递模板 ID） */
  onSelectTemplate: (template: ProjectTemplate) => void;
}

// ==========================================
// Component
// ==========================================

export function ProjectTemplateSelector({
  visible,
  onClose,
  onSelectTemplate,
}: ProjectTemplateSelectorProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const selectedTemplate = selectedId
    ? PROJECT_TEMPLATES.find((t) => t.id === selectedId)
    : null;

  const handleConfirm = useCallback(() => {
    if (!selectedTemplate) return;
    setConfirmed(true);
    // 短暂延迟让动画完成
    setTimeout(() => {
      onSelectTemplate(selectedTemplate);
      setConfirmed(false);
      setSelectedId(null);
      onClose();
    }, 500);
  }, [selectedTemplate, onSelectTemplate, onClose]);

  const handleClose = useCallback(() => {
    setSelectedId(null);
    setConfirmed(false);
    onClose();
  }, [onClose]);

  if (!visible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="bg-slate-950/98 flex max-h-[80vh] w-[700px] max-w-[90vw] flex-col overflow-hidden rounded-2xl border border-white/[0.08] shadow-2xl shadow-black/50 backdrop-blur-xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex flex-none items-center justify-between border-b border-white/[0.06] px-5 py-3.5">
            <div className="flex items-center gap-2.5">
              <div className="rounded-lg bg-violet-500/10 p-1.5">
                <Package className="h-4 w-4 text-violet-400" />
              </div>
              <div>
                <div className="font-mono text-sm text-slate-200">新建项目</div>
                <div className="font-mono text-[10px] text-slate-600">
                  选择模板快速初始化项目
                </div>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="rounded-md p-1.5 text-slate-500 transition-all hover:bg-white/5 hover:text-slate-300"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Content: Templates Grid + Preview */}
          <div className="flex min-h-0 flex-1 overflow-hidden">
            {/* Left: Templates */}
            <div className="w-[55%] space-y-2 overflow-y-auto border-r border-white/[0.04] p-4">
              {PROJECT_TEMPLATES.map((template) => (
                <motion.button
                  key={template.id}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setSelectedId(template.id)}
                  className={cn(
                    'flex w-full items-start gap-3 rounded-xl border px-3.5 py-3 text-left transition-all',
                    selectedId === template.id
                      ? 'border-white/[0.12] bg-white/[0.06]'
                      : 'border-white/[0.04] bg-black/10 hover:border-white/[0.06] hover:bg-white/[0.03]'
                  )}
                >
                  {/* Icon */}
                  <div
                    className="flex h-10 w-10 flex-none items-center justify-center rounded-lg text-lg"
                    style={{
                      background: `${template.color}15`,
                      border: `1px solid ${template.color}30`,
                    }}
                  >
                    {template.icon}
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-slate-200">
                        {template.name}
                      </span>
                      {selectedId === template.id && (
                        <Check className="h-3 w-3 flex-none text-emerald-400" />
                      )}
                    </div>
                    <div className="mt-0.5 line-clamp-2 font-mono text-[10px] text-slate-500">
                      {template.description}
                    </div>
                    <div className="mt-1.5 flex items-center gap-1.5">
                      {template.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded border border-white/[0.04] bg-white/[0.04] px-1.5 py-0.5 font-mono text-[8px] text-slate-500"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <ChevronRight
                    className={cn(
                      'mt-1 h-3.5 w-3.5 flex-none text-slate-600 transition-transform',
                      selectedId === template.id &&
                        'translate-x-0.5 text-slate-400'
                    )}
                  />
                </motion.button>
              ))}
            </div>

            {/* Right: Preview */}
            <div className="flex w-[45%] flex-col overflow-hidden">
              <AnimatePresence mode="wait">
                {selectedTemplate ? (
                  <motion.div
                    key={selectedTemplate.id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-1 flex-col overflow-hidden"
                  >
                    {/* Preview Header */}
                    <div className="flex-none border-b border-white/[0.04] px-4 py-3">
                      <div className="flex items-center gap-2 font-mono text-xs text-slate-300">
                        <span className="text-lg">{selectedTemplate.icon}</span>
                        <span>{selectedTemplate.name}</span>
                      </div>
                      <div className="mt-1 font-mono text-[10px] text-slate-600">
                        {Object.keys(selectedTemplate.files).length} 个文件 ·
                        入口: {selectedTemplate.entryPoint}
                      </div>
                    </div>

                    {/* File List */}
                    <div className="min-h-0 flex-1 overflow-y-auto px-4 py-2">
                      <div className="mb-2 font-mono text-[9px] uppercase tracking-widest text-slate-700">
                        文件结构
                      </div>
                      <div className="space-y-0.5">
                        {Object.entries(selectedTemplate.files).map(
                          ([path, file]) => {
                            const isEntry =
                              path === selectedTemplate.entryPoint;
                            const getLanguageFromPath = (filePath: string) => {
                              const ext = filePath.split('.').pop();
                              const langMap: Record<string, string> = {
                                'tsx': 'TSX',
                                'ts': 'TS',
                                'jsx': 'JSX',
                                'js': 'JS',
                                'html': 'HTML',
                                'css': 'CSS',
                              };
                              return langMap[ext || ''] || '';
                            };
                            return (
                              <div
                                key={path}
                                className={cn(
                                  'flex items-center gap-2 rounded-md px-2 py-1 font-mono text-[10px]',
                                  isEntry
                                    ? 'bg-emerald-500/[0.06] text-emerald-400'
                                    : 'text-slate-500'
                                )}
                              >
                                <FileCode className="h-3 w-3 flex-none" />
                                <span className="flex-1 truncate">{path}</span>
                                <span className="flex-none text-[8px] text-slate-700">
                                  {getLanguageFromPath(path)}
                                </span>
                                {isEntry && (
                                  <span className="flex-none rounded bg-emerald-500/10 px-1 text-[8px] text-emerald-500">
                                    入口
                                  </span>
                                )}
                              </div>
                            );
                          }
                        )}
                      </div>
                    </div>

                    {/* Confirm Button */}
                    <div className="flex-none border-t border-white/[0.04] px-4 py-3">
                      <button
                        onClick={handleConfirm}
                        disabled={confirmed}
                        className={cn(
                          'flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 font-mono text-xs transition-all',
                          confirmed
                            ? 'border border-emerald-500/30 bg-emerald-500/20 text-emerald-400'
                            : 'border border-white/[0.08] bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-white hover:border-white/[0.15] hover:shadow-lg hover:shadow-emerald-500/10'
                        )}
                      >
                        {confirmed ? (
                          <>
                            <Check className="h-3.5 w-3.5" />
                            项目已创建
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-3.5 w-3.5" />
                            使用此模板创建项目
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-1 items-center justify-center"
                  >
                    <div className="text-center">
                      <FolderOpen className="mx-auto mb-2 h-8 w-8 text-slate-800" />
                      <div className="font-mono text-[11px] text-slate-600">
                        选择一个模板
                      </div>
                      <div className="mt-1 font-mono text-[9px] text-slate-700">
                        查看文件结构预览
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
