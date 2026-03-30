import type {
  FSNode,
  FSOperationResult,
  FSReadResult,
  FSWriteInput,
  FSCreateInput,
  FSRenameInput,
  FSCopyMoveInput,
  FSDeleteInput,
  FSSearchInput,
  FSSearchResult,
  FSDirectoryStats,
  FSUploadInput,
  FSDownloadResponse,
  GitRepoInfo,
} from '../types/filesystem';

const notImplemented = (path: string): FSOperationResult => ({
  success: false,
  error: 'Not implemented',
  path,
  duration: 0,
  timestamp: new Date().toISOString(),
});

export const fileSystemRepository = {
  async listDirectory(_path: string, _includeHidden?: boolean): Promise<FSNode[]> {
    return [];
  },
  async getTree(_path: string): Promise<FSNode[]> {
    return [];
  },
  async getStats(_path: string): Promise<{ size: number; modified: string }> {
    return { size: 0, modified: '' };
  },
  async readFile(_path: string, _encoding?: string): Promise<FSReadResult> {
    return { success: true, path: _path, content: '', encoding: _encoding || 'utf8', size: 0, error: null };
  },
  async writeFile(_input: FSWriteInput): Promise<FSOperationResult> {
    return notImplemented(_input.path);
  },
  async create(_input: FSCreateInput): Promise<FSOperationResult> {
    return notImplemented(`${_input.parentPath}/${_input.name}`);
  },
  async rename(_input: FSRenameInput): Promise<FSOperationResult> {
    return notImplemented(_input.oldPath);
  },
  async copy(_input: FSCopyMoveInput): Promise<FSOperationResult> {
    return notImplemented(_input.sourcePath);
  },
  async move(_input: FSCopyMoveInput): Promise<FSOperationResult> {
    return notImplemented(_input.sourcePath);
  },
  async delete(_input: FSDeleteInput): Promise<FSOperationResult> {
    return notImplemented(_input.path);
  },
  async search(_input: FSSearchInput): Promise<FSSearchResult> {
    return { success: true, files: [], totalMatches: 0, duration: 0, error: null };
  },
  async getDirectoryStats(_path: string): Promise<FSDirectoryStats> {
    return { path: _path, fileCount: 0, directoryCount: 0, totalSize: 0, hiddenCount: 0, maxDepth: 0 };
  },
  async upload(_input: FSUploadInput): Promise<FSOperationResult> {
    return notImplemented(_input.targetPath);
  },
  async download(_path: string): Promise<FSDownloadResponse> {
    return { success: false, path: _path, fileName: '', data: '', mimeType: 'application/octet-stream', size: 0, error: 'Not implemented' };
  },
  async getGitInfo(_path: string): Promise<GitRepoInfo> {
    return { isGitRepo: false, rootPath: '', currentBranch: '', untrackedCount: 0, modifiedCount: 0, stagedCount: 0, remoteUrl: null };
  },
  async checkHealth(): Promise<{ healthy: boolean; message: string }> {
    return { healthy: false, message: 'Not implemented' };
  },
};
