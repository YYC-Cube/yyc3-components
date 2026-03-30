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
  listDirectory(_path: string, _includeHidden?: boolean): FSNode[] {
    return [];
  },
  getTree(_path: string): FSNode[] {
    return [];
  },
  getStats(_path: string): { size: number; modified: string } {
    return { size: 0, modified: '' };
  },
  readFile(_path: string, _encoding?: string): FSReadResult {
    return {
      success: true,
      path: _path,
      content: '',
      encoding: _encoding ?? 'utf8',
      size: 0,
      error: null,
    };
  },
  writeFile(_input: FSWriteInput): FSOperationResult {
    return notImplemented(_input.path);
  },
  create(_input: FSCreateInput): FSOperationResult {
    return notImplemented(`${_input.parentPath}/${_input.name}`);
  },
  rename(_input: FSRenameInput): FSOperationResult {
    return notImplemented(_input.oldPath);
  },
  copy(_input: FSCopyMoveInput): FSOperationResult {
    return notImplemented(_input.sourcePath);
  },
  move(_input: FSCopyMoveInput): FSOperationResult {
    return notImplemented(_input.sourcePath);
  },
  delete(_input: FSDeleteInput): FSOperationResult {
    return notImplemented(_input.path);
  },
  search(_input: FSSearchInput): FSSearchResult {
    return {
      success: true,
      files: [],
      totalMatches: 0,
      duration: 0,
      error: null,
    };
  },
  getDirectoryStats(_path: string): FSDirectoryStats {
    return {
      path: _path,
      fileCount: 0,
      directoryCount: 0,
      totalSize: 0,
      hiddenCount: 0,
      maxDepth: 0,
    };
  },
  upload(_input: FSUploadInput): FSOperationResult {
    return notImplemented(_input.targetPath);
  },
  download(_path: string): FSDownloadResponse {
    return {
      success: false,
      path: _path,
      fileName: '',
      data: '',
      mimeType: 'application/octet-stream',
      size: 0,
      error: 'Not implemented',
    };
  },
  getGitInfo(_path: string): GitRepoInfo {
    return {
      isGitRepo: false,
      rootPath: '',
      currentBranch: '',
      untrackedCount: 0,
      modifiedCount: 0,
      stagedCount: 0,
      remoteUrl: null,
    };
  },
  checkHealth(): { healthy: boolean; message: string } {
    return { healthy: false, message: 'Not implemented' };
  },
};
