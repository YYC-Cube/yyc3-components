/**
 * file: index.ts
 * description: @yyc3/ai 包主入口文件 · 导出所有 AI 相关类型、Hooks 和工具函数
 * author: YanYuCloudCube Team
 * version: v1.0.0
 * created: 2026-03-26
 * updated: 2026-03-26
 * status: active
 * tags: [ai],[llm],[hook]
 *
 * copyright: YanYuCloudCube Team
 * license: MIT
 *
 * brief: 提供 AI 对话功能的完整解决方案
 *
 * details:
 * - 支持流式响应（SSE）
 * - 多提供商支持（OpenAI, Anthropic, Ollama, Zhipu, Qwen, DeepSeek）
 * - 配置管理（支持本地持久化和版本迁移）
 * - 自动降级（网络失败时使用模拟响应）
 * - 完整的 TypeScript 类型支持
 *
 * dependencies: React, Fetch API, localStorage
 * exports: useAI, createAIStreamParser, 所有 AI 相关类型
 * notes: 默认使用 Ollama 本地模型，可在 localStorage 中修改配置
 */

// Types
export type { AIConfig, AIProvider, AIMessage, AIStreamCallback } from "./types";

// Hooks
export { useAI } from "./useAI";
export type { UseAIReturn } from "./useAI";

// Utils
export { createAIStreamParser } from "./utils";
export type { StreamChunk } from "./utils";
