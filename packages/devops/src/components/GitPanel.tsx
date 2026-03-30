/**
 * Git 面板组件
 * Git Panel Component
 * 
 * Git 仓库管理和操作界面
 * Git repository management and operations interface
 * 
 * @module components/devops/GitPanel
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  GitBranch, 
  GitCommit as GitCommitIcon, 
  GitPullRequest, 
  RefreshCw,
  FolderGit2,
  Upload,
  Download,
  GitMerge,
  History,
  FileText,
  Tag,
  Globe,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { useGit } from '../hooks/useGit';
import type { GitFileChange, GitCommitOptions } from '../types/git';

/**
 * Git 面板组件
 * Git Panel Component
 */
export function GitPanel(): JSX.Element {
  const {
    repository,
    branches,
    currentBranch,
    commits,
    fileChanges,
    stagedFiles,
    unstagedFiles,
    remotes,
    tags,
    metrics,
    statusText,
    isOperating,
    error,
    openRepository,
    refresh,
    commit,
    push,
    pull,
    checkout,
  } = useGit();

  const [activeTab, setActiveTab] = useState<'overview' | 'branches' | 'commits' | 'changes'>('overview');
  const [commitMessage, setCommitMessage] = useState('');
  const [showCommitDialog, setShowCommitDialog] = useState(false);
  const [repoPath, setRepoPath] = useState('');

  /**
   * 处理打开仓库 / Handle open repository
   */
  const handleOpenRepository = async (): Promise<void> => {
    if (!repoPath.trim()) return;
    await openRepository(repoPath);
    setRepoPath('');
  };

  /**
   * 处理提交 / Handle commit
   */
  const handleCommit = async (): Promise<void> => {
    if (!commitMessage.trim()) return;

    const options: GitCommitOptions = {
      message: commitMessage,
    };

    await commit(options);
    setCommitMessage('');
    setShowCommitDialog(false);
  };

  /**
   * 处理分支切换 / Handle branch checkout
   */
  const handleBranchCheckout = async (branchName: string): Promise<void> => {
    await checkout(branchName);
  };

  /**
   * 格式化时间 / Format time
   */
  const formatTime = (date: Date): string => {
    const now = Date.now();
    const diff = now - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'JUST NOW / 刚刚';
    if (minutes < 60) return `${minutes}M AGO / ${minutes}分钟前`;
    if (hours < 24) return `${hours}H AGO / ${hours}小时前`;
    return `${days}D AGO / ${days}天前`;
  };

  /**
   * 获取文件状态颜色 / Get file status color
   */
  const getFileStatusColor = (status: string): string => {
    switch (status) {
      case 'added': return 'text-green-400';
      case 'modified': return 'text-yellow-400';
      case 'deleted': return 'text-red-400';
      case 'renamed': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="flex flex-col h-full bg-black text-green-500 font-mono">
      {/* 头部栏 / Header Bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-green-500/30">
        <div className="flex items-center gap-4">
          <FolderGit2 className="w-6 h-6" />
          <div>
            <h2 className="tracking-wider">GIT MANAGEMENT / GIT 管理</h2>
            {repository && (
              <p className="text-xs text-green-500/70 mt-1">
                {repository.name} • {repository.currentBranch}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* 状态指示器 / Status Indicator */}
          <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 rounded border border-green-500/30">
            {repository?.isClean ? (
              <CheckCircle2 className="w-4 h-4 text-green-400" />
            ) : (
              <AlertCircle className="w-4 h-4 text-yellow-400" />
            )}
            <span className="text-xs tracking-wider">{statusText}</span>
          </div>

          {/* 刷新按钮 / Refresh Button */}
          <button
            onClick={() => refresh()}
            disabled={isOperating}
            className="p-2 hover:bg-green-500/10 rounded transition-colors disabled:opacity-50"
            title="REFRESH / 刷新"
          >
            <RefreshCw className={`w-5 h-5 ${isOperating ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* 错误提示 / Error Message */}
      {error && (
        <div className="mx-6 mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded">
          <p className="text-xs text-red-400 tracking-wider">{error}</p>
        </div>
      )}

      {!repository ? (
        /* 打开仓库界面 / Open Repository Interface */
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md space-y-4">
            <div className="text-center space-y-2">
              <FolderGit2 className="w-16 h-16 mx-auto text-green-500/50" />
              <h3 className="tracking-wider">OPEN GIT REPOSITORY / 打开 GIT 仓库</h3>
              <p className="text-xs text-green-500/70">
                ENTER REPOSITORY PATH TO START / 输入仓库路径开始
              </p>
            </div>

            <div className="space-y-3">
              <input
                type="text"
                value={repoPath}
                onChange={(e) => setRepoPath(e.target.value)}
                placeholder="/path/to/repository"
                className="w-full px-4 py-3 bg-black border border-green-500/30 rounded text-green-500 placeholder-green-500/30 focus:outline-none focus:border-green-500"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleOpenRepository();
                  }
                }}
              />

              <button
                onClick={handleOpenRepository}
                disabled={!repoPath.trim() || isOperating}
                className="w-full px-4 py-3 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 rounded tracking-wider transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isOperating ? 'OPENING... / 打开中...' : 'OPEN REPOSITORY / 打开仓库'}
              </button>
            </div>

            <div className="text-center">
              <p className="text-xs text-green-500/50">
                EXAMPLE: /home/user/projects/yyc3-ai-family
              </p>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* 标签页导航 / Tab Navigation */}
          <div className="flex gap-1 px-6 pt-4 border-b border-green-500/30">
            {[
              { id: 'overview', label: 'OVERVIEW / 概览', icon: TrendingUp },
              { id: 'branches', label: 'BRANCHES / 分支', icon: GitBranch },
              { id: 'commits', label: 'COMMITS / 提交', icon: History },
              { id: 'changes', label: 'CHANGES / 变更', icon: FileText },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-4 py-2 tracking-wider transition-colors ${
                  activeTab === tab.id
                    ? 'text-green-500 border-b-2 border-green-500'
                    : 'text-green-500/50 hover:text-green-400'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="text-xs">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* 主内容区 / Main Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <AnimatePresence mode="wait">
              {/* 概览标签 / Overview Tab */}
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {/* 快速操作 / Quick Actions */}
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => pull()}
                      disabled={isOperating}
                      className="flex flex-col items-center gap-2 p-4 bg-green-500/5 hover:bg-green-500/10 border border-green-500/30 rounded transition-colors disabled:opacity-50"
                    >
                      <Download className="w-6 h-6" />
                      <span className="text-xs tracking-wider">PULL / 拉取</span>
                    </button>

                    <button
                      onClick={() => setShowCommitDialog(true)}
                      disabled={isOperating || stagedFiles.length === 0}
                      className="flex flex-col items-center gap-2 p-4 bg-green-500/5 hover:bg-green-500/10 border border-green-500/30 rounded transition-colors disabled:opacity-50"
                    >
                      <GitCommitIcon className="w-6 h-6" />
                      <span className="text-xs tracking-wider">COMMIT / 提交</span>
                    </button>

                    <button
                      onClick={() => push()}
                      disabled={isOperating}
                      className="flex flex-col items-center gap-2 p-4 bg-green-500/5 hover:bg-green-500/10 border border-green-500/30 rounded transition-colors disabled:opacity-50"
                    >
                      <Upload className="w-6 h-6" />
                      <span className="text-xs tracking-wider">PUSH / 推送</span>
                    </button>
                  </div>

                  {/* 统计卡片 / Stats Cards */}
                  <div className="grid grid-cols-4 gap-3">
                    <div className="p-4 bg-green-500/5 border border-green-500/30 rounded">
                      <div className="flex items-center justify-between mb-2">
                        <GitCommitIcon className="w-5 h-5" />
                        <span className="text-2xl">{metrics.totalCommits}</span>
                      </div>
                      <p className="text-xs text-green-500/70 tracking-wider">COMMITS / 提交</p>
                    </div>

                    <div className="p-4 bg-green-500/5 border border-green-500/30 rounded">
                      <div className="flex items-center justify-between mb-2">
                        <GitBranch className="w-5 h-5" />
                        <span className="text-2xl">{metrics.totalBranches}</span>
                      </div>
                      <p className="text-xs text-green-500/70 tracking-wider">BRANCHES / 分支</p>
                    </div>

                    <div className="p-4 bg-green-500/5 border border-green-500/30 rounded">
                      <div className="flex items-center justify-between mb-2">
                        <Tag className="w-5 h-5" />
                        <span className="text-2xl">{metrics.totalTags}</span>
                      </div>
                      <p className="text-xs text-green-500/70 tracking-wider">TAGS / 标签</p>
                    </div>

                    <div className="p-4 bg-green-500/5 border border-green-500/30 rounded">
                      <div className="flex items-center justify-between mb-2">
                        <Globe className="w-5 h-5" />
                        <span className="text-2xl">{remotes.length}</span>
                      </div>
                      <p className="text-xs text-green-500/70 tracking-wider">REMOTES / 远程</p>
                    </div>
                  </div>

                  {/* 最近提交 / Recent Commits */}
                  <div>
                    <h3 className="tracking-wider mb-3">RECENT COMMITS / 最近提交</h3>
                    <div className="space-y-2">
                      {commits.slice(0, 5).map((commit) => (
                        <div
                          key={commit.hash}
                          className="p-3 bg-green-500/5 border border-green-500/30 rounded hover:bg-green-500/10 transition-colors"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <span className="text-xs font-mono text-yellow-400">{commit.shortHash}</span>
                            <span className="text-xs text-green-500/70">{formatTime(commit.timestamp)}</span>
                          </div>
                          <p className="text-xs mb-1">{commit.message}</p>
                          <p className="text-xs text-green-500/70">{commit.author}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* 分支标签 / Branches Tab */}
              {activeTab === 'branches' && (
                <motion.div
                  key="branches"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-3"
                >
                  {branches.map((branch) => (
                    <div
                      key={branch.name}
                      className={`p-4 border rounded transition-colors ${
                        branch.isCurrent
                          ? 'bg-green-500/10 border-green-500'
                          : 'bg-green-500/5 border-green-500/30 hover:bg-green-500/10'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <GitBranch className="w-5 h-5" />
                          <span className="tracking-wider">{branch.name}</span>
                          {branch.isCurrent && (
                            <span className="px-2 py-0.5 bg-green-500 text-black text-xs tracking-wider rounded">
                              CURRENT / 当前
                            </span>
                          )}
                          {branch.isRemote && (
                            <Globe className="w-4 h-4 text-green-500/70" />
                          )}
                        </div>

                        {!branch.isCurrent && (
                          <button
                            onClick={() => handleBranchCheckout(branch.name)}
                            disabled={isOperating}
                            className="px-3 py-1 text-xs tracking-wider bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 rounded transition-colors disabled:opacity-50"
                          >
                            CHECKOUT / 检出
                          </button>
                        )}
                      </div>

                      {branch.lastCommitMessage && (
                        <div className="text-xs text-green-500/70">
                          <p className="mb-1">{branch.lastCommitMessage}</p>
                          {branch.lastCommitTime && (
                            <p className="flex items-center gap-2">
                              <Clock className="w-3 h-3" />
                              {formatTime(branch.lastCommitTime)}
                            </p>
                          )}
                        </div>
                      )}

                      {(branch.ahead !== undefined || branch.behind !== undefined) && (
                        <div className="mt-2 flex items-center gap-3 text-xs">
                          {branch.ahead !== undefined && branch.ahead > 0 && (
                            <span className="text-green-400">↑ {branch.ahead} AHEAD / 领先</span>
                          )}
                          {branch.behind !== undefined && branch.behind > 0 && (
                            <span className="text-yellow-400">↓ {branch.behind} BEHIND / 落后</span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </motion.div>
              )}

              {/* 提交标签 / Commits Tab */}
              {activeTab === 'commits' && (
                <motion.div
                  key="commits"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-3"
                >
                  {commits.map((commit) => (
                    <div
                      key={commit.hash}
                      className="p-4 bg-green-500/5 border border-green-500/30 rounded hover:bg-green-500/10 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-mono text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded">
                            {commit.shortHash}
                          </span>
                          {commit.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-xs px-2 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/30 rounded"
                            >
                              <Tag className="w-3 h-3 inline mr-1" />
                              {tag}
                            </span>
                          ))}
                        </div>
                        <span className="text-xs text-green-500/70">{formatTime(commit.timestamp)}</span>
                      </div>

                      <p className="text-sm mb-2">{commit.message}</p>

                      <div className="flex items-center justify-between text-xs text-green-500/70">
                        <span>{commit.author} &lt;{commit.authorEmail}&gt;</span>
                        {commit.branches && commit.branches.length > 0 && (
                          <div className="flex items-center gap-2">
                            <GitBranch className="w-3 h-3" />
                            <span>{commit.branches.join(', ')}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}

              {/* 变更标签 / Changes Tab */}
              {activeTab === 'changes' && (
                <motion.div
                  key="changes"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {/* 已暂存文件 / Staged Files */}
                  {stagedFiles.length > 0 && (
                    <div>
                      <h3 className="tracking-wider mb-3 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                        STAGED CHANGES ({stagedFiles.length}) / 已暂存变更
                      </h3>
                      <div className="space-y-2">
                        {stagedFiles.map((file: GitFileChange) => (
                          <div
                            key={file.path}
                            className="p-3 bg-green-500/10 border border-green-500/30 rounded"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-mono">{file.path}</span>
                              <span className={`text-xs tracking-wider ${getFileStatusColor(file.status)}`}>
                                {file.status.toUpperCase()}
                              </span>
                            </div>
                            {(file.linesAdded !== undefined || file.linesDeleted !== undefined) && (
                              <div className="mt-2 text-xs flex items-center gap-3">
                                {file.linesAdded !== undefined && (
                                  <span className="text-green-400">+{file.linesAdded}</span>
                                )}
                                {file.linesDeleted !== undefined && (
                                  <span className="text-red-400">-{file.linesDeleted}</span>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 未暂存文件 / Unstaged Files */}
                  {unstagedFiles.length > 0 && (
                    <div>
                      <h3 className="tracking-wider mb-3 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-yellow-400" />
                        UNSTAGED CHANGES ({unstagedFiles.length}) / 未暂存变更
                      </h3>
                      <div className="space-y-2">
                        {unstagedFiles.map((file: GitFileChange) => (
                          <div
                            key={file.path}
                            className="p-3 bg-green-500/5 border border-green-500/30 rounded hover:bg-green-500/10 transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-mono">{file.path}</span>
                              <span className={`text-xs tracking-wider ${getFileStatusColor(file.status)}`}>
                                {file.status.toUpperCase()}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 无变更 / No Changes */}
                  {fileChanges.length === 0 && (
                    <div className="text-center py-12">
                      <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-green-500/50" />
                      <p className="tracking-wider text-green-500/70">
                        NO CHANGES / 无变更
                      </p>
                      <p className="text-xs text-green-500/50 mt-2">
                        WORKING DIRECTORY CLEAN / 工作目录干净
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </>
      )}

      {/* 提交对话框 / Commit Dialog */}
      {showCommitDialog && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-black border border-green-500 rounded-lg p-6"
          >
            <h3 className="tracking-wider mb-4">COMMIT CHANGES / 提交变更</h3>

            <div className="space-y-4">
              <div>
                <label className="text-xs tracking-wider text-green-500/70 mb-2 block">
                  COMMIT MESSAGE / 提交消息
                </label>
                <textarea
                  value={commitMessage}
                  onChange={(e) => setCommitMessage(e.target.value)}
                  placeholder="Enter commit message..."
                  rows={4}
                  className="w-full px-3 py-2 bg-black border border-green-500/30 rounded text-green-500 placeholder-green-500/30 focus:outline-none focus:border-green-500 resize-none"
                />
              </div>

              <div className="text-xs text-green-500/70">
                <p>STAGED FILES: {stagedFiles.length}</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleCommit}
                  disabled={!commitMessage.trim() || isOperating}
                  className="flex-1 px-4 py-2 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 rounded tracking-wider transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isOperating ? 'COMMITTING... / 提交中...' : 'COMMIT / 提交'}
                </button>

                <button
                  onClick={() => {
                    setShowCommitDialog(false);
                    setCommitMessage('');
                  }}
                  className="px-4 py-2 hover:bg-green-500/10 border border-green-500/30 rounded tracking-wider transition-colors"
                >
                  CANCEL / 取消
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
