/**
 * @file 文件系统类型定义 / Filesystem Type Definitions
 * @description 定义文件系统访问与管理所需的全部数据结构
 * @module types/filesystem
 * @version 1.0.0
 * @since DevOps Complete
 *
 * 职责 / Responsibilities:
 * - 文件节点定义（文件/目录/符号链接）
 * - 文件操作结果类型
 * - 文件系统统计信息
 * - Git 状态集成
 */

/* ══════════════════════════════════════════════════════════════════
 *  核心类型 / Core Types
 * ══════════════════════════════════════════════════════════════════ */

/**
 * 文件系统节点类型 / Filesystem node type
 */
export type FSNodeType = "file" | "directory" | "symlink";

/**
 * Git 文件状态 / Git file status
 */
export type GitStatus = "untracked" | "modified" | "added" | "deleted" | "renamed" | "ignored" | "tracked";

/**
 * 文件排序方式 / File sort method
 */
export type FileSortMethod = "name" | "size" | "modified" | "type";

/**
 * 文件排序方向 / File sort direction
 */
export type FileSortDirection = "asc" | "desc";

/* ══════════════════════════════════════════════════════════════════
 *  数据结构 / Data Structures
 * ══════════════════════════════════════════════════════════════════ */

/**
 * 文件系统节点 / Filesystem node
 */
export interface FSNode {
  /** 节点绝对路径 / Absolute path */
  path: string;
  /** 节点名称（不含路径）/ Node name (without path) */
  name: string;
  /** 节点类型 / Node type */
  type: FSNodeType;
  /** 文件大小（字节）/ Size in bytes */
  size: number;
  /** 修改时间（ISO 8601）/ Modified timestamp */
  modifiedAt: string;
  /** 创建时间（ISO 8601）/ Created timestamp */
  createdAt: string;
  /** 权限模式（八进制，如 0o755）/ Permission mode (octal) */
  mode: number;
  /** 是否隐藏文件 / Is hidden file */
  isHidden: boolean;
  /** 文件扩展名（含点，如 .txt）/ File extension (with dot) */
  extension: string;
  /** MIME 类型 / MIME type */
  mimeType: string;
  /** 是否可读 / Is readable */
  isReadable: boolean;
  /** 是否可写 / Is writable */
  isWritable: boolean;
  /** 是否可执行 / Is executable */
  isExecutable: boolean;
  /** 子节点（仅目录有效）/ Children (directories only) */
  children?: FSNode[];
  /** Git 状态（如果在 Git 仓库中）/ Git status (if in git repo) */
  gitStatus?: GitStatus;
  /** 符号链接目标路径 / Symlink target path */
  symlinkTarget?: string;
}

/**
 * 文件系统操作结果 / Filesystem operation result
 */
export interface FSOperationResult {
  /** 操作是否成功 / Success */
  success: boolean;
  /** 错误信息 / Error message */
  error: string | null;
  /** 受影响的路径 / Affected path */
  path: string;
  /** 操作耗时（毫秒）/ Duration in milliseconds */
  duration: number;
  /** 时间戳 / Timestamp */
  timestamp: string;
  /** 详细信息（可选）/ Detail information */
  detail?: string;
}

/**
 * 文件内容读取结果 / File content read result
 */
export interface FSReadResult {
  /** 读取是否成功 / Success */
  success: boolean;
  /** 文件路径 / File path */
  path: string;
  /** 文件内容 / Content */
  content: string;
  /** 文件编码 / Encoding */
  encoding: string;
  /** 文件大小（字节）/ Size in bytes */
  size: number;
  /** 错误信息 / Error message */
  error: string | null;
}

/**
 * 文件写入输入 / File write input
 */
export interface FSWriteInput {
  /** 文件路径 / File path */
  path: string;
  /** 文件内容 / Content */
  content: string;
  /** 文件编码（默认 utf8）/ Encoding (default utf8) */
  encoding?: string;
  /** 是否创建父目录 / Create parent directories */
  createParentDirs?: boolean;
}

/**
 * 文件创建输入 / File create input
 */
