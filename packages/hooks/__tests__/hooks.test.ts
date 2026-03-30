import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import {
  useLocalStorage,
  useDebounce,
  useMediaQuery,
  useToggle,
  useWindowSize,
} from '../src';

describe('Hooks Utilities', () => {
  describe('useToggle', () => {
    it('should toggle boolean state', () => {
      const { result } = renderHook(() => useToggle(false));
      expect(result.current[0]).toBe(false);

      act(() => {
        result.current[1]();
      });
      expect(result.current[0]).toBe(true);
    });
  });

  describe('useLocalStorage', () => {
    beforeEach(() => {
      localStorage.clear();
    });

    afterEach(() => {
      localStorage.clear();
    });

    it('should store and retrieve value', () => {
      const { result } = renderHook(() => useLocalStorage('test', 'initial'));
      expect(result.current[0]).toBe('initial');

      act(() => {
        result.current[1]('updated');
      });
      expect(result.current[0]).toBe('updated');
    });
  });

  describe('useDebounce', () => {
    it('should debounce value changes', () => {
      const { result, rerender } = renderHook(
        ({ value, delay }) => useDebounce(value, delay),
        {
          initialProps: { value: 'initial', delay: 500 },
        }
      );

      expect(result.current).toBe('initial');

      rerender({ value: 'updated', delay: 500 });
      expect(result.current).toBe('initial');
    });
  });

  describe('useMediaQuery', () => {
    it('should detect media query match', () => {
      const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));
      expect(typeof result.current).toBe('boolean');
    });
  });

  describe('useWindowSize', () => {
    it('should return window dimensions', () => {
      const { result } = renderHook(() => useWindowSize());
      expect(result.current.width).toBeGreaterThan(0);
      expect(result.current.height).toBeGreaterThan(0);
    });
  });
});
