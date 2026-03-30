/**
 * file: types.ts
 * description: 聊天类型定义文件 · 包含所有聊天相关的 TypeScript 接口和类型
 * author: YanYuCloudCube Team
 * version: v1.0.0
 * created: 2026-03-26
 * updated: 2026-03-26
 * status: active
 * tags: [chat],[types],[typescript]
 *
 * copyright: YanYuCloudCube Team
 * license: MIT
 *
 * brief: 聊天相关的类型定义
 *
 * details:
 * - Message: 消息接口（支持流式状态）
 * - Chat: 聊天会话接口（包含消息列表和元数据）
 * - Channel: 频道接口（支持加密和预设）
 * - UseChatPersistenceReturn: 聊天持久化 Hook 返回类型
 * - UseChannelManagerReturn: 频道管理 Hook 返回类型
 *
 * dependencies: React
 * exports: Message, Chat, Channel, UseChatPersistenceReturn, UseChannelManagerReturn
 * notes: 所有接口均支持扩展，便于添加新功能
 */

export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  isStreaming?: boolean;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  isStarred?: boolean;
  channelId?: string;
}

export interface Channel {
  id: string;
  name: string;
  createdAt: Date;
  isEncrypted?: boolean;
  preset?: string;
}

export interface UseChatPersistenceReturn {
  chats: Chat[];
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>;
  loading: boolean;
  exportData: () => void;
  importData: (jsonString: string) => boolean;
}

export interface UseChannelManagerReturn {
  channels: Channel[];
  activeChannelId: string;
  setActiveChannelId: (id: string) => void;
  createChannel: (name: string, options?: { isEncrypted?: boolean, preset?: string }) => string;
  deleteChannel: (id: string) => void;
  updateChannelName: (id: string, name: string) => void;
}