export interface FSCreateInput {
  /** 父目录路径 / Parent directory path */
  parentPath: string;
  /** 文件/目录名称 / File/Directory name */
  name: string;
  /** 节点类型 / Node type */
  type: "file" | "directory";
  /** 初始内容（仅文件）/ Initial content (files only) */
  content?: string;
}

/**
 * 文件重命名输入 / File rename input
 */
export interface FSRenameInput {
  /** 原路径 / Old path */
  oldPath: string;
  /** 新名称 / New name */
  newName: string;
}

/**
 * 文件复制/移动输入 / File copy/move input
 */
export interface FSCopyMoveInput {
  /** 源路径 / Source path */
  sourcePath: string;
  /** 目标路径 / Destination path */
  destinationPath: string;
  /** 是否覆盖已存在文件 / Overwrite existing file */
  overwrite?: boolean;
}

/**
 * 文件删除输入 / File delete input
 */
export interface FSDeleteInput {
  /** 文件路径 / File path */
  path: string;
  /** 是否递归删除目录 / Recursive delete directory */
  recursive?: boolean;
  /** 是否强制删除（跳过回收站）/ Force delete (skip trash) */
  force?: boolean;
}

/**
 * 文件搜索输入 / File search input
 */
export interface FSSearchInput {
  /** 搜索根目录 / Root directory */
  rootPath: string;
  /** 搜索关键字 / Search query */
  query: string;
  /** 是否区分大小写 / Case sensitive */
  caseSensitive?: boolean;
  /** 是否包含隐藏文件 / Include hidden files */
  includeHidden?: boolean;
  /** 文件扩展名过滤（如 [".ts", ".tsx"]）/ Extension filter */
  extensions?: string[];
  /** 最大结果数 / Max results */
  maxResults?: number;
}

/**
 * 文件搜索结果 / File search result
 */
export interface FSSearchResult {
  /** 搜索是否成功 / Success */
  success: boolean;
  /** 匹配的文件列表 / Matched files */
  files: FSNode[];
  /** 总匹配数 / Total matches */
  totalMatches: number;
  /** 搜索耗时（毫秒）/ Search duration */
  duration: number;
  /** 错误信息 / Error message */
  error: string | null;
}

/**
 * 目录统计信息 / Directory statistics
 */
export interface FSDirectoryStats {
  /** 目录路径 / Directory path */
  path: string;
  /** 总文件数 / Total files */
  fileCount: number;
  /** 总目录数 / Total directories */
  directoryCount: number;
  /** 总大小（字节）/ Total size in bytes */
  totalSize: number;
  /** 隐藏文件数 / Hidden files count */
  hiddenCount: number;
  /** 最大深度 / Max depth */
  maxDepth: number;
}

/**
 * 文件上传输入 / File upload input
 */
export interface FSUploadInput {
  /** 目标目录 / Target directory */
  targetPath: string;
  /** 文件名 / File name */
  fileName: string;
  /** 文件数据（Base64 编码）/ File data (Base64 encoded) */
  data: string;
  /** 是否覆盖已存在文件 / Overwrite existing */
  overwrite?: boolean;
}

/**
 * 文件下载响应 / File download response
 */
export interface FSDownloadResponse {
  /** 下载是否成功 / Success */
  success: boolean;
  /** 文件路径 / File path */
  path: string;
  /** 文件名 / File name */
  fileName: string;
  /** 文件数据（Base64 编码）/ File data (Base64 encoded) */
  data: string;
  /** MIME 类型 / MIME type */
  mimeType: string;
  /** 文件大小（字节）/ Size in bytes */
  size: number;
  /** 错误信息 / Error message */
  error: string | null;
}

/**
 * Git 仓库信息 / Git repository info
 */
export interface GitRepoInfo {
  /** 是否为 Git 仓库 / Is git repository */
  isGitRepo: boolean;
  /** 仓库根路径 / Repository root path */
  rootPath: string;
  /** 当前分支 / Current branch */
  currentBranch: string;
  /** 未追踪文件数 / Untracked files count */
  untrackedCount: number;
  /** 修改文件数 / Modified files count */
  modifiedCount: number;
  /** 暂存文件数 / Staged files count */
  stagedCount: number;
  /** 远程 URL / Remote URL */
  remoteUrl: string | null;
}

