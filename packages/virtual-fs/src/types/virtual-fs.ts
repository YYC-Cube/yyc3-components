export type {
  VirtualFile,
  VFSState,
  BundleResult,
  BundleError,
  UseVirtualFileSystemReturn,
} from '../hooks/useVirtualFileSystem';

export type {
  TerminalLine,
  VFSChangeEvent,
  UseTerminalVFSReturn,
} from '../hooks/useTerminalVFS';

export interface VFSNode {
  path: string;
  name: string;
  type: 'file' | 'directory';
  children?: VFSNode[];
  content?: string;
  language?: string;
  lastModified: number;
  size: number;
}

export interface VFSDirectory extends VFSNode {
  type: 'directory';
  children: VFSNode[];
}

export interface VFSFile extends VFSNode {
  type: 'file';
  content: string;
  language: string;
}

export interface VFSOperation {
  type: 'create' | 'read' | 'update' | 'delete' | 'rename' | 'move';
  path: string;
  targetPath?: string;
  content?: string;
  timestamp: number;
}

export type VFSSyncStatus = 'synced' | 'pending' | 'syncing' | 'error';

export type VFSPermission = 'read' | 'write' | 'execute';
