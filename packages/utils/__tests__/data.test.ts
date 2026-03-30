import { describe, it, expect } from 'vitest';
import { deepClone, unique, groupBy, chunk } from '../src/data';

describe('Data Utilities', () => {
  describe('deepClone', () => {
    it('should clone objects deeply', () => {
      const obj = { a: 1, b: { c: 2 } };
      const cloned = deepClone(obj);
      expect(cloned).toEqual(obj);
      expect(cloned).not.toBe(obj);
      expect(cloned.b).not.toBe(obj.b);
    });

    it('should clone arrays', () => {
      const arr = [1, 2, [3, 4]];
      const cloned = deepClone(arr);
      expect(cloned).toEqual(arr);
      expect(cloned).not.toBe(arr);
      expect(cloned[2]).not.toBe(arr[2]);
    });
  });

  describe('unique', () => {
    it('should remove duplicates from array', () => {
      const arr = [1, 2, 2, 3, 3, 3];
      expect(unique(arr)).toEqual([1, 2, 3]);
    });

    it('should handle empty array', () => {
      expect(unique([])).toEqual([]);
    });
  });

  describe('groupBy', () => {
    it('should group array items by key', () => {
      const items = [
        { category: 'a', value: 1 },
        { category: 'b', value: 2 },
        { category: 'a', value: 3 },
      ];
      const result = groupBy(items, 'category');
      expect(result).toEqual({
        a: [
          { category: 'a', value: 1 },
          { category: 'a', value: 3 },
        ],
        b: [{ category: 'b', value: 2 }],
      });
    });
  });

  describe('chunk', () => {
    it('should split array into chunks', () => {
      const arr = [1, 2, 3, 4, 5];
      expect(chunk(arr, 2)).toEqual([[1, 2], [3, 4], [5]]);
    });

    it('should handle chunk size larger than array', () => {
      const arr = [1, 2, 3];
      expect(chunk(arr, 5)).toEqual([[1, 2, 3]]);
    });

    it('should handle empty array', () => {
      expect(chunk([], 3)).toEqual([]);
    });
  });
});
