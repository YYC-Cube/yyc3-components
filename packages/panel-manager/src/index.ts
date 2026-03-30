/**
 * file: index.ts
 * description: @yyc3/panel-manager 包主入口文件 · 导出所有面板管理相关类型、Hooks 和组件
 * author: YanYuCloudCube Team
 * version: v1.0.0
 * created: 2026-03-26
 * updated: 2026-03-26
 * status: active
 * tags: [panel],[ui],[layout]
 *
 * copyright: YanYuCloudCube Team
 * license: MIT
 *
 * brief: 提供完整的面板管理解决方案
 *
 * details:
 * - 面板状态管理（打开、关闭、切换）
 * - 可拖动面板（拖拽调整大小、位置）
 * - 编辑器标签页（标签页管理、切换）
 * - 统一面板状态（Single Source of Truth）
 * - 自动互斥（同一时间只能打开一个面板）
 * - 类型安全（TypeScript 类型保护）
 * - 向后兼容（支持旧的布尔值状态）
 *
 * dependencies: React, Drag and Drop API
 * exports: usePanelManager, useDraggablePanels, useEditorTabs, 所有面板管理相关组件和类型
 * notes: 替代 15+ 个布尔值状态变量，统一管理面板状态
 */

// Hooks
export { usePanelManager } from './hooks/usePanelManager';
export { useDraggablePanels } from './hooks/useDraggablePanels';
export { useEditorTabs } from './hooks/useEditorTabs';

// Types
export type {
  PanelType,
  PanelState,
  PanelAction,
  PanelContext,
  DraggablePanel,
  EditorTab,
  UsePanelManagerReturn,
  UseDraggablePanelsReturn,
  UseEditorTabsReturn,
} from './types/panel-manager';

// Components
export { DraggablePanelLayout } from './components/DraggablePanelLayout';
export { EditorTabBar } from './components/EditorTabBar';
