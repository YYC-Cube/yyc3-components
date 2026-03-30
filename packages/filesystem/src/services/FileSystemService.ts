/**
 * @file 文件系统业务逻辑层 / Filesystem Service
 * @description 封装文件系统业务逻辑、状态管理、事件透传
 * @module services/FileSystemService
 * @version 1.0.0
 * @layer Service (Controller → Service → Repository → Model)
 *
 * 职责 / Responsibilities:
 * - 业务逻辑处理（路径验证、权限检查）
 * - 数据转换和格式化
 * - 操作日志记录
 * - 错误处理和降级
 */

import { fileSystemRepository } from "../repositories/FileSystemRepository";
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
  PathWhitelistConfig,
} from "../types/filesystem";
import { TEXT_FILE_EXTENSIONS, DANGEROUS_FILE_EXTENSIONS, FILE_SIZE_LIMITS } from "../types/filesystem";

/* ══════════════════════════════════════════════════════════════════
 *  常量配置 / Constants Configuration
 * ══════════════════════════════════════════════════════════════════ */

const STORAGE_KEYS = {
  CURRENT_PATH: "yyc3_fs_current_path",
  RECENT_PATHS: "yyc3_fs_recent_paths",
  WHITELIST_CONFIG: "yyc3_fs_whitelist_config",
} as const;

const DEFAULT_WHITELIST_CONFIG: PathWhitelistConfig = {
  allowedPaths: [],
  allowHome: true,
  allowProject: true,
  customPaths: [],
};

/* ══════════════════════════════════════════════════════════════════
 *  工具函数 / Utility Functions
 * ══════════════════════════════════════════════════════════════════ */

/**
 * 规范化路径 / Normalize path
 */
function normalizePath(path: string): string {
  return path.replace(/\\/g, "/").replace(/\/+/g, "/");
}

/**
 * 检查路径是否在白名单内 / Check if path is in whitelist
 */
function isPathAllowed(path: string, config: PathWhitelistConfig): boolean {
  const normalizedPath = normalizePath(path);
  
  // 检查自定义路径
  for (const allowed of config.customPaths) {
    if (normalizedPath.startsWith(normalizePath(allowed))) {
      return true;
    }
  }
  
  // 检查主目录（简化判断）
  if (config.allowHome && normalizedPath.includes("/home/")) {
    return true;
  }
  
  // 检查项目目录（简化判断）
  if (config.allowProject && (normalizedPath.includes("/projects/") || normalizedPath.includes("/workspace/"))) {
    return true;
  }
  
  return false;
}

/**
 * 检查文件扩展名是否为文本文件 / Check if extension is text file
 */
function isTextFile(extension: string): boolean {
  return TEXT_FILE_EXTENSIONS.includes(extension as typeof TEXT_FILE_EXTENSIONS[number]);
}

/**
 * 检查文件扩展名是否危险 / Check if extension is dangerous
 */
function isDangerousFile(extension: string): boolean {
  return DANGEROUS_FILE_EXTENSIONS.includes(extension as typeof DANGEROUS_FILE_EXTENSIONS[number]);
}

/**
 * 格式化文件大小 / Format file size
 */
