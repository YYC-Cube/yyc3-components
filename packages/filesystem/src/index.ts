/**
 * file: index.ts
 * description: @yyc3/filesystem 包主入口文件 · 导出所有文件系统相关类型、Hooks 和工具函数
 * author: YanYuCloudCube Team
 * version: v1.0.0
 * created: 2026-03-26
 * updated: 2026-03-26
 * status: active
 * tags: [filesystem],[files],[browser]
 *
 * copyright: YanYuCloudCube Team
 * license: MIT
 *
 * brief: 提供完整的文件系统管理解决方案
 *
 * details:
 * - 文件浏览（目录、列表、隐藏文件）
 * - 文件操作（读、写、创建、重命名、复制、移动、删除）
 * - 文件搜索（按名称、类型、内容）
 * - Git 仓库信息（状态、分支、提交）
 * - 最近路径记录
 * - 文件夹导航（前进、后退、向上）
 *
 * dependencies: React, File System API
 * exports: useFileSystem, FileSystemService, 所有文件系统相关类型
 * notes: 需要浏览器 File System API 支持
 */

// Hooks
export { useFileSystem } from './hooks/useFileSystem';

// Services
export { fileSystemService } from './services/FileSystemService';

// Types
export type {
  FSNode,
  FSNodeType,
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
  UseFileSystemReturn,
} from './types/filesystem';

// Components
export { default as FileManager } from './components/FileManagerSimple';
