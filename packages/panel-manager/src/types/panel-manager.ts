/**
 * YYC³ AI Family - Panel Manager Type Definitions
 *
 * Centralized panel/modal state management types
 * Replaces 15+ boolean state variables with a single union type
 */

/**
 * Panel Type Union
 * All possible panels/modals that can be displayed in FamilyDashboard
 */
export type PanelType =
  | 'PROTOCOLS' // SystemProtocols overlay
  | 'TOPOLOGY' // NetworkTopology overlay
  | 'DEBUG' // Debug panel (future)
  | 'BACKEND' // BackendPanel configuration
  | 'FIVE_DIMENSIONS' // FiveDimensionsPanel (5D Genome visualization)
  | 'PHILOSOPHY' // PhilosophyFramework (五高五标五化)
  | 'TECH_AUDIT' // TechAuditPanel (technical debt dashboard)
  | 'KNOWLEDGE_BASE' // KnowledgeBasePanel (RAG search UI)
  | 'TERMINAL' // IntegratedTerminal
  | 'MEMBER_DETAIL'; // MemberDetailPanel

/**
 * Panel State Interface
 * Encapsulates all panel-related state
 */
export interface PanelState {
  /** Currently active panel (null if all closed) */
  activePanel: PanelType | null;

  /** Context data for the active panel */
  panelContext?: PanelContext;
}

/**
 * Panel Context
 * Context data for the active panel
 */
export interface PanelContext {
  /** Member being viewed in MEMBER_DETAIL panel */
  viewingMemberId?: string;

  /** Initial view mode for FIVE_DIMENSIONS panel */
  fiveDimensionsView?: 'CYCLE' | 'MATRIX';
}

/**
 * Panel Manager Actions
 */
export type PanelAction =
  | { type: 'OPEN_PANEL'; panel: PanelType; context?: PanelContext }
  | { type: 'CLOSE_PANEL' }
  | { type: 'TOGGLE_PANEL'; panel: PanelType; context?: PanelContext };

/**
 * Panel Manager Return Type
 */
export interface UsePanelManagerReturn {
  /** Current panel state */
  state: PanelState;

  /** Open a specific panel with optional context */
  openPanel: (panel: PanelType, context?: PanelContext) => void;

  /** Close the currently active panel */
  closePanel: () => void;

  /** Toggle a panel (close if already open, open if closed) */
  togglePanel: (panel: PanelType, context?: PanelContext) => void;

  /** Check if a specific panel is currently active */
  isPanelActive: (panel: PanelType) => boolean;

  /** Get the current panel context */
  getContext: <K extends keyof PanelContext>(
    key: K
  ) => PanelContext[K] | undefined;
}

/**
 * Editor Tab Interface
 */
export interface EditorTab {
  /** 文件路径（唯一标识） */
  id: string;
  /** 显示名称 */
  name: string;
  /** 文件语言 */
  language: string;
  /** 文件内容 */
  content: string;
  /** 是否有未保存变更 */
  isDirty: boolean;
  /** 原始内容（用于比较是否有变更） */
  originalContent: string;
  /** 光标位置 */
  cursorPosition?: { line: number; column: number };
  /** 滚动位置 */
  scrollPosition?: { top: number; left: number };
}

/**
 * Editor Tabs Manager Return Type
 */
export interface UseEditorTabsReturn {
  /** 所有打开的标签页 */
  tabs: EditorTab[];
  /** 当前活动标签页 ID */
  activeTabId: string | null;
  /** 当前活动标签页 */
  activeTab: EditorTab | null;

  /** 打开文件（已打开则激活，未打开则新建标签） */
  openFile: (
    path: string,
    name: string,
    language: string,
    content: string
  ) => void;
  /** 关闭标签页 */
  closeTab: (tabId: string) => void;
  /** 激活标签页 */
  activateTab: (tabId: string) => void;
  /** 更新标签页内容 */
  updateTabContent: (tabId: string, content: string) => void;
  /** 保存标签页（清除脏标记） */
  saveTab: (tabId: string) => void;
  /** 获取下一个标签页（用于关闭后激活） */
  getNextTab: (tabId: string) => EditorTab | null;
}

/**
 * Draggable Panel Interface
 * Note: This is a placeholder type for compatibility
 */
export interface DraggablePanel {
  id: string;
  type: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

/**
 * Draggable Panels Manager Return Type
 * Note: This is a placeholder type for compatibility
 */
export interface UseDraggablePanelsReturn {
  layout: unknown;
  splitPanel: (
    panelId: string,
    direction: string,
    newPanelType?: string
  ) => void;
  mergePanel: (sourceId: string, targetId: string, position: string) => void;
  closePanel: (panelId: string) => void;
  setActivePanel: (panelId: string | null) => void;
  toggleMaximize: (panelId: string) => void;
  handleDragOver: (panelId: string | null, position: string | null) => void;
}
