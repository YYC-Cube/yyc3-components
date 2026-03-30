/**
 * @file 文件系统 Hook - React 状态桥
 * @description 提供 React 组件层面的文件系统状态管理
 * @module hooks/useFileSystem
 * @version 1.0.0
 *
 * Filesystem Hook - React State Bridge
 * Provides React component-level filesystem state management
 */

import { useState, useEffect, useCallback } from "react";
import { fileSystemService } from "../services/FileSystemService";
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
  GitRepoInfo,
} from "../types/filesystem";

/* ══════════════════════════════════════════════════════════════════
 *  Hook 返回类型 / Hook Return Type
 * ══════════════════════════════════════════════════════════════════ */

/**
 * useFileSystem Hook 返回值 / useFileSystem Hook return value
 */
export interface UseFileSystemReturn {
  /* ── 当前状态 / Current State ── */
  /** 当前路径 / Current path */
  currentPath: string;
  /** 当前目录文件列表 / Current directory files */
  files: FSNode[];
  /** 加载中 / Loading */
  loading: boolean;
  /** 错误信息 / Error message */
  error: string | null;
  /** 最近路径列表 / Recent paths */
  recentPaths: string[];

  /* ── 浏览操作 / Browse Operations ── */
  /** 浏览目录 / Browse directory */
  browseDirectory: (path: string, includeHidden?: boolean) => Promise<void>;
  /** 跳转到父目录 / Go to parent directory */
  goToParent: () => Promise<void>;
  /** 跳转到主目录 / Go to home directory */
  goToHome: () => Promise<void>;
  /** 刷新当前目录 / Refresh current directory */
  refresh: () => Promise<void>;

  /* ── 文件读写 / File Read/Write ── */
  /** 读取文件 / Read file */
  readFile: (path: string) => Promise<FSReadResult>;
  /** 写入文件 / Write file */
  writeFile: (input: FSWriteInput) => Promise<FSOperationResult>;

  /* ── 文件操作 / File Operations ── */
  /** 创建文件或目录 / Create file or directory */
  create: (input: FSCreateInput) => Promise<FSOperationResult>;
  /** 重命名 / Rename */
  rename: (input: FSRenameInput) => Promise<FSOperationResult>;
  /** 复制 / Copy */
  copy: (input: FSCopyMoveInput) => Promise<FSOperationResult>;
  /** 移动 / Move */
  move: (input: FSCopyMoveInput) => Promise<FSOperationResult>;
  /** 删除 / Delete */
  deleteFile: (input: FSDeleteInput) => Promise<FSOperationResult>;

  /* ── 搜索 / Search ── */
  /** 搜索文件 / Search files */
  search: (input: FSSearchInput) => Promise<FSSearchResult>;

  /* ── Git 集成 / Git Integration ── */
  /** 获取 Git 信息 / Get Git info */
  getGitInfo: (path: string) => Promise<GitRepoInfo>;

  /* ── 健康检查 / Health Check ── */
  /** 检查文件系统服务健康 / Check filesystem service health */
  checkHealth: () => Promise<{ healthy: boolean; message: string }>;
}

/* ══════════════════════════════════════════════════════════════════
 *  useFileSystem Hook
 * ══════════════════════════════════════════════════════════════════ */

/**
 * 文件系统管理 Hook / Filesystem management Hook
 * 
 * @returns {UseFileSystemReturn} Hook 返回值 / Hook return value
 * @example
 * ```tsx
 * const { currentPath, files, browseDirectory, createFile } = useFileSystem();
 * 
 * // 浏览目录
 * await browseDirectory("/home/user/projects");
 * 
 * // 创建文件
 * await create({ parentPath: "/home/user", name: "test.txt", type: "file" });
 * ```
 */
