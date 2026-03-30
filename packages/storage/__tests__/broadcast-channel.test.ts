import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createBroadcastChannel } from '../src';

describe('BroadcastChannel Utilities', () => {
  let channel1: ReturnType<typeof createBroadcastChannel> | null = null;
  let channel2: ReturnType<typeof createBroadcastChannel> | null = null;

  beforeEach(() => {
    channel1 = createBroadcastChannel('test-channel', vi.fn());
    channel2 = createBroadcastChannel('test-channel', vi.fn());
  });

  afterEach(() => {
    if (channel1) {
      channel1.close();
    }
    if (channel2) {
      channel2.close();
    }
  });

  describe('createBroadcastChannel', () => {
    it('should create broadcast channel', () => {
      expect(channel1).toBeDefined();
      expect(channel1).toHaveProperty('send');
      expect(channel1).toHaveProperty('close');
    });
  });

  describe('send and receive', () => {
    it('should send and receive messages', (done) => {
      const mockCallback = vi.fn();
      const channel = createBroadcastChannel('test-2', (data) => {
        expect(data).toBe('Hello!');
        done();
      });

      channel.send('Hello!');

      setTimeout(() => {
        channel.close();
      }, 100);
    });
  });

  describe('close', () => {
    it('should close channel', () => {
      const channel = createBroadcastChannel('test-3', vi.fn());
      expect(() => channel.close()).not.toThrow();
    });
  });
});
