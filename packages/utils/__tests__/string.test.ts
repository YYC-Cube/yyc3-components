import { describe, it, expect } from 'vitest';
import {
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
} from '../src/string';

describe('String Utilities', () => {
  describe('truncate', () => {
    it('should truncate string to specified length', () => {
      expect(truncate('Hello World', 5)).toBe('Hello...');
      expect(truncate('Hello World', 10)).toBe('Hello Worl...');
    });

    it('should not truncate if length is sufficient', () => {
      expect(truncate('Hello', 10)).toBe('Hello');
    });

    it('should handle empty string', () => {
      expect(truncate('', 10)).toBe('');
    });
  });

  describe('capitalize', () => {
    it('should capitalize first letter', () => {
      expect(capitalize('hello')).toBe('Hello');
      expect(capitalize('hello world')).toBe('Hello world');
    });

    it('should handle empty string', () => {
      expect(capitalize('')).toBe('');
    });
  });

  describe('camelToKebab', () => {
    it('should convert camelCase to kebab-case', () => {
      expect(camelToKebab('helloWorld')).toBe('hello-world');
      expect(camelToKebab('myComponentName')).toBe('my-component-name');
    });
  });

  describe('kebabToCamel', () => {
    it('should convert kebab-case to camelCase', () => {
      expect(kebabToCamel('hello-world')).toBe('helloWorld');
      expect(kebabToCamel('my-component-name')).toBe('myComponentName');
    });
  });

  describe('randomString', () => {
    it('should generate string of specified length', () => {
      const str = randomString(10);
      expect(str.length).toBe(10);
    });

    it('should generate different strings', () => {
      const str1 = randomString(10);
      const str2 = randomString(10);
      expect(str1).not.toBe(str2);
    });
  });

  describe('uuid', () => {
    it('should generate valid UUID v4 format', () => {
      const id = uuid();
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      expect(uuidRegex.test(id)).toBe(true);
    });

    it('should generate different UUIDs', () => {
      const id1 = uuid();
      const id2 = uuid();
      expect(id1).not.toBe(id2);
    });
  });

  describe('interpolate', () => {
    it('should replace placeholders with values', () => {
      const result = interpolate('Hello {name}!', { name: 'World' });
      expect(result).toBe('Hello World!');
    });

    it('should handle multiple placeholders', () => {
      const result = interpolate('{greeting}, {name}!', {
        greeting: 'Hello',
        name: 'World',
      });
      expect(result).toBe('Hello, World!');
    });

    it('should handle missing placeholders', () => {
      const result = interpolate('Hello {name}!', {});
      expect(result).toBe('Hello {name}!');
    });
  });

  describe('escapeHtml', () => {
    it('should escape HTML special characters', () => {
      expect(escapeHtml('<div>')).toBe('&lt;div&gt;');
      expect(escapeHtml('"test"')).toBe('&quot;test&quot;');
      expect(escapeHtml("'test'")).toBe('&#39;test&#39;');
      expect(escapeHtml('&')).toBe('&amp;');
    });
  });

  describe('unescapeHtml', () => {
    it('should unescape HTML entities', () => {
      expect(unescapeHtml('&lt;div&gt;')).toBe('<div>');
      expect(unescapeHtml('&quot;test&quot;')).toBe('"test"');
      expect(unescapeHtml('&#39;test&#39;')).toBe("'test'");
      expect(unescapeHtml('&amp;')).toBe('&');
    });
  });

  describe('isBlank', () => {
    it('should return true for empty string', () => {
      expect(isBlank('')).toBe(true);
    });

    it('should return true for whitespace only', () => {
      expect(isBlank('   ')).toBe(true);
      expect(isBlank('\t\n')).toBe(true);
    });

    it('should return false for non-empty string', () => {
      expect(isBlank('hello')).toBe(false);
    });
  });

  describe('removeWhitespace', () => {
    it('should remove all whitespace', () => {
      expect(removeWhitespace('hello world')).toBe('helloworld');
      expect(removeWhitespace('  hello  world  ')).toBe('helloworld');
    });
  });

  describe('truncateByWords', () => {
    it('should truncate by word count', () => {
      const result = truncateByWords('Hello world this is a test', 3);
      expect(result).toBe('Hello world this...');
    });

    it('should not truncate if word count is sufficient', () => {
      const result = truncateByWords('Hello world', 5);
      expect(result).toBe('Hello world');
    });
  });

  describe('slugify', () => {
    it('should convert to slug format', () => {
      expect(slugify('Hello World')).toBe('hello-world');
      expect(slugify('Hello   World')).toBe('hello-world');
      expect(slugify('Hello@World!')).toBe('hello-world');
    });

    it('should handle special characters', () => {
      expect(slugify('Hello -- World')).toBe('hello-world');
      expect(slugify('Hello_World')).toBe('hello_world');
    });
  });
});
