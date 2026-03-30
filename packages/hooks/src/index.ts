/**
 * @yyc3/hooks
 * YYC3可复用组件库 - 自定义Hooks包
 */

// i18n
export { I18nProvider, useI18n } from './useI18n';
export type { I18nProviderProps } from './useI18n';

// storage
export { useLocalStorage } from './useLocalStorage';

// debounce
export { useDebounce, useDebouncedCallback } from './useDebounce';

// media query
export {
  useMediaQuery,
  useIsMobile,
  useIsTablet,
  useIsDesktop,
  useIsDarkMode,
  useIsReducedMotion,
} from './useMediaQuery';

// toggle
export { useToggle } from './useToggle';

// click outside
export { useClickOutside } from './useClickOutside';

// window size
export {
  useWindowSize,
  useWindowWidth,
  useWindowHeight,
} from './useWindowSize';