/**
 * 路径白名单配置 / Path whitelist configuration
 */
export interface PathWhitelistConfig {
  /** 允许的根路径列表 / Allowed root paths */
  allowedPaths: string[];
  /** 是否允许访问用户主目录 / Allow user home directory */
  allowHome: boolean;
  /** 是否允许访问项目目录 / Allow project directory */
  allowProject: boolean;
  /** 自定义允许路径 / Custom allowed paths */
  customPaths: string[];
}

/* ══════════════════════════════════════════════════════════════════
 *  API 响应类型 / API Response Types
 * ══════════════════════════════════════════════════════════════════ */

/**
 * 统一 API 响应结构 / Unified API response structure
 */
export interface FSAPIResponse<T> {
  /** 请求是否成功 / Success */
  success: boolean;
  /** 响应数据 / Data */
  data: T | null;
  /** 错误信息 / Error */
  error: string | null;
  /** 执行时间（毫秒）/ Execution time */
  executionTime: number;
  /** 时间戳 / Timestamp */
  timestamp: string;
}

/* ══════════════════════════════════════════════════════════════════
 *  常量定义 / Constants
 * ══════════════════════════════════════════════════════════════════ */

/**
 * 文件大小限制常量 / File size limit constants
 */
export const FILE_SIZE_LIMITS = {
  /** 单文件上传最大值（100MB）/ Max single file upload (100MB) */
  MAX_UPLOAD_SIZE: 100 * 1024 * 1024,
  /** 文本文件预览最大值（5MB）/ Max text file preview (5MB) */
  MAX_PREVIEW_SIZE: 5 * 1024 * 1024,
  /** 内联编辑最大值（1MB）/ Max inline edit (1MB) */
  MAX_INLINE_EDIT_SIZE: 1 * 1024 * 1024,
} as const;

/**
 * 文本文件扩展名白名单 / Text file extension whitelist
 */
export const TEXT_FILE_EXTENSIONS = [
  ".txt", ".md", ".json", ".yaml", ".yml", ".xml", ".html", ".css", ".scss",
  ".js", ".jsx", ".ts", ".tsx", ".vue", ".py", ".java", ".c", ".cpp", ".h",
  ".sh", ".bash", ".zsh", ".fish", ".sql", ".env", ".gitignore", ".dockerfile",
  ".toml", ".ini", ".conf", ".cfg", ".log",
] as const;

/**
 * 危险文件扩展名黑名单 / Dangerous file extension blacklist
 */
export const DANGEROUS_FILE_EXTENSIONS = [
  ".exe", ".dll", ".bat", ".cmd", ".com", ".scr", ".vbs", ".ps1",
] as const;

/**
 * MIME 类型映射 / MIME type mapping
 */
export const MIME_TYPE_MAP: Record<string, string> = {
  ".txt": "text/plain",
  ".md": "text/markdown",
  ".json": "application/json",
  ".js": "application/javascript",
  ".ts": "application/typescript",
  ".html": "text/html",
  ".css": "text/css",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".pdf": "application/pdf",
  ".zip": "application/zip",
  ".tar": "application/x-tar",
  ".gz": "application/gzip",
};

export interface UseFileSystemReturn {
  nodes: FSNode[];
  currentPath: string;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  navigate: (path: string) => void;
  createFile: (input: FSCreateInput) => Promise<FSOperationResult>;
  createDirectory: (input: FSCreateInput) => Promise<FSOperationResult>;
  readFile: (path: string) => Promise<FSReadResult>;
  writeFile: (input: FSWriteInput) => Promise<FSOperationResult>;
  deleteNode: (input: FSDeleteInput) => Promise<FSOperationResult>;
  renameNode: (input: FSRenameInput) => Promise<FSOperationResult>;
  search: (input: FSSearchInput) => Promise<FSSearchResult[]>;
}
