/**
 * Git 服务层
 * Git Service Layer
 * 
 * 负责 Git 业务逻辑处理和状态管理
 * Responsible for Git business logic and state management
 * 
 * @module services/GitService
 */

import { gitRepository } from '../repositories/GitRepository';
import type {
  GitRepository,
  GitBranch,
  GitCommit,
  GitFileChange,
  GitOperationResult,
  GitRemote,
  GitTag,
  GitMetrics,
  GitStatusEvent,
  GitCommitOptions,
  GitPushOptions,
  GitPullOptions,
  GitCheckoutOptions,
  GitMergeOptions,
  GitConfig,
} from '../types/git';

/**
 * 状态变更回调类型 / Status change callback type
 */
type StatusChangeCallback = (event: GitStatusEvent) => void;

/**
 * Git 服务类
 * Git Service Class
 */
class GitServiceClass {
  private currentRepository: GitRepository | null = null;
  private branches: GitBranch[] = [];
  private commits: GitCommit[] = [];
  private fileChanges: GitFileChange[] = [];
  private remotes: GitRemote[] = [];
  private tags: GitTag[] = [];
  private config: GitConfig = {};
  private metrics: GitMetrics = this.initializeMetrics();
  private observers: Set<StatusChangeCallback> = new Set();
  private refreshInterval: ReturnType<typeof setInterval> | null = null;

  /**
   * 初始化指标 / Initialize metrics
   */
  private initializeMetrics(): GitMetrics {
    return {
      totalCommits: 0,
      totalBranches: 0,
      totalTags: 0,
      totalContributors: 0,
      commitsToday: 0,
      commitsThisWeek: 0,
      commitsThisMonth: 0,
      lastUpdated: new Date(),
    };
  }

  /**
   * 获取当前仓库 / Get current repository
   */
  getCurrentRepository(): GitRepository | null {
    return this.currentRepository;
  }

  /**
   * 打开仓库 / Open repository
   */
  async openRepository(path: string): Promise<GitRepository> {
    try {
      const repo = await gitRepository.getRepositoryStatus(path) as any;
      this.currentRepository = repo;
      gitRepository.setCurrentPath(path);

      // 加载仓库数据 / Load repository data
      await this.loadRepositoryData(path);

      this.notifyObservers({
        type: 'repository_changed',
        data: repo,
        timestamp: new Date(),
      });

      return repo;
    } catch (error) {
      this.notifyObservers({
        type: 'error',
        data: { message: 'Failed to open repository', error },
        timestamp: new Date(),
      });
      throw error;
    }
  }

  /**
   * 加载仓库数据 / Load repository data
   */
  private async loadRepositoryData(path: string): Promise<void> {
    try {
      // 并行加载所有数据 / Load all data in parallel
      const [branches, commits, fileChanges, remotes, tags, config] = await Promise.all([
        gitRepository.getBranches(path),
        gitRepository.getCommitHistory(path, 50),
        gitRepository.getFileChanges(path),
        gitRepository.getRemotes(path),
        gitRepository.getTags(path),
        gitRepository.getConfig(path),
      ]);

      this.branches = branches as any;
      this.commits = commits as any;
      this.fileChanges = fileChanges as any;
      this.remotes = remotes as any;
      this.tags = tags as any;
      this.config = config as any;

      // 更新指标 / Update metrics
      this.updateMetrics();
    } catch (error) {
      // 静默失败，使用现有数据 / Silent failure, use existing data
    }
  }

  /**
   * 刷新仓库状态 / Refresh repository status
   */
  async refresh(): Promise<void> {
    const path = gitRepository.getCurrentPath();
    if (!path) {return;}

    try {
      await this.loadRepositoryData(path);
      const repo = await gitRepository.getRepositoryStatus(path) as any;
      this.currentRepository = repo;

      this.notifyObservers({
        type: 'repository_changed',
        data: repo,
        timestamp: new Date(),
      });
    } catch (error) {
      this.notifyObservers({
        type: 'error',
        data: { message: 'Failed to refresh repository', error },
        timestamp: new Date(),
      });
    }
  }

  /**
   * 获取分支列表 / Get branches
   */
  getBranches(): GitBranch[] {
    return this.branches;
  }

  /**
   * 获取当前分支 / Get current branch
   */
  getCurrentBranch(): GitBranch | null {
    return this.branches.find(b => b.isCurrent) || null;
  }

  /**
   * 获取提交历史 / Get commit history
   */
  getCommitHistory(limit?: number): GitCommit[] {
    return limit ? this.commits.slice(0, limit) : this.commits;
  }

  /**
   * 获取文件变更 / Get file changes
   */
  getFileChanges(): GitFileChange[] {
    return this.fileChanges;
  }

