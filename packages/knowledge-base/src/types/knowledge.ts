export interface KnowledgeDocument {
  id: string;
  title: string;
  content: string;
  source: string;
  format: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  version: number;
  embedding?: number[];
}

export interface KnowledgeEntity {
  id: string;
  name: string;
  type: string;
  properties: Record<string, unknown>;
  documentIds: string[];
}

export interface KnowledgeRelation {
  id: string;
  sourceId: string;
  targetId: string;
  type: string;
  weight: number;
  properties: Record<string, unknown>;
}

export interface KnowledgeQuery {
  text: string;
  topK?: number;
  filters?: Record<string, unknown>;
  includeGraph?: boolean;
}

export interface KnowledgeSearchResult {
  id: string;
  content: string;
  source: string;
  score: number;
  entities: KnowledgeEntity[];
  relations: KnowledgeRelation[];
}

export type SyncStatus = 'idle' | 'syncing' | 'error' | 'completed';

export interface KnowledgeVersion {
  id: string;
  documentId: string;
  version: number;
  content: string;
  createdAt: string;
  author: string;
  changeSummary: string;
}
