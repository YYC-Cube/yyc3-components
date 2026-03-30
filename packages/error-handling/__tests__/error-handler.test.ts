import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  getErrorHandler,
  captureError,
  resetErrorHandler,
  ErrorCategory,
  AppError,
} from '../src';

describe('Error Handler', () => {
  beforeEach(() => {
    resetErrorHandler();
    vi.clearAllMocks();
  });

  afterEach(() => {
    resetErrorHandler();
  });

  describe('Error Category', () => {
    it('should categorize network errors correctly', () => {
      const error = new Error('Network Error');
      const handler = getErrorHandler();
      expect(handler.classifyError(error)).toBe(ErrorCategory.Network);
    });

    it('should categorize timeout errors correctly', () => {
      const error = new Error('timeout');
      const handler = getErrorHandler();
      expect(handler.classifyError(error)).toBe(ErrorCategory.Network);
    });
  });

  describe('captureError', () => {
    it('should capture and log errors', () => {
      const error = new Error('Test error');
      const handler = getErrorHandler();
      const logSpy = vi.spyOn(handler, 'logError');

      captureError(error, 'Test-Context');
      expect(logSpy).toHaveBeenCalled();
    });
  });

  describe('Error Statistics', () => {
    it('should track error statistics', () => {
      const handler = getErrorHandler();
      const error = new Error('Test error');

      handler.handleError(error, 'Test-Context');
      const stats = handler.getErrorStats();

      expect(stats.total).toBe(1);
      expect(stats.byCategory[ErrorCategory.Runtime]).toBe(1);
    });
  });

  describe('Safe Wrappers', () => {
    it('should wrap async functions safely', async () => {
      const handler = getErrorHandler();
      const fn = async () => {
        throw new Error('Async error');
      };

      const safeFn = handler.wrapAsync(fn);
      const result = await safeFn();

      expect(result.error).toBeDefined();
      expect(result.error?.message).toBe('Async error');
    });

    it('should wrap sync functions safely', () => {
      const handler = getErrorHandler();
      const fn = () => {
        throw new Error('Sync error');
      };

      const safeFn = handler.wrapSync(fn);
      const result = safeFn();

      expect(result.error).toBeDefined();
      expect(result.error?.message).toBe('Sync error');
    });
  });

  describe('AppError', () => {
    it('should create error with metadata', () => {
      const error = new AppError('Test error', ErrorCategory.Runtime, {
        context: 'Test',
      });

      expect(error.category).toBe(ErrorCategory.Runtime);
      expect(error.context).toBe('Test');
    });
  });
});