  /**
   * 获取已暂存文件 / Get staged files
   */
  getStagedFiles(): GitFileChange[] {
    return this.fileChanges.filter(f => f.isStaged);
  }

  /**
   * 获取未暂存文件 / Get unstaged files
   */
  getUnstagedFiles(): GitFileChange[] {
    return this.fileChanges.filter(f => !f.isStaged);
  }

  /**
   * 获取远程仓库列表 / Get remotes
   */
  getRemotes(): GitRemote[] {
    return this.remotes;
  }

  /**
   * 获取标签列表 / Get tags
   */
  getTags(): GitTag[] {
    return this.tags;
  }

  /**
   * 获取配置 / Get configuration
   */
  getConfig(): GitConfig {
    return this.config;
  }

  /**
   * 获取指标 / Get metrics
   */
  getMetrics(): GitMetrics {
    return this.metrics;
  }

  /**
   * 更新指标 / Update metrics
   */
  private updateMetrics(): void {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    // 统计提交数 / Count commits
    const commitsToday = this.commits.filter(c => c.timestamp >= todayStart).length;
    const commitsThisWeek = this.commits.filter(c => c.timestamp >= weekStart).length;
    const commitsThisMonth = this.commits.filter(c => c.timestamp >= monthStart).length;

    // 统计贡献者 / Count contributors
    const contributors = new Set(this.commits.map(c => c.authorEmail));

    // 查找最活跃分支 / Find most active branch
    const branchCommits = new Map<string, number>();
    this.commits.forEach(commit => {
      commit.branches.forEach(branch => {
        branchCommits.set(branch, (branchCommits.get(branch) || 0) + 1);
      });
    });
    
    let mostActiveBranch: string | undefined;
    let maxCommits = 0;
    branchCommits.forEach((count, branch) => {
      if (count > maxCommits) {
        maxCommits = count;
        mostActiveBranch = branch;
      }
    });

    this.metrics = {
      totalCommits: this.commits.length,
      totalBranches: this.branches.length,
      totalTags: this.tags.length,
      totalContributors: contributors.size,
      commitsToday,
      commitsThisWeek,
      commitsThisMonth,
      lastCommitTime: this.commits[0]?.timestamp,
      mostActiveBranch,
      lastUpdated: now,
    };
  }

  /**
   * 提交更改 / Commit changes
   */
  async commit(options: GitCommitOptions): Promise<GitOperationResult> {
    const path = gitRepository.getCurrentPath();
    if (!path) {
      throw new Error('NO_REPOSITORY / 未打开仓库');
    }

    const startTime = Date.now();
    try {
      const result = await gitRepository.commit(path, options);
      const duration = Date.now() - startTime;
      
      if (result.success) {
        await this.refresh();
        
        this.notifyObservers({
          type: 'operation_completed',
          data: result,
          timestamp: new Date(),
        });
      }

      return {
        operation: 'commit',
        success: result.success,
        output: result.hash ? `Commit ${result.hash}` : '',
        error: result.error,
        timestamp: new Date(),
        duration,
      };
    } catch (error) {
      this.notifyObservers({
        type: 'error',
        data: { message: 'Commit failed', error },
        timestamp: new Date(),
      });
      throw error;
    }
  }

  /**
   * 推送到远程 / Push to remote
   */
  async push(options: GitPushOptions = {}): Promise<GitOperationResult> {
    const path = gitRepository.getCurrentPath();
    if (!path) {
      throw new Error('NO_REPOSITORY / 未打开仓库');
    }

    const startTime = Date.now();
    try {
      const result = await gitRepository.push(path, options);
      const duration = Date.now() - startTime;
      
      if (result.success) {
        await this.refresh();
        
        this.notifyObservers({
          type: 'operation_completed',
          data: result,
          timestamp: new Date(),
        });
      }

      return {
        operation: 'push',
        success: result.success,
        output: 'Push completed',
        error: result.error,
        timestamp: new Date(),
        duration,
      };
    } catch (error) {
      this.notifyObservers({
        type: 'error',
        data: { message: 'Push failed', error },
        timestamp: new Date(),
      });
      throw error;
    }
  }

  /**
   * 从远程拉取 / Pull from remote
   */
  async pull(options: GitPullOptions = {}): Promise<GitOperationResult> {
    const path = gitRepository.getCurrentPath();
    if (!path) {
      throw new Error('NO_REPOSITORY / 未打开仓库');
    }

    const startTime = Date.now();
    try {
      const result = await gitRepository.pull(path, options);
      const duration = Date.now() - startTime;
      
      if (result.success) {
        await this.refresh();
        
        this.notifyObservers({
          type: 'operation_completed',
          data: result,
          timestamp: new Date(),
        });
      }

      return {
        operation: 'pull',
        success: result.success,
        output: 'Pull completed',
        error: result.error,
        timestamp: new Date(),
        duration,
      };
    } catch (error) {
      this.notifyObservers({
        type: 'error',
        data: { message: 'Pull failed', error },
        timestamp: new Date(),
      });
      throw error;
    }
  }