export function useFileSystem(): UseFileSystemReturn {
  /* ──────────── 状态定义 / State Definitions ──────────── */

  const [currentPath, setCurrentPath] = useState<string>(
    fileSystemService.getCurrentPath()
  );
  const [files, setFiles] = useState<FSNode[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [recentPaths, setRecentPaths] = useState<string[]>(
    fileSystemService.getRecentPaths()
  );

  /* ──────────── 浏览操作 / Browse Operations ──────────── */

  /**
   * 浏览目录 / Browse directory
   */
  const browseDirectory = useCallback(async (path: string, includeHidden: boolean = false) => {
    setLoading(true);
    setError(null);
    try {
      const nodes = await fileSystemService.browseDirectory(path, includeHidden);
      setFiles(nodes);
      setCurrentPath(path);
      fileSystemService.setCurrentPath(path);
      setRecentPaths(fileSystemService.getRecentPaths());
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "BROWSE_FAILED / 浏览目录失败";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 跳转到父目录 / Go to parent directory
   */
  const goToParent = useCallback(async () => {
    const parentPath = currentPath.split("/").slice(0, -1).join("/") || "/";
    await browseDirectory(parentPath);
  }, [currentPath, browseDirectory]);

  /**
   * 跳转到主目录 / Go to home directory
   */
  const goToHome = useCallback(async () => {
    const homePath = "/home/user"; // 简化实现
    await browseDirectory(homePath);
  }, [browseDirectory]);

  /**
   * 刷新当前目录 / Refresh current directory
   */
  const refresh = useCallback(async () => {
    await browseDirectory(currentPath);
  }, [currentPath, browseDirectory]);

  /* ──────────── 文件读写 / File Read/Write ──────────── */

  /**
   * 读取文件 / Read file
   */
  const readFile = useCallback(async (path: string): Promise<FSReadResult> => {
    setLoading(true);
    setError(null);
    try {
      return await fileSystemService.readFile(path);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "READ_FAILED / 读取文件失败";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 写入文件 / Write file
   */
  const writeFile = useCallback(async (input: FSWriteInput): Promise<FSOperationResult> => {
    setLoading(true);
    setError(null);
    try {
      const result = await fileSystemService.writeFile(input);
      await refresh(); // 刷新当前目录
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "WRITE_FAILED / 写入文件失败";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [refresh]);

  /* ──────────── 文件操作 / File Operations ──────────── */

  /**
   * 创建文件或目录 / Create file or directory
   */
  const create = useCallback(async (input: FSCreateInput): Promise<FSOperationResult> => {
    setLoading(true);
    setError(null);
    try {
      const result = await fileSystemService.create(input);
      await refresh(); // 刷新当前目录
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "CREATE_FAILED / 创建失败";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [refresh]);

  /**
   * 重命名 / Rename
   */
  const rename = useCallback(async (input: FSRenameInput): Promise<FSOperationResult> => {
    setLoading(true);
    setError(null);
    try {
      const result = await fileSystemService.rename(input);
      await refresh();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "RENAME_FAILED / 重命名失败";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [refresh]);

  /**
   * 复制 / Copy
   */
  const copy = useCallback(async (input: FSCopyMoveInput): Promise<FSOperationResult> => {
    setLoading(true);
    setError(null);
    try {
      const result = await fileSystemService.copy(input);
      await refresh();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "COPY_FAILED / 复制失败";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [refresh]);

  /**
   * 移动 / Move
   */
  const move = useCallback(async (input: FSCopyMoveInput): Promise<FSOperationResult> => {
    setLoading(true);
    setError(null);
    try {
      const result = await fileSystemService.move(input);
      await refresh();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "MOVE_FAILED / 移动失败";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [refresh]);

  /**
   * 删除 / Delete
   */
  const deleteFile = useCallback(async (input: FSDeleteInput): Promise<FSOperationResult> => {
    setLoading(true);
    setError(null);
    try {
      const result = await fileSystemService.delete(input);
      await refresh();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "DELETE_FAILED / 删除失败";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [refresh]);

  /* ──────────── 搜索 / Search ──────────── */

  /**
   * 搜索文件 / Search files
   */
  const search = useCallback(async (input: FSSearchInput): Promise<FSSearchResult> => {
    setLoading(true);
    setError(null);
    try {
      return await fileSystemService.search(input);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "SEARCH_FAILED / 搜索失败";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /* ──────────── Git 集成 / Git Integration ──────────── */

  /**
   * 获取 Git 信息 / Get Git info
   */
  const getGitInfo = useCallback(async (path: string): Promise<GitRepoInfo> => {
    try {
      return await fileSystemService.getGitInfo(path);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "GIT_INFO_FAILED / 获取 Git 信息失败";
      setError(errorMessage);
      throw err;
    }
  }, []);

  /* ──────────── 健康检查 / Health Check ──────────── */

  /**
   * 检查文件系统服务健康 / Check filesystem service health
   */
  const checkHealth = useCallback(async (): Promise<{ healthy: boolean; message: string }> => {
    return fileSystemService.checkHealth();
  }, []);

  /* ──────────── 初始化 / Initialization ──────────── */

  useEffect(() => {
    // 初始加载当前目录
    browseDirectory(currentPath);
  }, []); // 仅在挂载时执行一次

  /* ──────────── 返回值 / Return Value ──────────── */

  return {
    // 状态
    currentPath,
    files,
    loading,
    error,
    recentPaths,

    // 浏览操作
    browseDirectory,
    goToParent,
    goToHome,
    refresh,

    // 文件读写
    readFile,
    writeFile,

    // 文件操作
    create,
    rename,
    copy,
    move,
    deleteFile,

    // 搜索
    search,

    // Git 集成
    getGitInfo,

    // 健康检查
    checkHealth,
  };
}