function formatFileSize(bytes: number): string {
  if (bytes === 0) {return "0 B";}
  const units = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${units[i]}`;
}

/**
 * 获取文件图标类型 / Get file icon type
 */
function getFileIconType(node: FSNode): string {
  if (node.type === "directory") {return "folder";}
  if (node.type === "symlink") {return "link";}
  
  const ext = node.extension.toLowerCase();
  const iconMap: Record<string, string> = {
    ".js": "javascript",
    ".ts": "typescript",
    ".jsx": "react",
    ".tsx": "react",
    ".json": "json",
    ".md": "markdown",
    ".css": "css",
    ".html": "html",
    ".png": "image",
    ".jpg": "image",
    ".jpeg": "image",
    ".gif": "image",
    ".svg": "image",
    ".pdf": "pdf",
    ".zip": "archive",
    ".tar": "archive",
    ".gz": "archive",
  };
  
  return iconMap[ext] || "file";
}

/* ══════════════════════════════════════════════════════════════════
 *  FileSystemService 类 / FileSystemService Class
 * ══════════════════════════════════════════════════════════════════ */

class FileSystemService {
  private whitelistConfig: PathWhitelistConfig;

  constructor() {
    // 从 localStorage 加载白名单配置
    const stored = localStorage.getItem(STORAGE_KEYS.WHITELIST_CONFIG);
    this.whitelistConfig = stored ? JSON.parse(stored) : DEFAULT_WHITELIST_CONFIG;
  }

  /* ──────────── 路径管理 / Path Management ──────────── */

  /**
   * 获取当前路径 / Get current path
   */
  getCurrentPath(): string {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_PATH) || "/home/user";
  }

  /**
   * 设置当前路径 / Set current path
   */
  setCurrentPath(path: string): void {
    localStorage.setItem(STORAGE_KEYS.CURRENT_PATH, path);
    this.addRecentPath(path);
  }

  /**
   * 添加到最近路径 / Add to recent paths
   */
  private addRecentPath(path: string): void {
    const stored = localStorage.getItem(STORAGE_KEYS.RECENT_PATHS);
    const recent: string[] = stored ? JSON.parse(stored) : [];
    
    // 去重并限制最多 10 条
    const updated = [path, ...recent.filter(p => p !== path)].slice(0, 10);
    localStorage.setItem(STORAGE_KEYS.RECENT_PATHS, JSON.stringify(updated));
  }

  /**
   * 获取最近路径 / Get recent paths
   */
  getRecentPaths(): string[] {
    const stored = localStorage.getItem(STORAGE_KEYS.RECENT_PATHS);
    return stored ? JSON.parse(stored) : [];
  }

  /* ──────────── 白名单管理 / Whitelist Management ──────────── */

  /**
   * 获取白名单配置 / Get whitelist config
   */
  getWhitelistConfig(): PathWhitelistConfig {
    return { ...this.whitelistConfig };
  }

  /**
   * 更新白名单配置 / Update whitelist config
   */
  updateWhitelistConfig(config: Partial<PathWhitelistConfig>): void {
    this.whitelistConfig = { ...this.whitelistConfig, ...config };
    localStorage.setItem(STORAGE_KEYS.WHITELIST_CONFIG, JSON.stringify(this.whitelistConfig));
  }

  /**
   * 验证路径权限 / Validate path permission
   */
  validatePath(path: string): { valid: boolean; error: string | null } {
    const normalizedPath = normalizePath(path);
    
    // 检查路径遍历攻击
    if (normalizedPath.includes("..")) {
      return { valid: false, error: "PATH_TRAVERSAL_DETECTED / 检测到路径遍历攻击" };
    }
    
    // 检查白名单
    if (!isPathAllowed(normalizedPath, this.whitelistConfig)) {
      return { valid: false, error: "PATH_NOT_ALLOWED / 路径不在白名单内" };
    }
    
    return { valid: true, error: null };
  }

  /* ──────────── 文件浏览 / File Browsing ──────────── */

  /**
   * 浏览目录 / Browse directory
   */
  async browseDirectory(path: string, includeHidden: boolean = false): Promise<FSNode[]> {
    // 验证路径
    const validation = this.validatePath(path);
    if (!validation.valid) {
      throw new Error(validation.error || "INVALID_PATH / 无效路径");
    }

    try {
      const nodes = await fileSystemRepository.listDirectory(path, includeHidden);
      
      // 增强节点信息
      return nodes.map(node => ({
        ...node,
        // 添加格式化信息（前端显示用）
        formattedSize: formatFileSize(node.size),
        iconType: getFileIconType(node),
      } as FSNode));
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "BROWSE_DIRECTORY_FAILED / 浏览目录失败"
      );
    }
  }

  /**
   * 获取目录树 / Get directory tree
   */
  async getTree(path: string): Promise<FSNode[]> {
    const validation = this.validatePath(path);
    if (!validation.valid) {
      throw new Error(validation.error || "INVALID_PATH / 无效路径");
    }

    return fileSystemRepository.getTree(path);
  }

  /* ──────────── 文件读写 / File Read/Write ──────────── */

  /**
   * 读取文件 / Read file
   */
  async readFile(path: string, encoding: string = "utf8"): Promise<FSReadResult> {
    const validation = this.validatePath(path);
    if (!validation.valid) {
      throw new Error(validation.error || "INVALID_PATH / 无效路径");
    }

    // 检查文件大小限制
    const stats = await fileSystemRepository.getStats(path);
    if (stats.size > FILE_SIZE_LIMITS.MAX_PREVIEW_SIZE) {
      throw new Error("FILE_TOO_LARGE / 文件过大，无法预览");
    }

    return fileSystemRepository.readFile(path, encoding);
  }

  /**
   * 写入文件 / Write file
   */
  async writeFile(input: FSWriteInput): Promise<FSOperationResult> {
    const validation = this.validatePath(input.path);
    if (!validation.valid) {
      throw new Error(validation.error || "INVALID_PATH / 无效路径");
    }

    // 检查文件扩展名
    const extension = input.path.substring(input.path.lastIndexOf("."));
    if (isDangerousFile(extension)) {
      throw new Error("DANGEROUS_FILE_EXTENSION / 危险的文件扩展名");
    }

    return fileSystemRepository.writeFile(input);
  }

  /* ──────────── 文件操作 / File Operations ──────────── */

  /**
   * 创建文件或目录 / Create file or directory
   */
  async create(input: FSCreateInput): Promise<FSOperationResult> {
    const fullPath = `${input.parentPath}/${input.name}`;
    const validation = this.validatePath(fullPath);
    if (!validation.valid) {
      throw new Error(validation.error || "INVALID_PATH / 无效路径");
    }

    return fileSystemRepository.create(input);
  }

  /**
   * 重命名 / Rename
   */
  async rename(input: FSRenameInput): Promise<FSOperationResult> {
    const validation = this.validatePath(input.oldPath);
    if (!validation.valid) {
      throw new Error(validation.error || "INVALID_PATH / 无效路径");
    }

    return fileSystemRepository.rename(input);
  }

  /**
   * 复制 / Copy
   */
  async copy(input: FSCopyMoveInput): Promise<FSOperationResult> {
    const sourceValidation = this.validatePath(input.sourcePath);
    const destValidation = this.validatePath(input.destinationPath);
    
    if (!sourceValidation.valid) {
      throw new Error(sourceValidation.error || "INVALID_SOURCE_PATH / 无效的源路径");
    }
    if (!destValidation.valid) {
      throw new Error(destValidation.error || "INVALID_DESTINATION_PATH / 无效的目标路径");
    }

    return fileSystemRepository.copy(input);
  }

  /**
   * 移动 / Move
   */
  async move(input: FSCopyMoveInput): Promise<FSOperationResult> {
    const sourceValidation = this.validatePath(input.sourcePath);
    const destValidation = this.validatePath(input.destinationPath);
    
    if (!sourceValidation.valid) {
      throw new Error(sourceValidation.error || "INVALID_SOURCE_PATH / 无效的源路径");
    }
    if (!destValidation.valid) {
      throw new Error(destValidation.error || "INVALID_DESTINATION_PATH / ��效的目标路径");
    }

    return fileSystemRepository.move(input);
  }

  /**
   * 删除 / Delete
   */
  async delete(input: FSDeleteInput): Promise<FSOperationResult> {
    const validation = this.validatePath(input.path);
    if (!validation.valid) {
      throw new Error(validation.error || "INVALID_PATH / 无效路径");
    }

    return fileSystemRepository.delete(input);
  }

  /* ──────────── 搜索与统计 / Search & Statistics ──────────── */

  /**
   * 搜索文件 / Search files
   */
  async search(input: FSSearchInput): Promise<FSSearchResult> {
    const validation = this.validatePath(input.rootPath);
    if (!validation.valid) {
      throw new Error(validation.error || "INVALID_PATH / 无效路径");
    }

    return fileSystemRepository.search(input);
  }

  /**
   * 获取目录统计 / Get directory statistics
   */
  async getDirectoryStats(path: string): Promise<FSDirectoryStats> {
    const validation = this.validatePath(path);
    if (!validation.valid) {
      throw new Error(validation.error || "INVALID_PATH / 无效路径");
    }

    return fileSystemRepository.getDirectoryStats(path);
  }

  /* ──────────── 上传下载 / Upload/Download ──────────── */

  /**
   * 上传文件 / Upload file
   */
  async upload(input: FSUploadInput): Promise<FSOperationResult> {
    const validation = this.validatePath(input.targetPath);
    if (!validation.valid) {
      throw new Error(validation.error || "INVALID_PATH / 无效路径");
    }

    // 检查文件大小（Base64 解码后约为原大小的 3/4）
    const estimatedSize = (input.data.length * 3) / 4;
    if (estimatedSize > FILE_SIZE_LIMITS.MAX_UPLOAD_SIZE) {
      throw new Error("FILE_TOO_LARGE / 文件过大，上传失败");
    }

    return fileSystemRepository.upload(input);
  }

  /**
   * 下载文件 / Download file
   */
  async download(path: string): Promise<FSDownloadResponse> {
    const validation = this.validatePath(path);
    if (!validation.valid) {
      throw new Error(validation.error || "INVALID_PATH / 无效路径");
    }

    return fileSystemRepository.download(path);
  }

  /* ──────────── Git 集成 / Git Integration ──────────── */

  /**
   * 获取 Git 信息 / Get Git info
   */
  async getGitInfo(path: string): Promise<GitRepoInfo> {
    const validation = this.validatePath(path);
    if (!validation.valid) {
      throw new Error(validation.error || "INVALID_PATH / 无效路径");
    }

    return fileSystemRepository.getGitInfo(path);
  }

  /* ──────────── 健康检查 / Health Check ──────��───── */

  /**
   * 检查文件系统服务健康 / Check filesystem service health
   */
  async checkHealth(): Promise<{ healthy: boolean; message: string }> {
    return fileSystemRepository.checkHealth();
  }
}

/* ══════════════════════════════════════════════════════════════════
 *  导出单例 / Export Singleton
 * ══════════════════════════════════════════════════════════════════ */

export const fileSystemService = new FileSystemService();
