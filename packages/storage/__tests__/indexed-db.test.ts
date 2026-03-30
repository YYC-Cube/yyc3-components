import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createIndexedDB, IndexedDBConfig } from '../src';

describe('IndexedDB Utilities', () => {
  let db: ReturnType<typeof createIndexedDB> | null = null;
  const dbName = 'test-database';
  const storeName = 'test-store';

  beforeEach(async () => {
    const config: IndexedDBConfig = {
      name: dbName,
      version: 1,
      stores: [{ name: storeName, keyPath: 'id' }],
    };

    db = createIndexedDB(config);
    await db.init();
  });

  afterEach(async () => {
    if (db) {
      await db.clear(storeName);
      await db.close();
    }
  });

  describe('createIndexedDB', () => {
    it('should create database instance', () => {
      expect(db).toBeDefined();
      expect(db).toHaveProperty('get');
      expect(db).toHaveProperty('put');
      expect(db).toHaveProperty('delete');
      expect(db).toHaveProperty('getAll');
    });
  });

  describe('CRUD Operations', () => {
    it('should put and get item', async () => {
      const item = { id: '1', name: 'Test Item' };
      await db!.put(storeName, item);

      const result = await db!.get(storeName, '1');
      expect(result).toEqual(item);
    });

    it('should get all items', async () => {
      const items = [
        { id: '1', name: 'Item 1' },
        { id: '2', name: 'Item 2' },
        { id: '3', name: 'Item 3' },
      ];

      for (const item of items) {
        await db!.put(storeName, item);
      }

      const result = await db!.getAll(storeName);
      expect(result).toHaveLength(3);
    });

    it('should delete item', async () => {
      const item = { id: '1', name: 'Test Item' };
      await db!.put(storeName, item);
      await db!.delete(storeName, '1');

      const result = await db!.get(storeName, '1');
      expect(result).toBeUndefined();
    });

    it('should clear all items', async () => {
      const items = [
        { id: '1', name: 'Item 1' },
        { id: '2', name: 'Item 2' },
      ];

      for (const item of items) {
        await db!.put(storeName, item);
      }

      await db!.clear(storeName);
      const result = await db!.getAll(storeName);
      expect(result).toHaveLength(0);
    });
  });
});
