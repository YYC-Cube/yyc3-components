/**
 * file: TypingIndicator.tsx
 * description: 打字指示器组件 · 提供视觉反馈，显示 AI 正在生成响应
 * author: YanYuCloudCube Team
 * version: v1.0.0
 * created: 2026-03-26
 * updated: 2026-03-26
 * status: active
 * tags: [component],[chat],[ui]
 *
 * copyright: YanYuCloudCube Team
 * license: MIT
 *
 * brief: 终端风格的打字指示器
 *
 * details:
 * - 终端风格设计（模拟命令行界面）
 * - 动画效果（脉冲动画）
 * - 视觉反馈（处理状态提示）
 * - 无障碍支持（语义化 HTML）
 * - 响应式设计（支持移动端）
 *
 * dependencies: React, lucide-react (Terminal icon)
 * exports: TypingIndicator
 * notes: 组件样式使用 Tailwind CSS，支持主题定制
 */

import { Terminal } from "lucide-react";

export function TypingIndicator() {
  return (
    <div className="flex flex-col gap-1 max-w-2xl px-2 md:px-0 font-mono mb-8">
      {/* Header Line */}
      <div className="flex items-center gap-2 select-none mb-1 opacity-50">
        <span className="text-xs font-bold text-green-500">system@ai</span>
        <span className="text-gray-600">:</span>
        <span className="text-blue-300">~</span>
        <span className="text-gray-600">$</span>
        <span className="text-xs text-green-500/50 uppercase tracking-widest ml-2 animate-pulse">
          PROCESSING...
        </span>
      </div>

      {/* Content Area */}
      <div className="pl-4 border-l-2 border-green-500/30 text-green-500/70">
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-widest">GENERATING_RESPONSE</span>
          <div className="flex gap-1">
             <div className="w-1.5 h-3 bg-green-500 animate-[pulse_0.5s_ease-in-out_infinite]" />
             <div className="w-1.5 h-3 bg-green-500/50 animate-[pulse_0.5s_ease-in-out_infinite_0.1s]" />
             <div className="w-1.5 h-3 bg-green-500/20 animate-[pulse_0.5s_ease-in-out_infinite_0.2s]" />
          </div>
        </div>
        <div className="mt-2 text-[10px] text-green-500/30 font-mono">
           {`> analyzing_input_vector`}
           <br/>
           {`> processing_neural_weights`}
        </div>
      </div>
    </div>
  );
}
