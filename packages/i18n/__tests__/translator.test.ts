import { describe, it, expect } from 'vitest';
import {
  createTranslator,
  mergeMessages,
  validateMessages,
  extractKeys,
  checkConsistency,
} from '../src';

describe('I18n Utilities', () => {
  const messages = {
    hello: '你好',
    greeting: '你好, {name}!',
    nav: {
      home: '首页',
      settings: '设置',
    },
    auth: {
      login: '登录',
      register: '注册',
    },
  };

  describe('createTranslator', () => {
    it('should create translator function', () => {
      const t = createTranslator(messages);
      expect(t).toBeInstanceOf(Function);
    });

    it('should translate simple keys', () => {
      const t = createTranslator(messages);
      expect(t('hello')).toBe('你好');
    });

    it('should translate nested keys', () => {
      const t = createTranslator(messages);
      expect(t('nav.home')).toBe('首页');
    });

    it('should interpolate variables', () => {
      const t = createTranslator(messages);
      expect(t('greeting', { name: '张三' })).toBe('你好, 张三!');
    });

    it('should return key for missing translation', () => {
      const t = createTranslator(messages);
      expect(t('missing')).toBe('missing');
    });
  });

  describe('mergeMessages', () => {
    it('should merge message objects', () => {
      const base = { hello: '你好' };
      const override = { hello: 'Hi', world: '世界' };
      const result = mergeMessages(base, override);

      expect(result).toEqual({ hello: 'Hi', world: '世界' });
    });

    it('should deep merge nested objects', () => {
      const base = { nav: { home: '首页' } };
      const override = { nav: { about: '关于' } };
      const result = mergeMessages(base, override);

      expect(result).toEqual({ nav: { home: '首页', about: '关于' } });
    });
  });

  describe('validateMessages', () => {
    it('should validate messages structure', () => {
      const errors = validateMessages(messages);
      expect(errors).toEqual([]);
    });

    it('should detect empty values', () => {
      const invalidMessages = { hello: '' };
      const errors = validateMessages(invalidMessages);
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe('extractKeys', () => {
    it('should extract all keys from messages', () => {
      const keys = extractKeys(messages);
      expect(keys).toContain('hello');
      expect(keys).toContain('nav.home');
      expect(keys).toContain('auth.login');
    });
  });

  describe('checkConsistency', () => {
    it('should check consistency between locales', () => {
      const enMessages = {
        hello: 'Hello',
        nav: { home: 'Home', settings: 'Settings' },
      };
      const zhMessages = {
        hello: '你好',
        nav: { home: '首页', settings: '设置' },
      };

      const result = checkConsistency(enMessages, zhMessages);
      expect(result.missingInEn).toEqual([]);
      expect(result.missingInZh).toEqual([]);
    });

    it('should detect missing keys', () => {
      const enMessages = {
        hello: 'Hello',
        nav: { home: 'Home', settings: 'Settings' },
      };
      const zhMessages = {
        hello: '你好',
        nav: { home: '首页' },
      };

      const result = checkConsistency(enMessages, zhMessages);
      expect(result.missingInZh).toContain('nav.settings');
    });
  });
});
