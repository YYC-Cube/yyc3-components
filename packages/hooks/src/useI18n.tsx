/**
 * useI18n.ts
 * ===========
 * 国际化 Hook
 *
 * 特性:
 * - localStorage 持久化语言偏好
 * - React Context 全局共享
 * - 动态切换无需刷新
 * - t() 函数支持嵌套 key 和模板变量
 */

import React, { useState, useCallback, useMemo, createContext, useContext } from 'react';
import type { Locale, LocaleInfo, I18nContextValue, I18nMessages } from '@yyc3/types';

// ============================================================
// 工具函数
// ============================================================

/**
 * 通过点分 key 获取嵌套翻译值
 * e.g. t("nav.dataMonitor") → messages.nav.dataMonitor
 */
function getNestedValue(obj: Record<string, any>, path: string): string {
  const keys = path.split('.');
  let result: any = obj;
  for (const k of keys) {
    if (result === null || typeof result !== 'object') {
      return path;
    }
    result = result[k];
  }
  return typeof result === 'string' ? result : path;
}

/**
 * 替换模板变量 e.g. "{n} 分钟前" + { n: 5 } → "5 分钟前"
 */
function interpolate(template: string, vars?: Record<string, string | number>): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (_, key) =>
    vars[key] !== null ? String(vars[key]) : `{${key}}`
  );
}

// ============================================================
// Context
// ============================================================

export interface I18nProviderProps {
  children: React.ReactNode;
  defaultLocale?: Locale;
  messages: Record<Locale, I18nMessages>;
  availableLocales?: LocaleInfo[];
  storageKey?: string;
}

export const I18nContext = createContext<I18nContextValue>({
  locale: 'zh-CN',
  setLocale: () => {},
  t: (key) => key,
  availableLocales: [],
});

export function I18nProvider({
  children,
  defaultLocale = 'zh-CN',
  messages,
  availableLocales = [
    { code: 'zh-CN', label: '简体中文', nativeLabel: '简体中文' },
    { code: 'en-US', label: 'English', nativeLabel: 'English' },
  ],
  storageKey = 'yyc3_locale',
}: I18nProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window === 'undefined') return defaultLocale;
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved && (saved === 'en-US' || saved === 'zh-CN')) {
        return saved as Locale;
      }
    } catch {
      // storage unavailable
    }
    return defaultLocale;
  });

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    try {
      localStorage.setItem(storageKey, newLocale);
    } catch {
      // storage unavailable
    }
  }, [storageKey]);

  const translations = useMemo(() => messages[locale], [messages, locale]);

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>): string => {
      const raw = getNestedValue(translations as Record<string, any>, key);
      return interpolate(raw, vars);
    },
    [translations]
  );

  const value = useMemo<I18nContextValue>(
    () => ({ locale, setLocale, t, availableLocales }),
    [locale, setLocale, t, availableLocales]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

/**
 * 消费 i18n 上下文的 Hook
 */
export function useI18n() {
  return useContext(I18nContext);
}
