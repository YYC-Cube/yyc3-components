import { describe, it, expect, beforeEach, vi } from 'vitest';
import { formatDate, getRelativeTime, isToday, isThisWeek } from '../src/date';

describe('Date Utilities', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('formatDate', () => {
    it('should format date with default locale', () => {
      const date = new Date('2024-01-15');
      const result = formatDate(date);
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });

    it('should format date with specified locale', () => {
      const date = new Date('2024-01-15');
      const result = formatDate(date, 'zh-CN');
      expect(result).toBeTruthy();
    });
  });

  describe('getRelativeTime', () => {
    it('should return "just now" for current time', () => {
      const now = new Date();
      expect(getRelativeTime(now)).toBe('just now');
    });

    it('should return correct relative time for past dates', () => {
      const now = new Date();
      const oneHourAgo = new Date(now.getTime() - 3600000);
      expect(getRelativeTime(oneHourAgo)).toBe('1 hour ago');
    });
  });

  describe('isToday', () => {
    it('should return true for today', () => {
      const today = new Date();
      expect(isToday(today)).toBe(true);
    });

    it('should return false for yesterday', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(isToday(yesterday)).toBe(false);
    });
  });

  describe('isThisWeek', () => {
    it('should return true for dates in current week', () => {
      const today = new Date();
      expect(isThisWeek(today)).toBe(true);
    });
  });
});