  /**
   * 检出分支 / Checkout branch
   */
  async checkout(options: GitCheckoutOptions): Promise<GitOperationResult> {
    const path = gitRepository.getCurrentPath();
    if (!path) {
      throw new Error('NO_REPOSITORY / 未打开仓库');
    }

    const startTime = Date.now();
    try {
      const result = await gitRepository.checkout(path, options);
      const duration = Date.now() - startTime;
      
      if (result.success) {
        await this.refresh();
        
        this.notifyObservers({
          type: 'branch_changed',
          data: { branch: options.branch },
          timestamp: new Date(),
        });
      }

      return {
        operation: 'checkout',
        success: result.success,
        output: `Checked out ${options.branch}`,
        error: result.error,
        timestamp: new Date(),
        duration,
      };
    } catch (error) {
      this.notifyObservers({
        type: 'error',
        data: { message: 'Checkout failed', error },
        timestamp: new Date(),
      });
      throw error;
    }
  }

  /**
   * 合并分支 / Merge branch
   */
  async merge(options: GitMergeOptions): Promise<GitOperationResult> {
    const path = gitRepository.getCurrentPath();
    if (!path) {
      throw new Error('NO_REPOSITORY / 未打开仓库');
    }

    const startTime = Date.now();
    try {
      const result = await gitRepository.merge(path, { branch: options.sourceBranch, strategy: options.strategy });
      const duration = Date.now() - startTime;
      
      if (result.success) {
        await this.refresh();
        
        this.notifyObservers({
          type: 'operation_completed',
          data: result,
          timestamp: new Date(),
        });
      }

      return {
        operation: 'merge',
        success: result.success,
        output: result.conflicts ? `Merge with conflicts: ${result.conflicts.join(', ')}` : 'Merge completed',
        error: result.error,
        timestamp: new Date(),
        duration,
      };
    } catch (error) {
      this.notifyObservers({
        type: 'error',
        data: { message: 'Merge failed', error },
        timestamp: new Date(),
      });
      throw error;
    }
  }

  /**
   * 获取状态文本 / Get status text
   */
  getStatusText(): string {
    if (!this.currentRepository) {
      return 'NO REPOSITORY / 未打开仓库';
    }

    const repo = this.currentRepository;
    const parts: string[] = [];

    if (repo.isClean) {
      parts.push('CLEAN / 干净');
    } else {
      if (repo.unstagedFiles > 0) {
        parts.push(`${repo.unstagedFiles} UNSTAGED / 未暂存`);
      }
      if (repo.stagedFiles > 0) {
        parts.push(`${repo.stagedFiles} STAGED / 已暂存`);
      }
      if (repo.untrackedFiles > 0) {
        parts.push(`${repo.untrackedFiles} UNTRACKED / 未跟踪`);
      }
    }

    return parts.join(' • ');
  }

  /**
   * 启动自动刷新 / Start auto refresh
   */
  startAutoRefresh(intervalMs: number = 10000): void {
    this.stopAutoRefresh();
    
    this.refreshInterval = setInterval(() => {
      this.refresh();
    }, intervalMs);
  }

  /**
   * 停止自动刷新 / Stop auto refresh
   */
  stopAutoRefresh(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = null;
    }
  }

  /**
   * 订阅状态变更 / Subscribe to status changes
   */
  onStatusChange(callback: StatusChangeCallback): () => void {
    this.observers.add(callback);
    
    // 返回取消订阅函数 / Return unsubscribe function
    return () => {
      this.observers.delete(callback);
    };
  }

  /**
   * 通知观察者 / Notify observers
   */
  private notifyObservers(event: GitStatusEvent): void {
    this.observers.forEach(callback => {
      try {
        callback(event);
      } catch (error) {
        // 静默失败 / Silent failure
      }
    });
  }

  /**
   * 清理资源 / Cleanup resources
   */
  cleanup(): void {
    this.stopAutoRefresh();
    this.observers.clear();
    this.currentRepository = null;
    this.branches = [];
    this.commits = [];
    this.fileChanges = [];
    this.remotes = [];
    this.tags = [];
    this.config = {};
    this.metrics = this.initializeMetrics();
  }
}

/**
 * Git 服务单例 / Git Service singleton
 */
export const gitService = new GitServiceClass();