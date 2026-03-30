/**
 * file: index.ts
 * description: @yyc3/knowledge-base 包主入口文件 · 导出所有知识库相关类型和服务
 * author: YanYuCloudCube Team
 * version: v1.0.0
 * created: 2026-03-26
 * updated: 2026-03-26
 * status: active
 * tags: [knowledge-base],[kb],[graph]
 *
 * copyright: YanYuCloudCube Team
 * license: MIT
 *
 * brief: 提供完整的知识库解决方案
 *
 * details:
 * - 知识库引擎（文档存储、索引、搜索）
 * - 知识图谱（实体、关系、属性）
 * - 知识同步引擎（增量同步、冲突解决）
 * - 知识查询（语义搜索、关系查询）
 * - 知识导入导出（JSON、CSV、Markdown）
 * - 知识版本控制（文档历史、版本对比）
 *
 * dependencies: 无
 * exports: KnowledgeBase, KnowledgeGraph, KnowledgeSyncEngine, 所有知识库相关类型
 * notes: 支持语义搜索和知识图谱
 */

// Services
export { KnowledgeBase } from './services/knowledge-base';
export { KnowledgeGraph } from './services/kb-knowledge-graph';
export { SyncEngine as KnowledgeSyncEngine } from './services/kb-sync-engine';

// Types
export type {
  KnowledgeDocument,
  KnowledgeEntity,
  KnowledgeRelation,
  KnowledgeQuery,
  KnowledgeSearchResult,
  SyncStatus,
  KnowledgeVersion,
} from './types/knowledge';
