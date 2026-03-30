/**
 * Git 类型定义
 * Git Type Definitions
 *
 * @module types/git
 */

/**
 * Git 仓库信息 / Git repository information
 */
export interface GitRepository {
  /** 仓库路径 / Repository path */
  path: string;
  /** 仓库名称 / Repository name */
  name: string;
  /** 当前分支 / Current branch */
  currentBranch: string;
  /** 远程 URL / Remote URL */
  remoteUrl?: string;
  /** 是否干净（无未提交更改）/ Is clean (no uncommitted changes) */
  isClean: boolean;
  /** 未暂存文件数 / Unstaged files count */
  unstagedFiles: number;
  /** 已暂存文件数 / Staged files count */
  stagedFiles: number;
  /** 未跟踪文件数 / Untracked files count */
  untrackedFiles: number;
  /** 最后更新时间 / Last updated time */
  lastUpdated: Date;
}

/**
 * Git 分支信息 / Git branch information
 */
export interface GitBranch {
  /** 分支名称 / Branch name */
  name: string;
  /** 是否为当前分支 / Is current branch */
  isCurrent: boolean;
  /** 是否为远程分支 / Is remote branch */
  isRemote: boolean;
  /** 最后提交哈希 / Last commit hash */
  lastCommit?: string;
  /** 最后提交消息 / Last commit message */
  lastCommitMessage?: string;
  /** 最后提交时间 / Last commit time */
  lastCommitTime?: Date;
  /** 领先主分支数 / Commits ahead */
  ahead?: number;
  /** 落后主分支数 / Commits behind */
  behind?: number;
}

/**
 * Git 提交信息 / Git commit information
 */
export interface GitCommit {
  /** 提交哈希 / Commit hash */
  hash: string;
  /** 短哈希（前7位）/ Short hash (first 7 chars) */
  shortHash: string;
  /** 提交消息 / Commit message */
  message: string;
  /** 提交者名称 / Author name */
  author: string;
  /** 提交者邮箱 / Author email */
  authorEmail: string;
  /** 提交时间 / Commit time */
  timestamp: Date;
  /** 父提交哈希 / Parent commit hash */
  parentHash?: string;
  /** 关联分支 / Associated branches */
  branches: string[];
  /** 关联标签 / Associated tags */
  tags: string[];
}

/**
 * Git 文件状态 / Git file status
 */
export type GitFileStatus =
  | 'untracked' // 未跟踪 / Untracked
  | 'modified' // 已修改 / Modified
  | 'added' // 新增 / Added
  | 'deleted' // 已删除 / Deleted
  | 'renamed' // 重命名 / Renamed
  | 'copied' // 复制 / Copied
  | 'unmerged'; // 未合并 / Unmerged

/**
 * Git 文件变更 / Git file change
 */
export interface GitFileChange {
  /** 文件路径 / File path */
  path: string;
  /** 文件状态 / File status */
  status: GitFileStatus;
  /** 是否已暂存 / Is staged */
  isStaged: boolean;
  /** 新增行数 / Lines added */
  linesAdded?: number;
  /** 删除行数 / Lines deleted */
  linesDeleted?: number;
  /** 旧路径（重命名时）/ Old path (for rename) */
  oldPath?: string;
}

/**
 * Git 操作类型 / Git operation type
 */
export type GitOperation =
  | 'pull' // 拉取 / Pull
  | 'push' // 推送 / Push
  | 'commit' // 提交 / Commit
  | 'checkout' // 检出 / Checkout
  | 'merge' // 合并 / Merge
  | 'rebase' // 变基 / Rebase
  | 'stash' // 暂存 / Stash
  | 'reset' // 重置 / Reset
  | 'fetch' // 获取 / Fetch
  | 'clone' // 克隆 / Clone
  | 'init' // 初始化 / Init
  | 'status'; // 状态 / Status

/**
 * Git 操作结果 / Git operation result
 */
export interface GitOperationResult {
  /** 操作类型 / Operation type */
  operation: GitOperation;
  /** 是否成功 / Success status */
  success: boolean;
  /** 输出信息 / Output message */
  output: string;
  /** 错误信息 / Error message */
  error?: string;
  /** 操作时间戳 / Operation timestamp */
  timestamp: Date;
  /** 执行耗时（毫秒）/ Duration in milliseconds */
  duration: number;
  /** 受影响的文件 / Affected files */
  affectedFiles?: string[];
}

/**
 * Git 远程仓库 / Git remote repository
 */
export interface GitRemote {
  /** 远程名称 / Remote name */
  name: string;
  /** 远程 URL（fetch）/ Remote URL (fetch) */
  fetchUrl: string;
  /** 远程 URL（push）/ Remote URL (push) */
  pushUrl: string;
  /** 是否为默认远程 / Is default remote */
  isDefault: boolean;
}

/**
 * Git 标签信息 / Git tag information
 */
export interface GitTag {
  /** 标签名称 / Tag name */
  name: string;
  /** 标签类型 / Tag type */
  type: 'lightweight' | 'annotated';
  /** 关联提交哈希 / Associated commit hash */
  commit: string;
  /** 标签消息 / Tag message */
  message?: string;
  /** 创建时间 / Creation time */
  createdAt?: Date;
  /** 创建者 / Tagger */
  tagger?: string;
}

/**
 * Git 差异信息 / Git diff information
 */
