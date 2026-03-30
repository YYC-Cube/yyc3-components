/**
 * LoadingSpinner.tsx
 * ===================
 * YYC3 加载动画组件
 *
 * 功能：
 * - 提供多种加载动画样式
 * - 支持自定义尺寸和颜色
 * - 完全可访问
 */

import React from 'react';
import type { BaseComponentProps, ComponentSize } from '@yyc3/types';

export interface LoadingSpinnerProps extends BaseComponentProps {
  /** 尺寸 */
  size?: ComponentSize | number;
  /** 颜色 */
  color?: string;
  /** 动画类型 */
  variant?: 'default' | 'dots' | 'bars' | 'pulse';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'default',
  color = 'currentColor',
  variant = 'default',
  className = '',
  ...rest
}) => {
  const getSize = (): string => {
    if (typeof size === 'number') return `${size}px`;
    const sizes: Record<ComponentSize, string> = {
      sm: '16px',
      default: '24px',
      lg: '32px',
      xl: '48px',
    };
    return sizes[size] || sizes.default;
  };

  const sizeValue = getSize();

  if (variant === 'dots') {
    return (
      <div
        className={`flex items-center gap-1 ${className}`}
        {...rest}
        style={rest.style}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="animate-bounce rounded-full"
            style={{
              width: `calc(${sizeValue} * 0.4)`,
              height: `calc(${sizeValue} * 0.4)`,
              backgroundColor: color,
              animationDelay: `${i * 0.1}s`,
            }}
          />
        ))}
      </div>
    );
  }

  if (variant === 'bars') {
    return (
      <div
        className={`flex items-center gap-1 ${className}`}
        {...rest}
        style={rest.style}
      >
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="animate-pulse rounded-sm"
            style={{
              width: `calc(${sizeValue} * 0.15)`,
              height: sizeValue,
              backgroundColor: color,
              animationDelay: `${i * 0.1}s`,
            }}
          />
        ))}
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div
        className={`animate-pulse rounded-full ${className}`}
        {...rest}
        style={{
          width: sizeValue,
          height: sizeValue,
          backgroundColor: color,
          ...rest.style,
        }}
      />
    );
  }

  // Default spinner
  return (
    <div
      className={`inline-block animate-spin rounded-full border-2 border-solid border-current border-r-transparent ${className}`}
      {...rest}
      style={{
        width: sizeValue,
        height: sizeValue,
        color,
        ...rest.style,
      }}
    />
  );
};
