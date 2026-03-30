/**
 * useClickOutside.ts
 * ===================
 * 点击外部检测 Hook
 *
 * 特性:
 * - 检测点击是否在元素外部
 * - 支持多个 ref
 * - 支持自定义事件
 */

import { useEffect, useRef, RefObject } from 'react';

type Handler = (event: MouseEvent | TouchEvent) => void;

export function useClickOutside(
  ref: RefObject<HTMLElement> | RefObject<HTMLElement>[],
  handler: Handler,
  active: boolean = true
) {
  const savedHandler = useRef(handler);

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    if (!active) return;

    const listener = (event: MouseEvent | TouchEvent) => {
      const refs = Array.isArray(ref) ? ref : [ref];
      const isOutside = refs.every((r) => {
        const el = r.current;
        return !el || el.contains((event.target as Node) || null);
      });

      if (isOutside) {
        savedHandler.current(event);
      }
    };

    document.addEventListener('mousedown', listener as EventListener);
    document.addEventListener('touchstart', listener as EventListener);

    return () => {
      document.removeEventListener('mousedown', listener as EventListener);
      document.removeEventListener('touchstart', listener as EventListener);
    };
  }, [ref, active]);
}
