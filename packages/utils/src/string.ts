/**
 * string.ts
 * ========
 * 字符串处理工具函数
 * 通用字符串处理工具
 */

/**
 * 截断字符串
 * @param str - 原字符串
 * @param maxLength - 最大长度
 * @param suffix - 后缀 (默认为"...")
 * @returns 截断后的字符串
 */
export function truncate(str: string, maxLength: number, suffix: string = '...'): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - suffix.length) + suffix;
}

/**
 * 首字母大写
 * @param str - 原字符串
 * @returns 首字母大写的字符串
 */
export function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * 驼峰命名转换为短横线命名
 * @param str - 驼峰命名字符串
 * @returns 短横线命名字符串
 */
export function camelToKebab(str: string): string {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

/**
 * 短横线命名转换为驼峰命名
 * @param str - 短横线命名字符串
 * @returns 驼峰命名字符串
 */
export function kebabToCamel(str: string): string {
  return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * 生成随机字符串
 * @param length - 字符串长度
 * @param chars - 可选字符集
 * @returns 随机字符串
 */
export function randomString(
  length: number = 8,
  chars: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
): string {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * 生成UUID
 * @returns UUID字符串
 */
export function uuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * 模板字符串替换
 * @param template - 模板字符串 (如 "Hello {name}")
 * @param vars - 变量对象 (如 { name: "World" })
 * @returns 替换后的字符串
 */
export function interpolate(
  template: string,
  vars?: Record<string, string | number>
): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (_, key) =>
    vars[key] !== undefined ? String(vars[key]) : `{${key}}`
  );
}

/**
 * 转义HTML特殊字符
 * @param str - 原字符串
 * @returns 转义后的字符串
 */
export function escapeHtml(str: string): string {
  const htmlEscapes: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return str.replace(/[&<>"']/g, char => htmlEscapes[char]);
}

/**
 * 反转义HTML特殊字符
 * @param str - 转义后的字符串
 * @returns 原字符串
 */
export function unescapeHtml(str: string): string {
  const htmlUnescapes: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
  };
  return str.replace(/&amp;|&lt;|&gt;|&quot;|&#39;/g, char => htmlUnescapes[char]);
}

/**
 * 检查字符串是否为空或仅包含空白字符
 * @param str - 字符串
 * @returns 是否为空白
 */
export function isBlank(str: string | null | undefined): boolean {
  return str === null || str === undefined || str.trim().length === 0;
}

/**
 * 移除字符串中的所有空白字符
 * @param str - 原字符串
 * @returns 移除空白后的字符串
 */
export function removeWhitespace(str: string): string {
  return str.replace(/\s+/g, '');
}

/**
 * 按单词数截断字符串
 * @param str - 原字符串
 * @param maxWords - 最大单词数
 * @param suffix - 后缀 (默认为"...")
 * @returns 截断后的字符串
 */
export function truncateByWords(str: string, maxWords: number, suffix: string = '...'): string {
  const words = str.split(/\s+/);
  if (words.length <= maxWords) return str;
  return words.slice(0, maxWords).join(' ') + suffix;
}

/**
 * 生成URL友好的slug
 * @param str - 原字符串
 * @returns slug字符串
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
