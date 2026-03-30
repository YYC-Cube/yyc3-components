/**
 * file: useChannelManager.ts
 * description: 频道管理 Hook · 提供聊天频道的创建、删除和更新功能
 * author: YanYuCloudCube Team
 * version: v1.0.0
 * created: 2026-03-26
 * updated: 2026-03-26
 * status: active
 * tags: [hook],[chat],[channel]
 *
 * copyright: YanYuCloudCube Team
 * license: MIT
 *
 * brief: 聊天频道管理
 *
 * details:
 * - 频道创建（支持加密和预设）
 * - 频道删除（自动清理相关数据）
 * - 频道重命名
 * - 活跃频道切换
 * - 默认频道保护（主频道无法删除）
 * - localStorage 持久化
 * - 完整的 TypeScript 类型支持
 *
 * dependencies: React (useState, useEffect, useCallback), localStorage
 * exports: useChannelManager
 * notes: 删除频道时会自动清理该频道的所有聊天数据
 */

import { useState, useEffect, useCallback } from "react";
import type { Channel } from "./types";

const CHANNELS_KEY = "yyc3_channels_meta";

export interface UseChannelManagerReturn {
  channels: Channel[];
  activeChannelId: string;
  setActiveChannelId: (id: string) => void;
  createChannel: (name: string, options?: { isEncrypted?: boolean, preset?: string }) => string;
  deleteChannel: (id: string) => void;
  updateChannelName: (id: string, name: string) => void;
}

const DEFAULT_CHANNEL: Channel = {
  id: "main",
  name: "Main Console",
  createdAt: new Date(),
  preset: "General"
};

export function useChannelManager(): UseChannelManagerReturn {
  const [channels, setChannels] = useState<Channel[]>([DEFAULT_CHANNEL]);
  const [activeChannelId, setActiveChannelId] = useState<string>("main");

  // Load channels
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CHANNELS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored, (key, value) => {
            if (key === "createdAt") return new Date(value);
            return value;
        });
        setChannels(parsed);
      } else {
        localStorage.setItem(CHANNELS_KEY, JSON.stringify([DEFAULT_CHANNEL]));
      }
    } catch (e) {
      // Silent fail
    }
  }, []);

  // Save channels
  const saveChannels = useCallback((newChannels: Channel[]) => {
    localStorage.setItem(CHANNELS_KEY, JSON.stringify(newChannels));
    setChannels(newChannels);
  }, []);

  const createChannel = useCallback((name: string, options?: { isEncrypted?: boolean, preset?: string }) => {
    const newChannel: Channel = {
      id: `chan_${Date.now()}`,
      name: name,
      createdAt: new Date(),
      isEncrypted: options?.isEncrypted,
      preset: options?.preset || "General"
    };
    saveChannels([...channels, newChannel]);
    return newChannel.id;
  }, [channels, saveChannels]);

  const deleteChannel = useCallback((id: string) => {
    if (id === "main") return; // Protect main channel
    
    // Clean up channel data
    localStorage.removeItem(`yyc3_chat_history_${id}`);
    
    const newChannels = channels.filter((c: Channel) => c.id !== id);
    saveChannels(newChannels);
    
    if (activeChannelId === id) {
      setActiveChannelId("main");
    }
  }, [channels, activeChannelId, saveChannels]);

  const updateChannelName = useCallback((id: string, name: string) => {
    const newChannels = channels.map((c: Channel) => 
      c.id === id ? { ...c, name } : c
    );
    saveChannels(newChannels);
  }, [channels, saveChannels]);

  return {
    channels,
    activeChannelId,
    setActiveChannelId,
    createChannel,
    deleteChannel,
    updateChannelName
  };
}
