/**
 * color.ts
 * ========
 * 颜色处理工具函数
 * 从 AI Family 项目中提取
 */

/**
 * 将十六进制颜色转换为RGB格式
 * @param hex - 十六进制颜色值 (如 "#00d4ff")
 * @returns RGB字符串 (如 "0,212,255")
 * @example
 * hexToRgb("#00d4ff") // "0,212,255"
 * hexToRgb("#ff0000") // "255,0,0"
 */
export function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return '0,212,255'; // 默认返回青色
  return `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}`;
}

/**
 * 将十六进制颜色转换为RGBA格式
 * @param hex - 十六进制颜色值
 * @param alpha - 透明度 (0-1)
 * @returns RGBA字符串
 * @example
 * hexToRgba("#00d4ff", 0.5) // "rgba(0,212,255,0.5)"
 */
export function hexToRgba(hex: string, alpha: number): string {
  const rgb = hexToRgb(hex);
  return `rgba(${rgb},${alpha})`;
}

/**
 * 判断颜色是否为深色
 * @param hex - 十六进制颜色值
 * @returns 是否为深色
 */
export function isDarkColor(hex: string): boolean {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return false;

  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);

  // 计算亮度
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness < 128;
}

/**
 * 根据背景色返回合适的文字颜色(黑/白)
 * @param hex - 背景色的十六进制值
 * @returns 黑色或白色
 */
export function getContrastColor(hex: string): '#000000' | '#ffffff' {
  return isDarkColor(hex) ? '#ffffff' : '#000000';
}
