/**
 * @yyc3/utils v1.0.0
 * YYC3工具函数库
 * Built from AI Family Project
 * https://github.com/YYC-Cube/yyc3-reusable-components
 */

// Color utilities
export { hexToRgb, hexToRgba, isDarkColor, getContrastColor } from './color';

// Date utilities
export {
  getGreeting,
  getHourlyCare,
  formatDate,
  getRelativeTime,
  isToday,
  isThisWeek,
} from './date';

// Data utilities
export {
  getMember,
  getDataSummary,
  deepClone,
  unique,
  groupBy,
  chunk,
} from './data';

// String utilities
export {
  truncate,
  capitalize,
  camelToKebab,
  kebabToCamel,
  randomString,
  uuid,
  interpolate,
  escapeHtml,
  unescapeHtml,
  isBlank,
  removeWhitespace,
  truncateByWords,
  slugify,
} from './string';

// Validation utilities
export {
  isString,
  isNumber,
  isBoolean,
  isObject,
  isArray,
  isDate,
  isEmail,
  isURL,
  validateConfig,
  deepMerge,
  cleanObject,
} from './validation';
