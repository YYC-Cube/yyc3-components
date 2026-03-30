/**
 * Supabase 云同步 Hook - 本地聊天数据与云端 KV Store 双向同步
 * Supabase Cloud Sync Hook - Bidirectional sync between local chat data and cloud KV Store
 *
 * @module hooks/useSupabaseSync
 * @version 0.9.4
 */

import { useCallback, useEffect, useState } from 'react';
import type { Chat, Message } from '../types/storage';
import { toast } from 'sonner';
import { projectId, publicAnonKey } from '../utils/supabase/info';

const SERVER_URL = `https://${projectId}.supabase.co/functions/v1/make-server-ccd2d338`;

/**
 * Supabase 同步 Hook / Supabase sync hook
 *
 * @param {string} channelId - 频道 ID / Channel ID
 * @param {Chat[]} localChats - 本地聊天列表 / Local chat list
 * @param {(remoteChats: Chat[]) => void} onRemoteUpdate - 远程更新回调 / Remote update callback
 */
export const useSupabaseSync = (
  channelId: string,
  localChats: Chat[],
  onRemoteUpdate: (remoteChats: Chat[]) => void
) => {
  const [isOffline, setIsOffline] = useState(false);

  /**
   * 上传本地聊天到 Supabase Edge Function (KV Store)
   * Upload local chats to Supabase Edge Function (KV Store)
   */
  const syncToSupabase = useCallback(async (chats: Chat[]) => {
    try {
      const taggedChats = chats.map(c => ({ ...c, channelId }));

      const response = await fetch(`${SERVER_URL}/chats`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({ chats: taggedChats }),
      });

      if (!response.ok) {
        if (response.status === 503) {
          setIsOffline(true);
          return;
        }
        throw new Error(`SYNC_UPLOAD_FAILED: ${response.statusText}`);
      }

      if (isOffline) setIsOffline(false);
    } catch {
      // 静默处理网络错误，避免干扰用户 / Silently handle network errors
      setIsOffline(true);
    }
  }, [isOffline, channelId]);

  /**
   * 从 Supabase Edge Function 下载聊天数据
   * Download chats from Supabase Edge Function
   */
  const syncFromSupabase = useCallback(async () => {
    try {
      const response = await fetch(`${SERVER_URL}/chats?channelId=${channelId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
      });

      if (!response.ok) {
        if (response.status === 503) {
          setIsOffline(true);
          toast.error("CLOUD_LINK_OFFLINE", {
            description: "Running in local-only mode. Cloud sync paused."
          });
          return;
        }
        const errBody = await response.text();
        throw new Error(`FETCH_FAILED: ${response.status} ${errBody.slice(0, 100)}`);
      }

      const json: unknown = await response.json();
      const rawChats: unknown[] = Array.isArray(json)
        ? json
        : (json as Record<string, unknown>).data as unknown[];

      if (Array.isArray(rawChats)) {
        const parsedChats: Chat[] = rawChats.map((chatRaw: unknown) => {
          const chat = chatRaw as Record<string, unknown>;
          const messages = (chat.messages as Array<Record<string, unknown>>).map(
            (msg: Record<string, unknown>): Message => ({
              id: String(msg.id),
              text: String(msg.text),
              isUser: Boolean(msg.isUser),
              timestamp: new Date(String(msg.timestamp)),
              isStreaming: msg.isStreaming ? Boolean(msg.isStreaming) : undefined,
            })
          );
          return {
            id: String(chat.id),
            title: String(chat.title),
            messages,
            createdAt: new Date(String(chat.createdAt)),
            updatedAt: new Date(String(chat.updatedAt)),
            channelId: chat.channelId ? String(chat.channelId) : undefined,
          } as Chat;
        }).sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

        onRemoteUpdate(parsedChats);

        if (isOffline) {
          setIsOffline(false);
          toast.success("CLOUD_LINK_RESTORED");
        } else {
          toast.success('CLOUD_SYNC_COMPLETE', {
            description: "Data synchronized from central mainframe."
          });
        }
      }
    } catch {
      // 网络不可达时静默降级为离线模式 / Silently degrade to offline mode when network unreachable
      setIsOffline(true);
    }
  }, [onRemoteUpdate, isOffline, channelId]);

  // 初始同步 / Initial sync
  useEffect(() => {
    syncFromSupabase();
  }, [syncFromSupabase]);

  return {
    syncToSupabase,
    syncFromSupabase,
    isOffline
  };
};
