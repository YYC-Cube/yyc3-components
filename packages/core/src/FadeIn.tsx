/**
 * FadeIn.tsx
 * ==========
 * YYC3 入场动画组件
 *
 * 功能：
 * - 纯 CSS transition + setTimeout 实现动画
 * - 支持多种入场方向
 * - 支持延迟设置
 * - 兼容性强
 */

import React, { useState, useEffect } from "react";
import type { BaseComponentProps, AnimationOptions } from "@yyc3/types";

export interface FadeInProps extends BaseComponentProps, AnimationOptions {
  children: React.ReactNode;
  /** 延迟时间（秒） */
  delay?: number;
  /** 动画方向 */
  direction?: "up" | "down" | "left" | "right" | "none";
  /** 动画时长（秒） */
  duration?: number;
  /** 点击事件 */
  onClick?: (e: React.MouseEvent) => void;
  /** 自定义样式 */
  style?: React.CSSProperties;
}

export function FadeIn({
  children,
  delay = 0,
  className = "",
  direction = "up",
  duration = 0.5,
  onClick,
  style,
  ...rest
}: FadeInProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), Math.min(delay * 1000, 1200));
    return () => clearTimeout(t);
  }, [delay]);

  const transforms: Record<string, string> = {
    up: "translateY(12px)",
    down: "translateY(-12px)",
    left: "translateX(12px)",
    right: "translateX(-12px)",
    none: "none",
  };

  return (
    <div
      className={className}
      onClick={onClick}
      style={{
        ...style,
        opacity: show ? 1 : 0,
        transform: show ? "none" : transforms[direction],
        transition: `opacity ${duration}s ease, transform ${duration}s ease`,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
