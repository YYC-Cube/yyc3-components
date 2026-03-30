/**
 * Git Hook
 * Git Hook Layer
 * 
 * React Hook for Git operations
 * 
 * @module hooks/useGit
 */

import { useState, useEffect, useCallback } from 'react';
import { gitService } from '../services/GitService';
import type {
  GitRepository,
  GitBranch,
  GitCommit,
  GitFileChange,
  GitOperationResult,
  GitRemote,
  GitTag,
  GitMetrics,
  GitConfig,
  GitCommitOptions,
  GitPushOptions,
  GitPullOptions,
  GitCheckoutOptions,
  GitMergeOptions,
  GitStatusEvent,
} from '../types/git';

/**
 * useGit Hook 返回类型 / useGit Hook return type
 */
export interface UseGitReturn {
  // 仓库状态 / Repository state
  repository: GitRepository | null;
  branches: GitBranch[];
  currentBranch: GitBranch | null;
  commits: GitCommit[];
  fileChanges: GitFileChange[];
  stagedFiles: GitFileChange[];
  unstagedFiles: GitFileChange[];
  remotes: GitRemote[];
  tags: GitTag[];
  config: GitConfig;
  metrics: GitMetrics;
  statusText: string;

  // 操作状态 / Operation state
  isOperating: boolean;
  lastResult: GitOperationResult | null;
  error: string | null;

  // 仓库操作 / Repository operations
  openRepository: (path: string) => Promise<void>;
  refresh: () => Promise<void>;

  // Git 操作 / Git operations
  commit: (options: GitCommitOptions) => Promise<void>;
  push: (options?: GitPushOptions) => Promise<void>;
  pull: (options?: GitPullOptions) => Promise<void>;
  checkout: (options: GitCheckoutOptions) => Promise<void>;
  merge: (options: GitMergeOptions) => Promise<void>;

  // 自动刷新 / Auto refresh
  startAutoRefresh: (intervalMs?: number) => void;
  stopAutoRefresh: () => void;
}

/**
 * useGit Hook
 * 
 * 用于 Git 操作的 React Hook / React Hook for Git operations
 * 
 * @param autoRefresh - 是否自动刷新 / Auto refresh enabled
 * @param refreshInterval - 刷新间隔（毫秒）/ Refresh interval in milliseconds
 * @returns Git Hook 返回值 / Git Hook return value
 */
