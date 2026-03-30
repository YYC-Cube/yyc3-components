/**
 * file: index.ts
 * description: @yyc3/crdt 包主入口文件 · 导出所有 CRDT 相关类型、服务和工具函数
 * author: YanYuCloudCube Team
 * version: v1.0.0
 * created: 2026-03-26
 * updated: 2026-03-26
 * status: active
 * tags: [crdt],[distributed],[data-structure]
 *
 * copyright: YanYuCloudCube Team
 * license: MIT
 *
 * brief: 提供完整的 CRDT 数据结构和同步引擎
 *
 * details:
 * - CRDT 数据结构（LWW-Element-Set, RGA, G-Counter, PN-Counter）
 * - CRDT 同步引擎（服务端仲裁）
 * - 操作转换（Operational Transformation）
 * - 版本向量管理（Version Vector）
 * - 冲突检测与解决（Last-Writer-Wins, Merge）
 *
 * dependencies: 无
 * exports: CRDT 引擎, 所有 CRDT 相关类型
 * notes: 无冲突复制数据类型，保证分布式系统数据一致性
 */

// Services
export { CRDTEngine } from './services/crdt-engine';

// Types
export type {
  TextOperation,
  CRDTDocumentState,
  VersionVector,
  ConflictResolution,
  CRDTNodeType,
  CRDTNode,
  CRDTMergeResult,
} from './types/crdt';
