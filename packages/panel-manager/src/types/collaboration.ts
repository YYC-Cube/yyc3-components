export interface PanelLayoutNode {
  id: string
  type: 'panel' | 'split'
  panelType?: PanelType
  direction?: SplitDirection
  children?: PanelLayoutNode[]
  ratio?: number
  minSize?: number
  title?: string
  closable?: boolean
}

export type PanelType =
  | 'ai-chat'
  | 'file-tree'
  | 'code-editor'
  | 'terminal'
  | 'preview'
  | 'code-detail'

export type SplitDirection = 'horizontal' | 'vertical'

export type DropPosition = 'left' | 'right' | 'top' | 'bottom' | 'center' | 'tab'

export interface PanelLayoutState {
  root: PanelLayoutNode
  activePanel: string | null
  maximizedPanel: string | null
  dragOverTarget: string | null
  dragOverPosition: DropPosition | null
}

export interface PanelDragItem {
  panelId: string
  panelType: PanelType
}

export interface PanelDropResult {
  sourceId: string
  targetId: string
  position: DropPosition
}

export const DEFAULT_PANEL_LAYOUT: PanelLayoutNode = {
  id: 'root',
  type: 'split',
  direction: 'horizontal',
  children: [
    {
      id: 'panel-file-tree',
      type: 'panel',
      panelType: 'file-tree',
      ratio: 25,
      minSize: 120,
      title: '文件管理',
      closable: false,
    },
    {
      id: 'split-right',
      type: 'split',
      direction: 'vertical',
      children: [
        {
          id: 'panel-code-editor',
          type: 'panel',
          panelType: 'code-editor',
          ratio: 70,
          minSize: 120,
          title: '代码编辑器',
          closable: false,
        },
        {
          id: 'panel-terminal',
          type: 'panel',
          panelType: 'terminal',
          ratio: 30,
          minSize: 80,
          title: '终端',
          closable: false,
        },
      ],
    },
  ],
}
