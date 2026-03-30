/**
 * file: index.ts
 * description: @yyc3/git 包主入口文件 · 导出所有 Git 版本控制相关类型、Hooks 和工具函数
 * author: YanYuCloudCube Team
 * version: v1.0.0
 * created: 2026-03-26
 * updated: 2026-03-26
 * status: active
 * tags: [git],[version-control],[vcs]
 *
 * copyright: YanYuCloudCube Team
 * license: MIT
 *
 * brief: 提供完整的 Git 版本控制解决方案
 *
 * details:
 * - Git 仓库管理（初始化、克隆、状态）
 * - 分支管理（创建、切换、删除、合并）
 * - 提交管理（提交、推送、拉取）
 * - 日志查看（提交历史、变更对比）
 * - 状态查看（暂存区、工作区）
 *
 * dependencies: React, Git API
 * exports: useGit, GitService, 所有 Git 相关类型
 * notes: 需要 Git 可执行文件或 Git API 支持
 */

// Hooks
export { useGit } from './hooks/useGit';

// Services
export { gitService } from './services/GitService';

// Types
export type {
  GitRepoInfo,
  GitBranch,
  GitCommit,
  GitStatus,
  GitDiff,
  UseGitReturn,
} from './types/git';
