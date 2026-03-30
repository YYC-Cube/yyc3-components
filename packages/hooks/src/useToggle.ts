/**
 * useToggle.ts
 * ============
 * 切换 Hook
 *
 * 特性:
 * - 简单的布尔值状态管理
 * - 提供便捷的切换方法
 */

import { useCallback, useState } from "react";

export function useToggle(initialValue: boolean = false) {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => setValue((v) => !v), []);
  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);

  return [value, { toggle, setTrue, setFalse }] as const;
}
