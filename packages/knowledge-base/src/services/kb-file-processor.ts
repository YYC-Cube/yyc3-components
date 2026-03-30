import type {
  FileFormat,
  SourceType,
  ContentModality as KbContentModality,
  ProcessingStatus,
} from './kb-types';

export type DocumentFormat = FileFormat;
export type ContentModality = KbContentModality;

export interface DocumentChunkMetadata {
  title?: string;
  section?: string;
  language?: string;
  format?: FileFormat;
  pageNumber?: number;
  lineRange?: { start: number; end: number };
  createdAt: number;
  updatedAt: number;
}

export interface DocumentChunk {
  id: string;
  content: string;
  source: string;
  startOffset: number;
  endOffset: number;
  metadata: DocumentChunkMetadata;
  sourceType: SourceType;
  chunkIndex: number;
  totalChunks: number;
  entityIds: string[];
  qualityLevel:
    | 'authoritative'
    | 'verified'
    | 'unverified'
    | 'outdated'
    | 'deprecated';
  credibilityScore: number;
  embedding?: number[];
  embeddingModel?: string;
  embeddingUpdatedAt?: number;
}

export function detectFormat(source: string): DocumentFormat {
  const ext = source.split('.').pop()?.toLowerCase() ?? '';
  const formatMap: Record<string, DocumentFormat> = {
    md: 'md',
    txt: 'txt',
    json: 'json',
    csv: 'csv',
    ts: 'ts',
    tsx: 'tsx',
    js: 'js',
    jsx: 'jsx',
    py: 'py',
    pdf: 'pdf',
    png: 'png',
    jpg: 'jpg',
    jpeg: 'jpeg',
    gif: 'gif',
    svg: 'svg',
    mp3: 'mp3',
    wav: 'wav',
    mp4: 'mp4',
    webm: 'webm',
    html: 'html',
    htm: 'html',
    yaml: 'yaml',
    yml: 'yaml',
    toml: 'toml',
    xml: 'xml',
    docx: 'docx',
    doc: 'doc',
    xlsx: 'xlsx',
    xls: 'xls',
    pptx: 'pptx',
  };
  return formatMap[ext] ?? 'unknown';
}

export function detectModality(format: DocumentFormat): ContentModality {
  const modalityMap: Partial<Record<DocumentFormat, ContentModality>> = {
    txt: 'text',
    md: 'text',
    json: 'text',
    csv: 'text',
    ts: 'text',
    tsx: 'text',
    js: 'text',
    jsx: 'text',
    py: 'text',
    yaml: 'text',
    toml: 'text',
    xml: 'text',
    html: 'text',
    pdf: 'text',
    png: 'image',
    jpg: 'image',
    jpeg: 'image',
    gif: 'image',
    svg: 'image',
    mp3: 'audio',
    wav: 'audio',
    mp4: 'video',
    webm: 'video',
  };
  return modalityMap[format] ?? 'text';
}

export function smartChunkDocument(
  content: string,
  source: string,
  format: DocumentFormat,
  chunkSize: number,
  chunkOverlap: number
): DocumentChunk[] {
  if (!content || content.trim().length === 0) return [];

  const chunks: DocumentChunk[] = [];
  const lines = content.split('\n');
  let currentChunk = '';
  let startOffset = 0;
  const now = Date.now();

  for (const line of lines) {
    if (
      currentChunk.length + line.length + 1 > chunkSize &&
      currentChunk.length > 0
    ) {
      const chunkCreatedAt = now;
      chunks.push({
        id: `chunk-${source}-${chunks.length}`,
        content: currentChunk.trim(),
        source,
        startOffset,
        endOffset: startOffset + currentChunk.length,
        metadata: {
          format,
          createdAt: chunkCreatedAt,
          updatedAt: chunkCreatedAt,
        },
        sourceType: 'local_file',
        chunkIndex: chunks.length,
        totalChunks: 0, // Will be updated later
        entityIds: [],
        qualityLevel: 'unverified',
        credibilityScore: 0.5,
      });
      startOffset += currentChunk.length;
      const overlapStart = Math.max(0, currentChunk.length - chunkOverlap);
      currentChunk = currentChunk.substring(overlapStart) + '\n' + line;
    } else {
      currentChunk += (currentChunk ? '\n' : '') + line;
    }
  }

  if (currentChunk.trim()) {
    const chunkCreatedAt = now;
    chunks.push({
      id: `chunk-${source}-${chunks.length}`,
      content: currentChunk.trim(),
      source,
      startOffset,
      endOffset: startOffset + currentChunk.length,
      metadata: {
        format,
        createdAt: chunkCreatedAt,
        updatedAt: chunkCreatedAt,
      },
      sourceType: 'local_file',
      chunkIndex: chunks.length,
      totalChunks: 0, // Will be updated later
      entityIds: [],
      qualityLevel: 'unverified',
      credibilityScore: 0.5,
    });
  }

  // Update totalChunks for all chunks
  const totalChunks = chunks.length;
  for (const chunk of chunks) {
    chunk.totalChunks = totalChunks;
  }

  return chunks;
}

export interface FileProcessingResult {
  fileId: string;
  metadata: {
    id: string;
    filename: string;
    path: string;
    format: DocumentFormat;
    modality: ContentModality;
    sizeBytes: number;
    mimeType: string;
    keywords: string[];
    entities: any[];
    language: string;
    category: any;
    tags: string[];
    createdAt: number;
    modifiedAt: number;
    indexedAt: number;
    accessCount: number;
    version: number;
    contentHash: string;
    processingStatus: ProcessingStatus;
    ocrApplied: boolean;
    transcriptionApplied: boolean;
  };
  extractedText: string;
  chunks: DocumentChunk[];
  entities: any[];
  relations: any[];
  processingTimeMs: number;
}

export class FileProcessor {
  processFile(_filePath: string): FileProcessingResult {
    return {
      fileId: '',
      metadata: {
        id: '',
        filename: '',
        path: '',
        format: 'text' as DocumentFormat,
        modality: 'text' as ContentModality,
        sizeBytes: 0,
        mimeType: 'text/plain',
        keywords: [],
        entities: [],
        language: 'en',
        category: {
          level1: '',
          level2: '',
          level3: '',
          confidence: 0,
          isManualOverride: false,
        },
        tags: [],
        createdAt: Date.now(),
        modifiedAt: Date.now(),
        indexedAt: Date.now(),
        accessCount: 0,
        version: 1,
        contentHash: '',
        processingStatus: 'completed',
        ocrApplied: false,
        transcriptionApplied: false,
      },
      extractedText: '',
      chunks: [],
      entities: [],
      relations: [],
      processingTimeMs: 0,
    };
  }

  batchProcess(_filePaths: string[]): Map<string, FileProcessingResult> {
    return new Map();
  }
}
