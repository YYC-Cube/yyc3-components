export type { TextOperation } from '../services/crdt-engine';

export interface CRDTDocumentState {
  documentId: string;
  content: string;
  version: number;
  lastModified: number;
  contributors: string[];
}

export interface VersionVector {
  [nodeId: string]: number;
}

export interface ConflictResolution {
  strategy: 'last-writer-wins' | 'merge' | 'custom';
  resolved: boolean;
  winner?: string;
}

export type CRDTNodeType = 'text' | 'map' | 'array' | 'register';

export interface CRDTNode {
  id: string;
  type: CRDTNodeType;
  value: unknown;
  parentId?: string;
  children?: string[];
  lastModified: number;
  modifiedBy: string;
}

export interface CRDTMergeResult {
  success: boolean;
  conflicts: number;
  resolved: number;
  document: CRDTDocumentState;
}
