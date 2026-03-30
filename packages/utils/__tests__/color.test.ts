import { describe, it, expect } from 'vitest';
import {
  hexToRgb,
  hexToRgba,
  isDarkColor,
  getContrastColor,
} from '../src/color';

describe('Color Utilities', () => {
  describe('hexToRgb', () => {
    it('should convert hex to rgb', () => {
      expect(hexToRgb('#ffffff')).toEqual({ r: 255, g: 255, b: 255 });
      expect(hexToRgb('#000000')).toEqual({ r: 0, g: 0, b: 0 });
    });

    it('should handle 3-character hex', () => {
      expect(hexToRgb('#fff')).toEqual({ r: 255, g: 255, b: 255 });
    });
  });

  describe('hexToRgba', () => {
    it('should convert hex to rgba', () => {
      expect(hexToRgba('#ffffff', 0.5)).toEqual({
        r: 255,
        g: 255,
        b: 255,
        a: 0.5,
      });
    });
  });

  describe('isDarkColor', () => {
    it('should detect dark colors', () => {
      expect(isDarkColor('#000000')).toBe(true);
      expect(isDarkColor('#333333')).toBe(true);
    });

    it('should detect light colors', () => {
      expect(isDarkColor('#ffffff')).toBe(false);
      expect(isDarkColor('#ff0000')).toBe(false);
    });
  });

  describe('getContrastColor', () => {
    it('should return white text for dark backgrounds', () => {
      expect(getContrastColor('#000000')).toBe('#ffffff');
    });

    it('should return black text for light backgrounds', () => {
      expect(getContrastColor('#ffffff')).toBe('#000000');
    });
  });
});