export interface GitDiff {
  /** 文件路径 / File path */
  path: string;
  /** 旧内容 / Old content */
  oldContent: string;
  /** 新内容 / New content */
  newContent: string;
  /** 差异行 / Diff lines */
  diffLines: GitDiffLine[];
  /** 新增行数 / Lines added */
  linesAdded: number;
  /** 删除行数 / Lines deleted */
  linesDeleted: number;
}

/**
 * Git 差异行 / Git diff line
 */
export interface GitDiffLine {
  /** 行号（旧文件）/ Line number (old file) */
  oldLineNumber?: number;
  /** 行号（新文件）/ Line number (new file) */
  newLineNumber?: number;
  /** 行内容 / Line content */
  content: string;
  /** 行类型 / Line type */
  type: 'added' | 'deleted' | 'unchanged' | 'header';
}

/**
 * Git 暂存区 / Git stash
 */
export interface GitStash {
  /** 暂存索引 / Stash index */
  index: number;
  /** 暂存消息 / Stash message */
  message: string;
  /** 创建分支 / Created on branch */
  branch: string;
  /** 创建时间 / Creation time */
  createdAt: Date;
}

/**
 * Git 配置项 / Git configuration
 */
export interface GitConfig {
  /** 用户名 / User name */
  userName?: string;
  /** 用户邮箱 / User email */
  userEmail?: string;
  /** 默认编辑器 / Default editor */
  editor?: string;
  /** 自动颜色输出 / Auto color output */
  colorUI?: boolean;
  /** 自动换行 / Auto CRLF */
  autoCRLF?: 'true' | 'false' | 'input';
}

/**
 * Git 指标统计 / Git metrics
 */
export interface GitMetrics {
  /** 总提交数 / Total commits */
  totalCommits: number;
  /** 总分支数 / Total branches */
  totalBranches: number;
  /** 总标签数 / Total tags */
  totalTags: number;
  /** 总贡献者数 / Total contributors */
  totalContributors: number;
  /** 今日提交数 / Commits today */
  commitsToday: number;
  /** 本周提交数 / Commits this week */
  commitsThisWeek: number;
  /** 本月提交数 / Commits this month */
  commitsThisMonth: number;
  /** 最后提交时间 / Last commit time */
  lastCommitTime?: Date;
  /** 最活跃分支 / Most active branch */
  mostActiveBranch?: string;
  /** 最后更新时间 / Last updated */
  lastUpdated: Date;
}

/**
 * Git 状态变更事件 / Git status change event
 */
export interface GitStatusEvent {
  /** 事件类型 / Event type */
  type:
    | 'repository_changed' // 仓库变更 / Repository changed
    | 'branch_changed' // 分支变更 / Branch changed
    | 'files_changed' // 文件变更 / Files changed
    | 'operation_completed' // 操作完成 / Operation completed
    | 'error'; // 错误 / Error
  /** 事件数据 / Event data */
  data: unknown;
  /** 事件时间戳 / Event timestamp */
  timestamp: Date;
}

/**
 * Git 仓库选项 / Git repository options
 */
export interface GitRepositoryOptions {
  /** 仓库路径 / Repository path */
  path: string;
  /** 是否自动获取 / Auto fetch */
  autoFetch?: boolean;
  /** 自动获取间隔（秒）/ Auto fetch interval in seconds */
  autoFetchInterval?: number;
  /** 是否监听文件变更 / Watch file changes */
  watchFiles?: boolean;
}

/**
 * Git 提交选项 / Git commit options
 */
export interface GitCommitOptions {
  /** 提交消息 / Commit message */
  message: string;
  /** 是否修正上次提交 / Amend last commit */
  amend?: boolean;
  /** 是否允许空提交 / Allow empty commit */
  allowEmpty?: boolean;
  /** 提交者（覆盖配置）/ Author override */
  author?: {
    name: string;
    email: string;
  };
}

/**
 * Git 推送选项 / Git push options
 */
export interface GitPushOptions {
  /** 远程名称 / Remote name */
  remote?: string;
  /** 分支名称 / Branch name */
  branch?: string;
  /** 是否强制推送 / Force push */
  force?: boolean;
  /** 是否设置上游 / Set upstream */
  setUpstream?: boolean;
  /** 是否推送标签 / Push tags */
  tags?: boolean;
}

/**
 * Git 拉取选项 / Git pull options
 */
export interface GitPullOptions {
  /** 远程名称 / Remote name */
  remote?: string;
  /** 分支名称 / Branch name */
  branch?: string;
  /** 是否变基 / Rebase */
  rebase?: boolean;
  /** 是否强制 / Force */
  force?: boolean;
}

/**
 * Git 检出选项 / Git checkout options
 */
export interface GitCheckoutOptions {
  /** 分支名称 / Branch name */
  branch: string;
  /** 是否创建新分支 / Create new branch */
  create?: boolean;
  /** 是否强制检出 / Force checkout */
  force?: boolean;
}

/**
 * Git 合并选项 / Git merge options
 */
export interface GitMergeOptions {
  /** 源分支 / Source branch */
  source: string;
  /** 是否快进合并 / Fast forward */
  fastForward?: boolean;
  /** 是否允许无关历史合并 / Allow unrelated histories */
  allowUnrelatedHistories?: boolean;
  /** 合并消息 / Merge message */
  message?: string;
}

export type GitRepoInfo = GitRepository;

export interface GitStatus {
  branch: string;
  ahead: number;
  behind: number;
  staged: GitFileChange[];
  unstaged: GitFileChange[];
  untracked: string[];
  isClean: boolean;
}

export interface UseGitReturn {
  repository: GitRepository | null;
  branches: GitBranch[];
  commits: GitCommit[];
  status: GitStatus | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}
