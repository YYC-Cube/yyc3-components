export type DocumentFormat = 'markdown' | 'text' | 'json' | 'csv' | 'code' | 'pdf' | 'image' | 'audio' | 'video' | 'html' | 'yaml' | 'toml' | 'xml' | 'unknown';

export type ContentModality = 'text' | 'image' | 'audio' | 'video' | 'mixed';

export function detectFormat(source: string): DocumentFormat {
  const ext = source.split('.').pop()?.toLowerCase() ?? '';
  const formatMap: Record<string, DocumentFormat> = {
    md: 'markdown', txt: 'text', json: 'json', csv: 'csv',
    ts: 'code', tsx: 'code', js: 'code', jsx: 'code', py: 'code',
    pdf: 'pdf', png: 'image', jpg: 'image', jpeg: 'image', gif: 'image', svg: 'image',
    mp3: 'audio', wav: 'audio', mp4: 'video', webm: 'video',
    html: 'html', htm: 'html', yaml: 'yaml', yml: 'yaml', toml: 'toml', xml: 'xml',
  };
  return formatMap[ext] ?? 'unknown';
}

export function detectModality(format: DocumentFormat): ContentModality {
  const modalityMap: Partial<Record<DocumentFormat, ContentModality>> = {
    text: 'text', markdown: 'text', json: 'text', csv: 'text', code: 'text',
    yaml: 'text', toml: 'text', xml: 'text', html: 'text',
    pdf: 'text', image: 'image', audio: 'audio', video: 'video',
  };
  return modalityMap[format] ?? 'text';
}

export interface DocumentChunk {
  id: string;
  content: string;
  source: string;
  startOffset: number;
  endOffset: number;
  metadata: Record<string, unknown>;
}

export function smartChunkDocument(
  content: string,
  source: string,
  format: DocumentFormat,
  chunkSize: number,
  chunkOverlap: number,
): DocumentChunk[] {
  if (!content || content.trim().length === 0) return [];

  const chunks: DocumentChunk[] = [];
  const lines = content.split('\n');
  let currentChunk = '';
  let startOffset = 0;
  let chunkIndex = 0;

  for (const line of lines) {
    if (currentChunk.length + line.length + 1 > chunkSize && currentChunk.length > 0) {
      chunks.push({
        id: `chunk-${source}-${chunkIndex++}`,
        content: currentChunk.trim(),
        source,
        startOffset,
        endOffset: startOffset + currentChunk.length,
        metadata: { format, chunkIndex: chunks.length },
      });
      startOffset += currentChunk.length;
      const overlapStart = Math.max(0, currentChunk.length - chunkOverlap);
      currentChunk = currentChunk.substring(overlapStart) + '\n' + line;
    } else {
      currentChunk += (currentChunk ? '\n' : '') + line;
    }
  }

  if (currentChunk.trim()) {
    chunks.push({
      id: `chunk-${source}-${chunkIndex++}`,
      content: currentChunk.trim(),
      source,
      startOffset,
      endOffset: startOffset + currentChunk.length,
      metadata: { format, chunkIndex: chunks.length },
    });
  }

  return chunks;
}

export class FileProcessor {
  async processFile(_filePath: string): Promise<{ content: string; format: DocumentFormat }> {
    return { content: '', format: 'text' };
  }

  async batchProcess(_filePaths: string[]): Promise<Map<string, { content: string; format: DocumentFormat }>> {
    return new Map();
  }
}
