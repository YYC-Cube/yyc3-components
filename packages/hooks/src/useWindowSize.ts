/**
 * useWindowSize.ts
 * ================
 * 窗口尺寸 Hook
 *
 * 特性:
 * - 实时监听窗口尺寸变化
 * - SSR 安全
 * - 提供宽高信息
 */

import { useState, useEffect } from 'react';

interface WindowSize {
  width: number;
  height: number;
}

export function useWindowSize(): WindowSize {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    // SSR 安全检查
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // 初始化
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
}

export function useWindowWidth(): number {
  return useWindowSize().width;
}

export function useWindowHeight(): number {
  return useWindowSize().height;
}
