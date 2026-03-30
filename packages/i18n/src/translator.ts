/**
 * translator.ts
 * ===========
 * 国际化翻译器
 *
 * 特性:
 * - 嵌套key支持 (e.g. "nav.home")
 * - 模板变量替换 (e.g. "Hello, {name}!")
 * - 翻译合并
 * - 翻译验证
 * - 一致性检查
 */

import type { I18nMessages } from '@yyc3/types';

// ============================================================
// 工具函数
// ============================================================

/**
 * 通过点分key获取嵌套翻译值
 * e.g. t("nav.dataMonitor") → messages.nav.dataMonitor
 */
export function getNestedValue(obj: Record<string, any>, path: string): string {
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
export function interpolate(
  template: string,
  vars?: Record<string, string | number>
): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (_, key) =>
    vars[key] !== null ? String(vars[key]) : `{${key}}`
  );
}

/**
 * 深度合并对象
 */
function deepMerge<T extends I18nMessages>(target: T, source: Partial<T>): T {
  const output = { ...target } as any;

  for (const key in source) {
    if (source[key] !== undefined) {
      if (
        typeof source[key] === 'object' &&
        !Array.isArray(source[key]) &&
        typeof target[key as any] === 'object' &&
        !Array.isArray(target[key as any])
      ) {
        output[key] = deepMerge(target[key] as any, source[key] as any) as any;
      } else {
        output[key] = source[key] as any;
      }
    }
  }

  return output;
}

// ============================================================
// 主API
// ============================================================

/**
 * 创建翻译器函数
 * @param messages - 翻译消息对象
 * @returns 翻译函数
 */
export function createTranslator(
  messages: I18nMessages
): (key: string, vars?: Record<string, string | number>) => string {
  /**
   * 翻译函数
   * @param key - 翻译key，支持嵌套key (e.g. "nav.home")
   * @param vars - 模板变量 (e.g. { name: "John" })
   * @returns 翻译后的字符串
   */
  return (key, vars) => {
    const raw = getNestedValue(messages as Record<string, any>, key);
    return interpolate(raw, vars);
  };
}

/**
 * 合并多个翻译对象
 */
export function mergeMessages<T extends I18nMessages>(
  ...messages: Partial<T>[]
): T {
  return messages.reduce(
    (acc: T, msg: Partial<T>) => deepMerge(acc, msg),
    {} as T
  );
}

/**
 * 验证翻译消息
 */
export function validateMessages(messages: I18nMessages): string[] {
  const errors: string[] = [];

  function traverse(obj: Record<string, any>, path = '') {
    for (const key in obj) {
      const fullPath = path ? `${path}.${key}` : key;
      const value = obj[key];

      if (
        typeof value === 'object' &&
        value !== null &&
        !Array.isArray(value)
      ) {
        traverse(value, fullPath);
      } else if (typeof value !== 'string') {
        errors.push(`[${fullPath}] Translation must be a string`);
      } else if (!value.trim()) {
        errors.push(`[${fullPath}] Translation is empty`);
      }
    }
  }

  traverse(messages as Record<string, any>);
  return errors;
}

/**
 * 提取所有翻译key
 */
export function extractKeys(messages: I18nMessages): string[] {
  const keys: string[] = [];

  function traverse(obj: Record<string, any>, path = '') {
    for (const key in obj) {
      const fullPath = path ? `${path}.${key}` : key;
      const value = obj[key];

      if (
        typeof value === 'object' &&
        value !== null &&
        !Array.isArray(value)
      ) {
        traverse(value, fullPath);
      } else if (typeof value === 'string') {
        keys.push(fullPath);
      }
    }
  }

  traverse(messages as Record<string, any>);
  return keys;
}

/**
 * 检查翻译一致性
 */
export function checkConsistency(
  messages1: I18nMessages,
  messages2: I18nMessages
): {
  missingInMessages1: string[];
  missingInMessages2: string[];
  commonKeys: string[];
} {
  const keys1 = new Set(extractKeys(messages1));
  const keys2 = new Set(extractKeys(messages2));

  const missingIn1 = [...keys2].filter((k) => !keys1.has(k));
  const missingIn2 = [...keys1].filter((k) => !keys2.has(k));
  const common = [...keys1].filter((k) => keys2.has(k));

  return {
    missingInMessages1: missingIn1,
    missingInMessages2: missingIn2,
    commonKeys: common,
  };
}