export function useGit(
  autoRefresh: boolean = false,
  refreshInterval: number = 10000
): UseGitReturn {
  // 状态管理 / State management
  const [repository, setRepository] = useState<GitRepository | null>(
    gitService.getCurrentRepository()
  );
  const [branches, setBranches] = useState<GitBranch[]>(gitService.getBranches());
  const [currentBranch, setCurrentBranch] = useState<GitBranch | null>(
    gitService.getCurrentBranch()
  );
  const [commits, setCommits] = useState<GitCommit[]>(gitService.getCommitHistory());
  const [fileChanges, setFileChanges] = useState<GitFileChange[]>(
    gitService.getFileChanges()
  );
  const [stagedFiles, setStagedFiles] = useState<GitFileChange[]>(
    gitService.getStagedFiles()
  );
  const [unstagedFiles, setUnstagedFiles] = useState<GitFileChange[]>(
    gitService.getUnstagedFiles()
  );
  const [remotes, setRemotes] = useState<GitRemote[]>(gitService.getRemotes());
  const [tags, setTags] = useState<GitTag[]>(gitService.getTags());
  const [config, setConfig] = useState<GitConfig>(gitService.getConfig());
  const [metrics, setMetrics] = useState<GitMetrics>(gitService.getMetrics());
  const [statusText, setStatusText] = useState<string>(gitService.getStatusText());

  const [isOperating, setIsOperating] = useState(false);
  const [lastResult, setLastResult] = useState<GitOperationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  /**
   * 更新所有状态 / Update all states
   */
  const updateStates = useCallback(() => {
    setRepository(gitService.getCurrentRepository());
    setBranches(gitService.getBranches());
    setCurrentBranch(gitService.getCurrentBranch());
    setCommits(gitService.getCommitHistory());
    setFileChanges(gitService.getFileChanges());
    setStagedFiles(gitService.getStagedFiles());
    setUnstagedFiles(gitService.getUnstagedFiles());
    setRemotes(gitService.getRemotes());
    setTags(gitService.getTags());
    setConfig(gitService.getConfig());
    setMetrics(gitService.getMetrics());
    setStatusText(gitService.getStatusText());
  }, []);

  /**
   * 处理状态变更事件 / Handle status change event
   */
  const handleStatusChange = useCallback((event: GitStatusEvent) => {
    updateStates();

    if (event.type === 'error') {
      const errorData = event.data as { message: string };
      setError(errorData.message);
    } else if (event.type === 'operation_completed') {
      const result = event.data as GitOperationResult;
      setLastResult(result);
      setError(null);
    }
  }, [updateStates]);

  /**
   * 打开仓库 / Open repository
   */
  const openRepository = useCallback(async (path: string) => {
    setIsOperating(true);
    setError(null);

    try {
      await gitService.openRepository(path);
      updateStates();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'OPEN_REPOSITORY_FAILED / 打开仓库失败';
      setError(message);
    } finally {
      setIsOperating(false);
    }
  }, [updateStates]);

  /**
   * 刷新仓库状态 / Refresh repository status
   */
  const refresh = useCallback(async () => {
    setIsOperating(true);
    setError(null);

    try {
      await gitService.refresh();
      updateStates();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'REFRESH_FAILED / 刷新失败';
      setError(message);
    } finally {
      setIsOperating(false);
    }
  }, [updateStates]);

  /**
   * 提交更改 / Commit changes
   */
  const commit = useCallback(async (options: GitCommitOptions) => {
    setIsOperating(true);
    setError(null);

    try {
      const result = await gitService.commit(options);
      setLastResult(result);
      updateStates();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'COMMIT_FAILED / 提交失败';
      setError(message);
    } finally {
      setIsOperating(false);
    }
  }, [updateStates]);

  /**
   * 推送到远程 / Push to remote
   */
  const push = useCallback(async (options: GitPushOptions = {}) => {
    setIsOperating(true);
    setError(null);

    try {
      const result = await gitService.push(options);
      setLastResult(result);
      updateStates();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'PUSH_FAILED / 推送失败';
      setError(message);
    } finally {
      setIsOperating(false);
    }
  }, [updateStates]);

  /**
   * 从远程拉取 / Pull from remote
   */
  const pull = useCallback(async (options: GitPullOptions = {}) => {
    setIsOperating(true);
    setError(null);

    try {
      const result = await gitService.pull(options);
      setLastResult(result);
      updateStates();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'PULL_FAILED / 拉取失败';
      setError(message);
    } finally {
      setIsOperating(false);
    }
  }, [updateStates]);

  /**
   * 检出分支 / Checkout branch
   */
  const checkout = useCallback(async (options: GitCheckoutOptions) => {
    setIsOperating(true);
    setError(null);

    try {
      const result = await gitService.checkout(options);
      setLastResult(result);
      updateStates();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'CHECKOUT_FAILED / 检出失败';
      setError(message);
    } finally {
      setIsOperating(false);
    }
  }, [updateStates]);

  /**
   * 合并分支 / Merge branch
   */
  const merge = useCallback(async (options: GitMergeOptions) => {
    setIsOperating(true);
    setError(null);

    try {
      const result = await gitService.merge(options);
      setLastResult(result);
      updateStates();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'MERGE_FAILED / 合并失败';
      setError(message);
    } finally {
      setIsOperating(false);
    }
  }, [updateStates]);

  /**
   * 启动自动刷新 / Start auto refresh
   */
  const startAutoRefresh = useCallback((intervalMs?: number) => {
    gitService.startAutoRefresh(intervalMs || refreshInterval);
  }, [refreshInterval]);

  /**
   * 停止自动刷新 / Stop auto refresh
   */
  const stopAutoRefresh = useCallback(() => {
    gitService.stopAutoRefresh();
  }, []);

  // 订阅状态变更 / Subscribe to status changes
  useEffect(() => {
    const unsubscribe = gitService.onStatusChange(handleStatusChange);
    return () => unsubscribe();
  }, [handleStatusChange]);

  // 自动刷新管理 / Auto refresh management
  useEffect(() => {
    if (autoRefresh) {
      startAutoRefresh();
    }

    return () => {
      stopAutoRefresh();
    };
  }, [autoRefresh, startAutoRefresh, stopAutoRefresh]);

  // 组件卸载时清理 / Cleanup on unmount
  useEffect(() => {
    return () => {
      gitService.stopAutoRefresh();
    };
  }, []);

  return {
    // 仓库状态 / Repository state
    repository,
    branches,
    currentBranch,
    commits,
    fileChanges,
    stagedFiles,
    unstagedFiles,
    remotes,
    tags,
    config,
    metrics,
    statusText,

    // 操作状态 / Operation state
    isOperating,
    lastResult,
    error,

    // 仓库操作 / Repository operations
    openRepository,
    refresh,

    // Git 操作 / Git operations
    commit,
    push,
    pull,
    checkout,
    merge,

    // 自动刷新 / Auto refresh
    startAutoRefresh,
    stopAutoRefresh,
  };
}
