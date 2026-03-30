/**
 * UserAIPanel - 用户与智能AI交互区（左栏）
 *
 * 职责：
 * - 用户信息展示面板
 * - AI模型选择器
 * - AI对话交互主界面
 * - 用户聊天输入框
 *
 * 对应规格：Functional-Spec §智能AI编程模式页面 → 左栏
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  User,
  Bot,
  Send,
  ChevronDown,
  Sparkles,
  Settings,
  HelpCircle,
  Paperclip,
  ImagePlus,
  Zap,
  Circle,
  Loader2,
  MessageSquare,
  Trash2,
  Copy,
  Check,
  FileCode,
  Play,
  Bug,
  Code,
  TestTube,
  BookOpen,
  RefreshCw,
  AlertTriangle,
  FileText,
} from 'lucide-react';
import { cn } from './ui/utils';

// ==========================================
// Types
// ==========================================

interface AIModel {
  id: string;
  name: string;
  provider: string;
  description: string;
  color: string;
  isAvailable: boolean;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  model?: string;
}

export interface UserAIPanelProps {
  activeModelId?: string;
  onModelChange?: (modelId: string) => void;
  onSendMessage?: (message: string) => void;
  isProcessing?: boolean;
  /** Step 8c: AI 生成代码后回调（写入 VFS + 打开标签） */
  onCodeGenerated?: (code: string, fileName: string, language: string) => void;
  /** Step 8c: 将代码应用到当前编辑器 */
  onApplyToEditor?: (code: string) => void;
  /** Step 11a: 动态快捷操作 */
  quickActions?: QuickActionItem[];
  /** Step 11a: 快捷操作点击回调 */
  onQuickAction?: (action: QuickActionItem) => void;
  /** Step 11a: 上下文信息 badge */
  contextInfo?: ContextBadgeInfo;
}

/** Step 11a: 快捷操作项 */
export interface QuickActionItem {
  id: string;
  label: string;
  prompt: string;
  icon: 'bug' | 'sparkles' | 'code' | 'refactor' | 'test' | 'docs';
  available: boolean;
  priority: number;
}

/** Step 11a: 上下文 badge 信息 */
export interface ContextBadgeInfo {
  activeFilePath: string | null;
  errorCount: number;
  warningCount: number;
  contextFileCount: number;
  isReady: boolean;
}

// ==========================================
// Constants
// ==========================================

import { MODEL_CATALOG, DEFAULT_MODEL } from '../config/models';
import type { UIModelInfo } from '../config/models';

const AI_MODELS = Object.values(MODEL_CATALOG);

const QUICK_PROMPTS = [
  '帮我创建一个响应式面板布局',
  '分析当前代码架构',
  '生成组件测试用例',
  '优化代码性能',
];

// ==========================================
// Component
// ==========================================

