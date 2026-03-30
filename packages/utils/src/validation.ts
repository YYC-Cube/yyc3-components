/**
 * file: validation.ts
 * description: 数据验证工具文件 · 提供类型安全的数据验证函数
 * author: YanYuCloudCube Team
 * version: v1.0.0
 * created: 2026-03-26
 * updated: 2026-03-26
 * status: active
 * tags: [utils],[validation],[typescript]
 *
 * copyright: YanYuCloudCube Team
 * license: MIT
 *
 * brief: 类型安全的数据验证工具
 *
 * details:
 * - isString: 验证字符串类型
 * - isNumber: 验证数字类型（排除 NaN）
 * - isBoolean: 验证布尔值类型
 * - isObject: 验证对象类型（排除数组和 null）
 * - isArray: 验证数组类型
 * - isDate: 验证日期类型（支持字符串日期）
 * - isEmail: 验证邮箱格式
 * - isURL: 验证 URL 格式
 * - validateConfig: 验证配置对象结构
 * - deepMerge: 深度合并对象
 * - cleanObject: 清理对象（移除 undefined 值）
 *
 * dependencies: 无
 * exports: isString, isNumber, isBoolean, isObject, isArray, isDate, isEmail, isURL, validateConfig, deepMerge, cleanObject
 * notes: 所有函数均为类型保护（Type Guards），确保类型安全
 */

/**
 * 验证字符串 / Validate string
 */
export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

/**
 * 验证数字 / Validate number
 */
export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value);
}

/**
 * 验证布尔值 / Validate boolean
 */
export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

/**
 * 验证对象 / Validate object
 */
export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * 验证数组 / Validate array
 */
export function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

/**
 * 验证日期 / Validate date
 */
export function isDate(value: unknown): value is Date {
  return value instanceof Date || (isString(value) && !isNaN(Date.parse(value)));
}

/**
 * 验证邮箱 / Validate email
 */
export function isEmail(value: unknown): boolean {
  if (!isString(value)) {return false;}
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
}

/**
 * 验证 URL / Validate URL
 */
export function isURL(value: unknown): boolean {
  if (!isString(value)) {return false;}
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

/**
 * 验证配置对象结构 / Validate config object structure
 */
export function validateConfig(
  value: unknown,
  requiredFields: string[]
): boolean {
  if (!isObject(value)) {return false;}
  
  return requiredFields.every(field => field in value);
}

/**
 * 深度合并对象 / Deep merge objects
 */
export function deepMerge<T extends Record<string, unknown>>(target: T, source: Partial<T>): T {
  const result = { ...target };
  
  for (const key in source) {
    if (source[key] !== undefined) {
      if (isObject(result[key]) && isObject(source[key])) {
        result[key] = deepMerge(
          result[key] as Record<string, unknown>,
          source[key] as Record<string, unknown>
        ) as T[Extract<keyof T, string>];
      } else {
        result[key] = source[key] as T[Extract<keyof T, string>];
      }
    }
  }
  
  return result;
}

/**
 * 清理对象 / Clean object (remove undefined values)
 */
export function cleanObject<T extends Record<string, unknown>>(obj: T): Partial<T> {
  const result: Partial<T> = {};
  
  for (const key in obj) {
    if (obj[key] !== undefined) {
      result[key] = obj[key];
    }
  }
  
  return result;
}
