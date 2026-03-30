/**
 * @file Docker 服务层 / Docker Service Layer
 * @description Docker 业务逻辑：容器、镜像、网络、卷管理
 * @module services/DockerService
 * @version 0.9.4
 * @since Personalize [Stage3]
 *
 * Docker business logic: container, image, network, volume management
 */

import { dockerRepository } from '../repositories/DockerRepository';
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

/* ══════════════════════════════════════════════════════════════════
 *  DockerService 类 / DockerService Class
 * ══════════════════════════════════════════════════════════════════ */

/**
 * Docker 服务类 / Docker service class
 *
 * 提供完整的 Docker 管理功能：
 * - 容器生命周期管理
 * - 镜像管理
 * - 网络管理
 * - 卷管理
 * - 指标统计
 */
class DockerService {
  private containers: DockerContainer[] = [];
  private images: DockerImage[] = [];
  private networks: DockerNetwork[] = [];
  private volumes: DockerVolume[] = [];
  private metrics: DockerMetrics | null = null;
  private subscribers: Array<() => void> = [];
  private refreshInterval: number | null = null;

  constructor() {
    this.startAutoRefresh();
  }

  /* ── 订阅机制 / Subscription Mechanism ── */

  /**
   * 订阅状态变更 / Subscribe to state changes
   *
   * 注册状态变更回调，用于 React Hook 同步
   * Register state change callback for React Hook synchronization
   *
   * @param {() => void} callback - 回调函数 / Callback function
   * @returns {() => void} 取消订阅函数 / Unsubscribe function
   */
  subscribe(callback: () => void): () => void {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter((cb) => cb !== callback);
    };
  }

  /**
   * 通知订阅者 / Notify subscribers
   *
   * 触发全部订阅回调
   * Trigger all subscription callbacks
   */
  private notify(): void {
    this.subscribers.forEach((cb) => cb());
  }

  /* ── 自动刷新 / Auto Refresh ── */

  /**
   * 启动自动刷新 / Start auto refresh
   *
   * 每 5 秒自动刷新 Docker 状态
   * Auto refresh Docker state every 5 seconds
   */
  private startAutoRefresh(): void {
    if (this.refreshInterval) return;

    this.refreshAll();

    this.refreshInterval = window.setInterval(() => {
      this.refreshAll();
    }, 5000);
  }

  /**
   * 停止自动刷新 / Stop auto refresh
   *
   * 停止自动刷新定时器
   * Stop auto refresh timer
   */
  stopAutoRefresh(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = null;
    }
  }

  /* ── 数据刷新 / Data Refresh ── */

  /**
   * 刷新全部数据 / Refresh all data
   *
   * 刷新容器、镜像、网络、卷、指标
   * Refresh containers, images, networks, volumes, metrics
   */
  async refreshAll(): Promise<void> {
    try {
      const [containers, images, networks, volumes, metrics] =
        await Promise.all([
          dockerRepository.getContainers(),
          dockerRepository.getImages(),
          dockerRepository.getNetworks(),
          dockerRepository.getVolumes(),
          dockerRepository.getMetrics(),
        ]);

      this.containers = containers;
      this.images = images;
      this.networks = networks;
      this.volumes = volumes;
      this.metrics = metrics;

      this.notify();
    } catch {
      // 静默失败，保持旧数据 / Silent failure, keep old data
    }
  }

  /* ── 容器管理 / Container Management ── */

  /**
   * 获取全部容器 / Get all containers
   *
   * 返回当前全部 Docker 容器
   * Return all current Docker containers
   *
   * @returns {DockerContainer[]} 容器列表 / Container list
   */
  getContainers(): DockerContainer[] {
    return [...this.containers];
  }

  /**
   * 获取指定容器 / Get container by ID
   *
   * 根据 ID 获取容器
   * Get container by ID
   *
   * @param {string} containerId - 容器 ID / Container ID
   * @returns {DockerContainer | null} 容器对象 / Container object
   */
  getContainer(containerId: string): DockerContainer | null {
    return this.containers.find((c) => c.id === containerId) ?? null;
  }

  /**
   * 容器操作 / Container operation
   *
   * 执行容器操作（启动、停止、重启等）
   * Execute container operation (start, stop, restart, etc.)
   *
   * @param {string} containerId - 容器 ID / Container ID
   * @param {ContainerOperationType} operation - 操作类型 / Operation type
   * @returns {Promise<ContainerOperationResult>} 操作结果 / Operation result
   */
  async containerOperation(
    containerId: string,
    operation: ContainerOperationType
  ): Promise<ContainerOperationResult> {
    const result = await dockerRepository.containerOperation(
      containerId,
      operation
    );

    if (result.success) {
      await this.refreshAll();
    }

    return result;
  }

  /**
   * 创建容器 / Create container
   *
   * 创建新的 Docker 容器
   * Create new Docker container
   *
   * @param {ContainerCreateConfig} config - 容器配置 / Container configuration
   * @returns {Promise<string | null>} 容器 ID / Container ID
   */
  async createContainer(config: ContainerCreateConfig): Promise<string | null> {
    const containerId = await dockerRepository.createContainer(config);

    if (containerId) {
      await this.refreshAll();
    }

    return containerId;
  }

  /**
   * 获取容器日志 / Get container logs
   *
   * 获取指定容器的日志
   * Get logs for specified container
   *
   * @param {string} containerId - 容器 ID / Container ID
   * @param {number} [tail=100] - 尾部行数 / Tail lines
   * @returns {Promise<DockerLogEntry[]>} 日志列表 / Log entries
   */
  async getContainerLogs(
    containerId: string,
    tail?: number
  ): Promise<DockerLogEntry[]> {
    return dockerRepository.getContainerLogs(containerId, tail);
  }

  /* ── 镜像管理 / Image Management ── */

  /**
   * 获取全部镜像 / Get all images
   *
   * 返回当前全部 Docker 镜像
   * Return all current Docker images
   *
   * @returns {DockerImage[]} 镜像列表 / Image list
   */
  getImages(): DockerImage[] {
    return [...this.images];
  }

  /**
   * 获取悬空镜像 / Get dangling images
   *
   * 返回未使用的悬空镜像
   * Return unused dangling images
   *
   * @returns {DockerImage[]} 悬空镜像列表 / Dangling images
   */
  getDanglingImages(): DockerImage[] {
    return this.images.filter((img) => img.isDangling);
  }

  /* ── 网络管理 / Network Management ── */

  /**
   * 获取全部网络 / Get all networks
   *
   * 返回当前全部 Docker 网络
   * Return all current Docker networks
   *
   * @returns {DockerNetwork[]} 网络列表 / Network list
   */
  getNetworks(): DockerNetwork[] {
    return [...this.networks];
  }

  /* ── 卷管理 / Volume Management ── */

  /**
   * 获取全部卷 / Get all volumes
   *
   * 返回当前全部 Docker 卷
   * Return all current Docker volumes
   *
   * @returns {DockerVolume[]} 卷列表 / Volume list
   */
  getVolumes(): DockerVolume[] {
    return [...this.volumes];
  }

  /**
   * 获取未使用卷 / Get unused volumes
   *
   * 返回未被容器使用的卷
   * Return volumes not used by containers
   *
   * @returns {DockerVolume[]} 未使用卷列表 / Unused volumes
   */
  getUnusedVolumes(): DockerVolume[] {
    return this.volumes.filter((vol) => !vol.inUse);
  }

  /* ── 指标 / Metrics ── */

  /**
   * 获取 Docker 指标 / Get Docker metrics
   *
   * 获取 Docker 系统指标
   * Get Docker system metrics
   *
   * @returns {DockerMetrics | null} Docker 指标 / Docker metrics
   */
  getMetrics(): DockerMetrics | null {
    return this.metrics ? { ...this.metrics } : null;
  }

  /**
   * 计算资源使用率 / Calculate resource usage
   *
   * 计算全部运行中容器的资源总使用率
   * Calculate total resource usage for all running containers
   *
   * @returns {{ cpu: number; memory: number }} 资源使用率 / Resource usage
   */
  calculateResourceUsage(): { cpu: number; memory: number } {
    const runningContainers = this.containers.filter(
      (c) => c.status === 'running'
    );

    const totalCpu = runningContainers.reduce(
      (sum, c) => sum + (c.stats?.cpuPercent ?? 0),
      0
    );

    const totalMemory = runningContainers.reduce(
      (sum, c) => sum + (c.stats?.memoryUsage ?? 0),
      0
    );

    return {
      cpu: totalCpu,
      memory: totalMemory,
    };
  }

  /* ── 健康检查 / Health Check ── */

  /**
   * 检查 Docker 健康 / Check Docker health
   *
   * 检查 Docker 服务是否可用
   * Check if Docker service is available
   *
   * @returns {Promise<boolean>} 是否健康 / Is healthy
   */
  async checkHealth(): Promise<boolean> {
    try {
      const metrics = await dockerRepository.getMetrics();
      return metrics !== null;
    } catch {
      return false;
    }
  }
}

/**
 * Docker 服务单例 / Docker service singleton
 */
export const dockerService = new DockerService();
