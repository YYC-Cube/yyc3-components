/**
 * file: useChatPersistence.ts
 * description: 聊天持久化 Hook · 提供聊天数据的持久化、导入导出和自动清理功能
 * author: YanYuCloudCube Team
 * version: v1.0.0
 * created: 2026-03-26
 * updated: 2026-03-26
 * status: active
 * tags: [hook],[chat],[persistence]
 *
 * copyright: YanYuCloudCube Team
 * license: MIT
 *
 * brief: 聊天数据持久化管理
 *
 * details:
 * - localStorage 自动保存和加载
 * - 数据迁移（自动添加新字段）
 * - 自动清理（存储空间和过期数据）
 * - 数据导出（JSON 格式文件下载）
 * - 数据导入（JSON 格式文件上传）
 * - 多频道支持（独立存储）
 * - 收藏保护（星标聊天不会被清理）
 *
 * dependencies: React (useState, useEffect, useCallback), localStorage
 * exports: useChatPersistence
 * notes: 最大存储限制 5MB，超过时自动清理 30 天前的非星标聊天
 */

import { useState, useEffect, useCallback } from "react";
import type { Chat } from "./types";

const MAX_STORAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_AGE_DAYS = 30;

export function useChatPersistence(channelId: string, initialChats: Chat[] = []) {
  const [chats, setChats] = useState<Chat[]>(initialChats);
  const [loading, setLoading] = useState(true);

  const getStorageKey = (id: string) => id === 'main' ? "yyc3_chat_history" : `yyc3_chat_history_${id}`;

  // Load from storage
  useEffect(() => {
    setLoading(true);
    try {
      const key = getStorageKey(channelId);
      const stored = localStorage.getItem(key);
      
      if (stored) {
        const parsed: Chat[] = JSON.parse(stored, (key, value) => {
          if (key === "createdAt" || key === "updatedAt" || key === "timestamp") {
            return new Date(value);
          }
          return value;
        });

        // Migration
        const migrated = parsed.map(chat => ({
          ...chat,
          isStarred: chat.isStarred ?? false,
          messages: chat.messages || []
        }));

        setChats(migrated);
      } else {
        setChats(initialChats);
      }
    } catch (e) {
      setChats(initialChats);
    } finally {
      setLoading(false);
    }
  }, [channelId]);

  // Save to storage
  const saveChats = useCallback((newChats: Chat[]) => {
    try {
      const key = getStorageKey(channelId);
      const serialized = JSON.stringify(newChats);
      
      if (serialized.length > MAX_STORAGE_SIZE) {
        const now = new Date();
        const cutoff = new Date(now.getTime() - MAX_AGE_DAYS * 24 * 60 * 60 * 1000);
        
        const cleaned = newChats.filter(c => 
          c.isStarred || new Date(c.updatedAt) > cutoff
        );
        
        localStorage.setItem(key, JSON.stringify(cleaned));
        setChats(cleaned);
      } else {
        localStorage.setItem(key, serialized);
        setChats(newChats);
      }
    } catch (e) {
      // Silent fail
    }
  }, [channelId]);

  // Wrapper
  const setChatsWrapper = useCallback((value: Chat[] | ((val: Chat[]) => Chat[])) => {
    setChats((prev: Chat[]) => {
      const newValue = typeof value === 'function' ? value(prev) : value;
      saveChats(newValue);
      return newValue;
    });
  }, [saveChats]);

  // Export Data
  const exportData = useCallback(() => {
    const data = {
      channelId,
      timestamp: new Date().toISOString(),
      chats
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `yyc3_channel_${channelId}_${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [chats, channelId]);

  // Import Data
  const importData = useCallback((jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString, (key, value) => {
        if (key === "createdAt" || key === "updatedAt" || key === "timestamp") {
          return new Date(value);
        }
        return value;
      });

      if (parsed.chats && Array.isArray(parsed.chats)) {
        setChatsWrapper(parsed.chats);
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  }, [setChatsWrapper]);

  return {
    chats, 
    setChats: setChatsWrapper, 
    loading,
    exportData,
    importData
  };
}
