/**
 * GlassCard.tsx
 * =============
 * YYC3 玻璃态卡片组件
 *
 * 功能：
 * - 提供玻璃态视觉效果
 * - 支持自定义发光效果
 * - 支持点击交互
 * - 完整的响应式设计
 */

import React, { forwardRef } from 'react';
import type { BaseComponentProps } from '@yyc3/types';

export interface GlassCardProps extends BaseComponentProps {
  children: React.ReactNode;
  className?: string;
  /** 发光颜色（可选） */
  glowColor?: string;
  /** 是否可点击 */
  clickable?: boolean;
  /** 自定义样式 */
  style?: React.CSSProperties;
  /** 点击事件 */
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  (
    {
      children,
      className = '',
      glowColor,
      clickable = false,
      onClick,
      style,
      ...rest
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        onClick={onClick}
        className={`relative rounded-xl border border-gray-200/50 bg-white/70 shadow-lg backdrop-blur-xl transition-all duration-300 hover:border-gray-300 hover:shadow-xl dark:border-gray-700/50 dark:bg-gray-800/70 dark:hover:border-gray-600 ${clickable ? 'cursor-pointer active:scale-[0.99]' : ''} ${className} `}
        style={
          glowColor ? { boxShadow: `0 0 30px ${glowColor}`, ...style } : style
        }
        {...rest}
      >
        {children}
      </div>
    );
  }
);

GlassCard.displayName = 'GlassCard';
