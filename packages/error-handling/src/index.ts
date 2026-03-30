/**
 * @yyc3/error-handling
 * YYC3可复用组件库 - 错误处理系统
 */

// Platform error filter
export {
  PlatformErrorFilter,
  createFigmaErrorFilter,
  isPlatformError,
  type FilterRule,
  type ErrorContext,
} from './platform-error-filter';

// Error handler
export {
  ErrorHandler,
  LocalStorageErrorStorage,
  getErrorHandler,
  captureError,
  getErrorLog,
  getErrorStats,
  clearErrorLog,
  trySafe,
  trySafeSync,
  type ErrorStorage,
  type ErrorHandlerConfig,
} from './error-handler';
