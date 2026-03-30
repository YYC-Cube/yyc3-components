/**
 * file: index.ts
 * description: @yyc3/docker 包主入口文件 · 导出所有 Docker 相关类型、Hooks 和工具函数
 * author: YanYuCloudCube Team
 * version: v1.0.0
 * created: 2026-03-26
 * updated: 2026-03-26
 * status: active
 * tags: [docker],[containers],[devops]
 *
 * copyright: YanYuCloudCube Team
 * license: MIT
 *
 * brief: 提供完整的 Docker 容器管理解决方案
 *
 * details:
 * - 容器管理（列表、创建、删除、启停、重启、暂停）
 * - 镜像管理（列表、拉取、删除、构建）
 * - 网络管理（列表、创建、删除、连接）
 * - 卷管理（列表、创建、删除、挂载）
 * - 容器日志查看（实时、历史）
 * - Docker 指标统计（CPU、内存、网络、IO）
 *
 * dependencies: React, Docker API
 * exports: useDocker, DockerService, 所有 Docker 相关类型
 * notes: 需要 Docker API 或 Docker 守护进程支持
 */

// Hooks
export { useDocker } from './hooks/useDocker';

// Services
export { dockerService } from './services/DockerService';

// Types
export type {
  DockerContainer,
  DockerContainerState,
  DockerImage,
  DockerNetwork,
  DockerVolume,
  DockerLogEntry,
  DockerMetrics,
  ContainerCreateConfig,
  ContainerUpdateConfig,
  ContainerOperationResult,
  ContainerOperationType,
  UseDockerReturn,
} from './types/docker';

// Components
export { ContainerManager } from './components/ContainerManager';
