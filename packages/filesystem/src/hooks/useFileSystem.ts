/**
 * @file 文件系统 Hook - React 状态桥
 * @description 提供 React 组件层面的文件系统状态管理
 * @module hooks/useFileSystem
 * @version 1.0.0
 *
 * Filesystem Hook - React State Bridge
 * Provides React component-level filesystem state management
 */

import { useState, useEffect, useCallback } from 'react';
import { fileSystemService } from '../services/FileSystemService';
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
} from '../types/filesystem';

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
  browseDirectory: (path: string, includeHidden?: boolean) => void;
  /** 跳转到父目录 / Go to parent directory */
  goToParent: () => void;
  /** 跳转到主目录 / Go to home directory */
  goToHome: () => void;
  /** 刷新当前目录 / Refresh current directory */
  refresh: () => void;

  /* ── 文件读写 / File Read/Write ── */
  /** 读取文件 / Read file */
  readFile: (path: string) => FSReadResult;
  /** 写入文件 / Write file */
  writeFile: (input: FSWriteInput) => FSOperationResult;

  /* ── 文件操作 / File Operations ── */
  /** 创建文件或目录 / Create file or directory */
  create: (input: FSCreateInput) => FSOperationResult;
  /** 重命名 / Rename */
  rename: (input: FSRenameInput) => FSOperationResult;
  /** 复制 / Copy */
  copy: (input: FSCopyMoveInput) => FSOperationResult;
  /** 移动 / Move */
  move: (input: FSCopyMoveInput) => FSOperationResult;
  /** 删除 / Delete */
  deleteFile: (input: FSDeleteInput) => FSOperationResult;

  /* ── 搜索 / Search ── */
  /** 搜索文件 / Search files */
  search: (input: FSSearchInput) => FSSearchResult;

  /* ── Git 集成 / Git Integration ── */
  /** 获取 Git 信息 / Get Git info */
  getGitInfo: (path: string) => GitRepoInfo;

  /* ── 健康检查 / Health Check ── */
  /** 检查文件系统服务健康 / Check filesystem service health */
  checkHealth: () => { healthy: boolean; message: string };
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
 * browseDirectory("/home/user/projects");
 *
 * // 创建文件
 * create({ parentPath: "/home/user", name: "test.txt", type: "file" });
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
  const browseDirectory = useCallback(
    (path: string, includeHidden: boolean = false) => {
      setLoading(true);
      setError(null);
      try {
        const nodes = fileSystemService.browseDirectory(path, includeHidden);
        setFiles(nodes);
        setCurrentPath(path);
        fileSystemService.setCurrentPath(path);
        setRecentPaths(fileSystemService.getRecentPaths());
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'BROWSE_FAILED / 浏览目录失败';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /**
   * 跳转到父目录 / Go to parent directory
   */
  const goToParent = useCallback(() => {
    const parentPath = currentPath.split('/').slice(0, -1).join('/') || '/';
    browseDirectory(parentPath);
  }, [currentPath, browseDirectory]);

  /**
   * 跳转到主目录 / Go to home directory
   */
  const goToHome = useCallback(() => {
    const homePath = '/home/user'; // 简化实现
    browseDirectory(homePath);
  }, [browseDirectory]);

  /**
   * 刷新当前目录 / Refresh current directory
   */
  const refresh = useCallback(() => {
    browseDirectory(currentPath);
  }, [currentPath, browseDirectory]);

  /* ──────────── 文件读写 / File Read/Write ──────────── */

  /**
   * 读取文件 / Read file
   */
  const readFile = useCallback((path: string): FSReadResult => {
    setLoading(true);
    setError(null);
    try {
      return fileSystemService.readFile(path);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'READ_FAILED / 读取文件失败';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 写入文件 / Write file
   */
  const writeFile = useCallback(
    (input: FSWriteInput): FSOperationResult => {
      setLoading(true);
      setError(null);
      try {
        const result = fileSystemService.writeFile(input);
        refresh(); // 刷新当前目录
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'WRITE_FAILED / 写入文件失败';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [refresh]
  );

  /* ──────────── 文件操作 / File Operations ──────────── */

  /**
   * 创建文件或目录 / Create file or directory
   */
  const create = useCallback(
    (input: FSCreateInput): FSOperationResult => {
      setLoading(true);
      setError(null);
      try {
        const result = fileSystemService.create(input);
        refresh(); // 刷新当前目录
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'CREATE_FAILED / 创建失败';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [refresh]
  );

  /**
   * 重命名 / Rename
   */
  const rename = useCallback(
    (input: FSRenameInput): FSOperationResult => {
      setLoading(true);
      setError(null);
      try {
        const result = fileSystemService.rename(input);
        refresh();
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'RENAME_FAILED / 重命名失败';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [refresh]
  );

  /**
   * 复制 / Copy
   */
  const copy = useCallback(
    (input: FSCopyMoveInput): FSOperationResult => {
      setLoading(true);
      setError(null);
      try {
        const result = fileSystemService.copy(input);
        refresh();
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'COPY_FAILED / 复制失败';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [refresh]
  );

  /**
   * 移动 / Move
   */
  const move = useCallback(
    (input: FSCopyMoveInput): FSOperationResult => {
      setLoading(true);
      setError(null);
      try {
        const result = fileSystemService.move(input);
        refresh();
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'MOVE_FAILED / 移动失败';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [refresh]
  );

  /**
   * 删除 / Delete
   */
  const deleteFile = useCallback(
    (input: FSDeleteInput): FSOperationResult => {
      setLoading(true);
      setError(null);
      try {
        const result = fileSystemService.delete(input);
        refresh();
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'DELETE_FAILED / 删除失败';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [refresh]
  );

  /* ──────────── 搜索 / Search ──────────── */

  /**
   * 搜索文件 / Search files
   */
  const search = useCallback((input: FSSearchInput): FSSearchResult => {
    setLoading(true);
    setError(null);
    try {
      return fileSystemService.search(input);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'SEARCH_FAILED / 搜索失败';
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
  const getGitInfo = useCallback((path: string): GitRepoInfo => {
    try {
      return fileSystemService.getGitInfo(path);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'GIT_INFO_FAILED / 获取 Git 信息失败';
      setError(errorMessage);
      throw err;
    }
  }, []);

  /* ──────────── 健康检查 / Health Check ──────────── */

  /**
   * 检查文件系统服务健康 / Check filesystem service health
   */
  const checkHealth = useCallback((): {
    healthy: boolean;
    message: string;
  } => {
    return fileSystemService.checkHealth();
  }, []);

  /* ──────────── 初始化 / Initialization ──────────── */

  useEffect(() => {
    // 初始加载当前目录
    browseDirectory(currentPath);
    // 仅在挂载时执行一次
  }, []);

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
