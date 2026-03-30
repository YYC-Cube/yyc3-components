/**
 * @file Docker Hook / Docker Hook
 * @description Docker React 状态桥，连接 DockerService 和 UI 组件
 * @module hooks/useDocker
 * @version 0.9.4
 * @since Personalize [Stage3]
 *
 * Docker React state bridge, connecting DockerService and UI components
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { dockerService } from '../services/DockerService';
import type {
  DockerContainer,
  DockerImage,
  DockerNetwork,
  DockerVolume,
  DockerLogEntry,
  DockerMetrics,
  ContainerCreateConfig,
  ContainerOperationResult,
  ContainerOperationType,
} from '../types/docker';

/* ──────────────────── Hook 返回类型 / Hook Return Type ──────────────────── */

/**
 * useDocker Hook 返回值 / useDocker Hook return value
 */
export interface UseDockerReturn {
  /* ── 容器管理 / Container Management ── */
  /** 容器列表 / Container list */
  containers: DockerContainer[];
  /** 获取容器 / Get container */
  getContainer: (containerId: string) => DockerContainer | null;
  /** 容器操作 / Container operation */
  containerOperation: (
    containerId: string,
    operation: ContainerOperationType
  ) => Promise<ContainerOperationResult>;
  /** 创建容器 / Create container */
  createContainer: (config: ContainerCreateConfig) => Promise<string | null>;
  /** 获取容器日志 / Get container logs */
  getContainerLogs: (
    containerId: string,
    tail?: number
  ) => Promise<DockerLogEntry[]>;
  /** 是否正在操作 / Is operating */
  isOperating: boolean;
  /** 最后操作结果 / Last operation result */
  lastOperationResult: ContainerOperationResult | null;

  /* ── 镜像管理 / Image Management ── */
  /** 镜像列表 / Image list */
  images: DockerImage[];
  /** 悬空镜像列表 / Dangling images */
  danglingImages: DockerImage[];

  /* ── 网络管理 / Network Management ── */
  /** 网络列表 / Network list */
  networks: DockerNetwork[];

  /* ── 卷管理 / Volume Management ── */
  /** 卷列表 / Volume list */
  volumes: DockerVolume[];
  /** 未使用卷列表 / Unused volumes */
  unusedVolumes: DockerVolume[];

  /* ── 指标 / Metrics ── */
  /** Docker 指标 / Docker metrics */
  metrics: DockerMetrics | null;
  /** 资源使用率 / Resource usage */
  resourceUsage: { cpu: number; memory: number };

  /* ── 健康检查 / Health Check ── */
  /** 是否健康 / Is healthy */
  isHealthy: boolean;
  /** 检查健康 / Check health */
  checkHealth: () => Promise<boolean>;

  /* ── 全局 / Global ── */
  /** 刷新状态 / Refresh state */
  refresh: () => Promise<void>;
  /** 是否正在加载 / Is loading */
  isLoading: boolean;
}

/* ──────────────────── Hook 实现 / Hook Implementation ──────────────────── */

/**
 * Docker Hook / Docker Hook
 *
 * 提供 Docker 完整功能的 React 状态桥：
 * - 容器生命周期管理
 * - 镜像、网络、卷管理
 * - 指标统计
 * - 健康检查
 *
 * @returns {UseDockerReturn} Hook 返回值 / Hook return value
 */
export function useDocker(): UseDockerReturn {
  /* ── 状态 / State ── */
  const [containers, setContainers] = useState<DockerContainer[]>([]);
  const [images, setImages] = useState<DockerImage[]>([]);
  const [networks, setNetworks] = useState<DockerNetwork[]>([]);
  const [volumes, setVolumes] = useState<DockerVolume[]>([]);
  const [metrics, setMetrics] = useState<DockerMetrics | null>(null);
  const [isOperating, setIsOperating] = useState(false);
  const [lastOperationResult, setLastOperationResult] =
    useState<ContainerOperationResult | null>(null);
  const [isHealthy, setIsHealthy] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  /** 防止 stale closure / Prevent stale closure */
  const mountedRef = useRef(true);

  /* ── 状态刷新 / State Refresh ── */
  const refresh = useCallback(async () => {
    if (!mountedRef.current) return;
    setIsLoading(true);
    try {
      await dockerService.refreshAll();
      setContainers(dockerService.getContainers());
      setImages(dockerService.getImages());
      setNetworks(dockerService.getNetworks());
      setVolumes(dockerService.getVolumes());
      setMetrics(dockerService.getMetrics());
      setIsHealthy(true);
    } catch {
      setIsHealthy(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /** 订阅 Service 层状态变更 / Subscribe to Service layer changes */
  useEffect(() => {
    const unsubscribe = dockerService.subscribe(() => {
      if (!mountedRef.current) return;
      setContainers(dockerService.getContainers());
      setImages(dockerService.getImages());
      setNetworks(dockerService.getNetworks());
      setVolumes(dockerService.getVolumes());
      setMetrics(dockerService.getMetrics());
    });

    refresh();

    return () => {
      unsubscribe();
      mountedRef.current = false;
    };
  }, [refresh]);

  /* ── 容器管理 / Container Management ── */

  const getContainer = useCallback((containerId: string) => {
    return dockerService.getContainer(containerId);
  }, []);

  const containerOperation = useCallback(
    async (containerId: string, operation: ContainerOperationType) => {
      setIsOperating(true);
      try {
        const result = await dockerService.containerOperation(
          containerId,
          operation
        );
        setLastOperationResult(result);
        return result;
      } finally {
        setIsOperating(false);
      }
    },
    []
  );

  const createContainer = useCallback(async (config: ContainerCreateConfig) => {
    setIsOperating(true);
    try {
      const containerId = await dockerService.createContainer(config);
      return containerId;
    } finally {
      setIsOperating(false);
    }
  }, []);

  const getContainerLogs = useCallback(
    async (containerId: string, tail?: number) => {
      return dockerService.getContainerLogs(containerId, tail);
    },
    []
  );

  /* ── 镜像管理 / Image Management ── */

  const danglingImages = dockerService.getDanglingImages();

  /* ── 卷管理 / Volume Management ── */

  const unusedVolumes = dockerService.getUnusedVolumes();

  /* ── 资源使用率 / Resource Usage ── */

  const resourceUsage = dockerService.calculateResourceUsage();

  /* ── 健康检查 / Health Check ── */

  const checkHealth = useCallback(async () => {
    const healthy = await dockerService.checkHealth();
    setIsHealthy(healthy);
    return healthy;
  }, []);

  return {
    containers,
    getContainer,
    containerOperation,
    createContainer,
    getContainerLogs,
    isOperating,
    lastOperationResult,

    images,
    danglingImages,

    networks,

    volumes,
    unusedVolumes,

    metrics,
    resourceUsage,

    isHealthy,
    checkHealth,

    refresh,
    isLoading,
  };
}
