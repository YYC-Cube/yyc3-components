/**
 * useMediaQuery.ts
 * =================
 * 媒体查询 Hook
 *
 * 特性:
 * - 监听媒体查询变化
 * - SSR 安全
 * - 支持自定义查询
 */

import { useState, useEffect } from "react";

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // SSR 安全检查
    if (typeof window === "undefined") return;

    const media = window.matchMedia(query);
    setMatches(media.matches);

    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // 使用现代 API
    if (media.addEventListener) {
      media.addEventListener("change", listener);
      return () => media.removeEventListener("change", listener);
    } else {
      // 回退到旧 API
      media.addListener(listener);
      return () => media.removeListener(listener);
    }
  }, [query]);

  return matches;
}

// 预定义的常用媒体查询
export const useIsMobile = () => useMediaQuery("(max-width: 768px)");
export const useIsTablet = () => useMediaQuery("(min-width: 769px) and (max-width: 1024px)");
export const useIsDesktop = () => useMediaQuery("(min-width: 1025px)");
export const useIsDarkMode = () => useMediaQuery("(prefers-color-scheme: dark)");
export const useIsReducedMotion = () => useMediaQuery("(prefers-reduced-motion: reduce)");
