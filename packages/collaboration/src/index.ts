/**
 * file: index.ts
 * description: @yyc3/collaboration 包主入口文件 · 导出所有协同编辑相关类型、Hooks、服务和组件
 * author: YanYuCloudCube Team
 * version: v1.0.0
 * created: 2026-03-26
 * updated: 2026-03-26
 * status: active
 * tags: [collaboration],[crdt],[ot],[real-time]
 *
 * copyright: YanYuCloudCube Team
 * license: MIT
 *
 * brief: 提供完整的实时协同编辑解决方案
 *
 * details:
 * - CRDT 协同编辑引擎（无冲突复制数据类型）
 * - OT 操作转换（Operational Transformation）
 * - Presence 用户感知（光标位置、选区）
 * - 实时协作组件（在线用户、编辑状态）
 * - 冲突检测与解决（Last-Writer-Wins + OT merge）
 * - 文件同步（多文件同步、冲突合并）
 * - 离线编辑缓冲（离线操作、重连同步）
 * - 版本向量管理（Version Vector）
 *
 * dependencies: React, WebSocket API, Monaco Editor
 * exports: useCollaborativeEditing, useCRDTSync, useFileSync, 所有协同编辑相关组件和类型
 * notes: 支持多用户实时协同编辑，自动处理冲突
 */

// Hooks
export { useCollaborativeEditing } from './hooks/useCollaborativeEditing';
export { useCRDTSync } from './hooks/useCRDTSync';
export { useFileSync } from './hooks/useFileSync';

// Types
export type {
  TextOperation,
  CollaborationSession,
  CollaborationParticipant,
  CursorPosition,
  SelectionRange,
  CollabMessage,
  CRDTDocumentState,
} from './types/collaboration';

// Components
export { CollaborationPresence } from './components/CollaborationPresence';
export { DiffViewer } from './components/DiffViewer';
export { MonacoCodeEditor } from './components/MonacoCodeEditor';
export { UserAIPanel } from './components/UserAIPanel';
export { CodeDetailPanel } from './components/CodeDetailPanel';
export { CollabViewSwitcher } from './components/CollabViewSwitcher';
export { TerminalPanel } from './components/TerminalPanel';
export { ProjectFileManager } from './components/ProjectFileManager';
export { ProjectTemplateSelector } from './components/ProjectTemplateSelector';
export { SandboxPreview } from './components/SandboxPreview';
export { GlobalSearchPalette } from './components/GlobalSearchPalette';
export { DraggablePanelLayout } from './components/DraggablePanelLayout';
export { EditorTabBar } from './components/EditorTabBar';
