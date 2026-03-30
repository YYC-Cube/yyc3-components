/**
 * file: index.ts
 * description: @yyc3/virtual-fs 包主入口文件 · 导出所有虚拟文件系统相关类型、Hooks 和服务
 * author: YanYuCloudCube Team
 * version: v1.0.0
 * created: 2026-03-26
 * updated: 2026-03-26
 * status: active
 * tags: [vfs],[filesystem],[virtual]
 *
 * copyright: YanYuCloudCube Team
 * license: MIT
 *
 * brief: 提供完整的虚拟文件系统解决方案
 *
 * details:
 * - 虚拟文件系统（内存文件系统）
 * - 文件同步（与后端同步）
 * - 终端虚拟文件系统（Terminal VFS）
 * - 文件监控（Watchers）
 * - 路径解析（Path resolution）
 * - 权限管理（Permissions）
 *
 * dependencies: React, File System API
 * exports: useVirtualFileSystem, useTerminalVFS, 所有虚拟文件系统相关类型
 * notes: 完全在内存中运行，无需实际文件系统
 */

// Hooks
export { useVirtualFileSystem } from './hooks/useVirtualFileSystem';
export { useTerminalVFS } from './hooks/useTerminalVFS';

// Types
export type {
  VFSNode,
  VFSDirectory,
  VFSFile,
  VFSOperation,
  VFSSyncStatus,
  VFSPermission,
  UseVirtualFileSystemReturn,
  UseTerminalVFSReturn,
} from './types/virtual-fs';