export function UserAIPanel({
  activeModelId = DEFAULT_MODEL,
  onModelChange,
  onSendMessage,
  isProcessing = false,
  onCodeGenerated,
  onApplyToEditor,
  quickActions,
  onQuickAction,
  contextInfo,
}: UserAIPanelProps) {
  const [selectedModel, setSelectedModel] = useState(activeModelId);
  const [showModelSelector, setShowModelSelector] = useState(false);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'sys-1',
      role: 'system',
      content:
        '欢迎使用 YYC³ 智能协同平台。我是您的 AI 编程助手，可以帮助您进行设计、编码和调试。',
      timestamp: Date.now() - 60000,
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const modelSelectorRef = useRef<HTMLDivElement>(null);

  const currentModel =
    AI_MODELS.find((m) => m.id === selectedModel) || AI_MODELS[0];

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Close model selector on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        modelSelectorRef.current &&
        !modelSelectorRef.current.contains(e.target as Node)
      ) {
        setShowModelSelector(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectModel = useCallback(
    (modelId: string) => {
      setSelectedModel(modelId);
      setShowModelSelector(false);
      onModelChange?.(modelId);
    },
    [onModelChange]
  );

  const handleSend = useCallback(() => {
    if (!inputText.trim() || isProcessing) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: inputText.trim(),
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);
    onSendMessage?.(inputText.trim());
    setInputText('');

    // Mock AI response
    setTimeout(() => {
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: `收到您的需求："${userMsg.content.substring(0, 50)}..."。正在分析并生成解决方案，请稍候。\n\n\`\`\`typescript\n// 示例代码片段\nexport const Component = () => {\n  return <div>Generated</div>;\n};\n\`\`\``,
        timestamp: Date.now(),
        model: currentModel.name,
      };
      setMessages((prev) => [...prev, aiMsg]);
    }, 1500);
  }, [inputText, isProcessing, onSendMessage, currentModel]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  const handleClearChat = useCallback(() => {
    setMessages([
      {
        id: 'sys-clear',
        role: 'system',
        content: '对话已清空。随时可以开始新的对话。',
        timestamp: Date.now(),
      },
    ]);
  }, []);

  return (
    <div className="flex h-full flex-col bg-slate-950/50">
      {/* User Info Section */}
      <div className="flex-none border-b border-white/[0.06] px-3 py-2.5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500">
            <User className="h-4 w-4 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate font-mono text-xs text-slate-200">
              YYC³ Developer
            </div>
            <div className="flex items-center gap-1.5 font-mono text-[10px] text-slate-500">
              <Circle className="h-2 w-2 fill-emerald-500 text-emerald-500" />
              <span>在线</span>
              <span className="text-slate-700">|</span>
              <span>协同模式</span>
            </div>
          </div>
          <button className="rounded p-1 text-slate-500 transition-colors hover:bg-white/5 hover:text-slate-300">
            <Settings className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* AI Model Selector */}
      <div
        className="flex-none border-b border-white/[0.06] px-3 py-2"
        ref={modelSelectorRef}
      >
        <button
          onClick={() => setShowModelSelector(!showModelSelector)}
          className="flex w-full items-center gap-2 rounded-lg border border-white/[0.06] bg-black/30 px-2.5 py-2 transition-all hover:border-white/10"
        >
          <Bot className="h-3.5 w-3.5" style={{ color: currentModel.color }} />
          <div className="min-w-0 flex-1 text-left">
            <div className="truncate font-mono text-[11px] text-slate-300">
              {currentModel.name}
            </div>
            <div className="font-mono text-[9px] text-slate-600">
              {currentModel.provider} · {currentModel.description}
            </div>
          </div>
          <ChevronDown
            className={cn(
              'h-3 w-3 text-slate-500 transition-transform',
              showModelSelector && 'rotate-180'
            )}
          />
        </button>

        <AnimatePresence>
          {showModelSelector && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-1 overflow-hidden"
            >
              <div className="overflow-hidden rounded-lg border border-white/[0.06] bg-slate-900/90">
                {AI_MODELS.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => handleSelectModel(model.id)}
                    disabled={!model.isAvailable}
                    className={cn(
                      'flex w-full items-center gap-2 px-3 py-2 text-left transition-all',
                      model.id === selectedModel
                        ? 'bg-white/[0.06]'
                        : 'hover:bg-white/[0.03]',
                      !model.isAvailable && 'cursor-not-allowed opacity-40'
                    )}
                  >
                    <div
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: model.color }}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-mono text-[11px] text-slate-300">
                        {model.name}
                      </div>
                      <div className="font-mono text-[9px] text-slate-600">
                        {model.description}
                      </div>
                    </div>
                    {model.id === selectedModel && (
                      <Zap className="h-3 w-3 flex-none text-emerald-400" />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Chat Messages Area */}
      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-3 py-2">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              'flex gap-2',
              msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
            )}
          >
            {msg.role !== 'user' && (
              <div className="flex h-6 w-6 flex-none items-center justify-center rounded-full border border-violet-500/20 bg-gradient-to-br from-violet-500/30 to-purple-600/30">
                <Sparkles className="h-3 w-3 text-violet-400" />
              </div>
            )}
            <div
              className={cn(
                'max-w-[85%] rounded-xl px-3 py-2 text-[12px] leading-relaxed',
                msg.role === 'user'
                  ? 'border border-emerald-500/20 bg-emerald-500/10 text-slate-200'
                  : msg.role === 'system'
                    ? 'border border-white/[0.04] bg-slate-800/50 italic text-slate-400'
                    : 'border border-white/[0.06] bg-slate-800/80 text-slate-300'
              )}
            >
              {msg.content.split('```').map((part, idx) =>
                idx % 2 === 0 ? (
                  <span key={idx}>{part}</span>
                ) : (
                  (() => {
                    // Step 8c: 提取语言和代码内容
                    const langMatch = part.match(/^(\w+)\n/);
                    const lang = langMatch?.[1] || 'typescript';
                    const codeContent = langMatch
                      ? part.slice(langMatch[0].length)
                      : part;
                    return (
                      <div key={idx} className="group relative my-1.5">
                        <div className="flex items-center justify-between rounded-t-md border border-b-0 border-white/[0.06] bg-black/40 px-2 py-1">
                          <span className="font-mono text-[9px] text-slate-500">
                            {lang}
                          </span>
                          <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(codeContent);
                              }}
                              className="rounded p-0.5 text-slate-500 transition-colors hover:bg-white/10 hover:text-slate-300"
                              title="复制代码"
                            >
                              <Copy className="h-3 w-3" />
                            </button>
                            {onApplyToEditor && (
                              <button
                                onClick={() => onApplyToEditor(codeContent)}
                                className="rounded p-0.5 text-slate-500 transition-colors hover:bg-emerald-500/20 hover:text-emerald-400"
                                title="应用到编辑器"
                              >
                                <Play className="h-3 w-3" />
                              </button>
                            )}
                            {onCodeGenerated && (
                              <button
                                onClick={() => {
                                  const ext =
                                    lang === 'typescript' || lang === 'tsx'
                                      ? 'tsx'
                                      : lang === 'css'
                                        ? 'css'
                                        : 'ts';
                                  const fileName = `ai-generated-${Date.now()}.${ext}`;
                                  onCodeGenerated(codeContent, fileName, lang);
                                }}
                                className="rounded p-0.5 text-slate-500 transition-colors hover:bg-cyan-500/20 hover:text-cyan-400"
                                title="创建新文件"
                              >
                                <FileCode className="h-3 w-3" />
                              </button>
                            )}
                          </div>
                        </div>
                        <pre className="overflow-x-auto whitespace-pre-wrap rounded-b-md border border-t-0 border-white/[0.06] bg-black/30 px-2 py-1.5 font-mono text-[10px] text-emerald-400">
                          {codeContent}
                        </pre>
                      </div>
                    );
                  })()
                )
              )}
              {msg.model && (
                <div className="mt-1 font-mono text-[9px] text-slate-600">
                  via {msg.model}
                </div>
              )}
            </div>
          </motion.div>
        ))}

        {isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 px-2"
          >
            <Loader2 className="h-3 w-3 animate-spin text-violet-400" />
            <span className="font-mono text-[10px] text-slate-500">
              AI 正在思考...
            </span>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Step 11a: Context Badge */}
      {contextInfo && contextInfo.isReady && (
        <div className="flex-none border-t border-white/[0.04] px-3 py-1.5">
          <div className="flex items-center gap-2 rounded-md border border-white/[0.04] bg-black/20 px-2 py-1">
            <FileText className="h-3 w-3 flex-none text-cyan-400" />
            <span className="flex-1 truncate font-mono text-[9px] text-slate-400">
              {contextInfo.activeFilePath
                ? contextInfo.activeFilePath.split('/').pop()
                : '无活动文件'}
            </span>
            {contextInfo.errorCount > 0 && (
              <span className="flex items-center gap-0.5 rounded bg-red-500/10 px-1 font-mono text-[8px] text-red-400">
                <Bug className="h-2.5 w-2.5" />
                {contextInfo.errorCount}
              </span>
            )}
            {contextInfo.warningCount > 0 && (
              <span className="flex items-center gap-0.5 rounded bg-amber-500/10 px-1 font-mono text-[8px] text-amber-400">
                <AlertTriangle className="h-2.5 w-2.5" />
                {contextInfo.warningCount}
              </span>
            )}
            {contextInfo.contextFileCount > 0 && (
              <span className="font-mono text-[8px] text-slate-600">
                +{contextInfo.contextFileCount} 文件
              </span>
            )}
          </div>
        </div>
      )}

      {/* Step 11a: Dynamic Quick Actions / Fallback Quick Prompts */}
      <div className="flex-none border-t border-white/[0.04] px-3 py-1.5">
        <div className="scrollbar-thin flex gap-1.5 overflow-x-auto pb-1">
          {quickActions && quickActions.length > 0
            ? quickActions.map((action) => {
                const IconComponent =
                  action.icon === 'bug'
                    ? Bug
                    : action.icon === 'sparkles'
                      ? Sparkles
                      : action.icon === 'code'
                        ? Code
                        : action.icon === 'refactor'
                          ? RefreshCw
                          : action.icon === 'test'
                            ? TestTube
                            : BookOpen;
                const colorMap: Record<string, string> = {
                  bug: 'text-red-400 hover:bg-red-500/10 border-red-500/20',
                  sparkles:
                    'text-violet-400 hover:bg-violet-500/10 border-violet-500/20',
                  code: 'text-cyan-400 hover:bg-cyan-500/10 border-cyan-500/20',
                  refactor:
                    'text-amber-400 hover:bg-amber-500/10 border-amber-500/20',
                  test: 'text-emerald-400 hover:bg-emerald-500/10 border-emerald-500/20',
                  docs: 'text-slate-400 hover:bg-white/5 border-white/10',
                };
                return (
                  <button
                    key={action.id}
                    onClick={() => {
                      if (onQuickAction) {
                        onQuickAction(action);
                      } else {
                        setInputText(action.prompt);
                      }
                    }}
                    className={cn(
                      'flex flex-none items-center gap-1 whitespace-nowrap rounded-md border bg-black/20 px-2 py-1 font-mono text-[9px] transition-all',
                      colorMap[action.icon] ||
                        'border-white/[0.04] text-slate-500'
                    )}
                  >
                    <IconComponent className="h-2.5 w-2.5" />
                    {action.label}
                  </button>
                );
              })
            : QUICK_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => setInputText(prompt)}
                  className="flex-none whitespace-nowrap rounded-md border border-white/[0.04] bg-black/20 px-2 py-1 font-mono text-[9px] text-slate-500 transition-all hover:border-white/10 hover:text-slate-300"
                >
                  {prompt}
                </button>
              ))}
        </div>
      </div>

      {/* Chat Input */}
      <div className="flex-none border-t border-white/[0.06] bg-slate-950/70 px-3 py-2.5">
        <div className="flex items-end gap-2">
          <div className="flex gap-1">
            <button
              className="rounded-md p-1.5 text-slate-500 transition-colors hover:bg-white/5 hover:text-slate-300"
              title="附件"
            >
              <Paperclip className="h-3.5 w-3.5" />
            </button>
            <button
              className="rounded-md p-1.5 text-slate-500 transition-colors hover:bg-white/5 hover:text-slate-300"
              title="图片"
            >
              <ImagePlus className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="relative flex-1">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="描述你的需求..."
              rows={1}
              className="w-full resize-none rounded-lg border border-white/[0.06] bg-black/30 px-3 py-2 font-mono text-[12px] text-slate-200 placeholder-slate-600 transition-colors focus:border-emerald-500/30 focus:outline-none"
              style={{ minHeight: '36px', maxHeight: '120px' }}
            />
          </div>
          <div className="flex gap-1">
            <button
              onClick={handleClearChat}
              className="rounded-md p-1.5 text-slate-600 transition-colors hover:bg-white/5 hover:text-slate-400"
              title="清空对话"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={handleSend}
              disabled={!inputText.trim() || isProcessing}
              className={cn(
                'rounded-lg p-2 transition-all',
                inputText.trim() && !isProcessing
                  ? 'border border-emerald-500/30 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                  : 'cursor-not-allowed border border-white/[0.04] bg-white/[0.03] text-slate-600'
              )}
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
