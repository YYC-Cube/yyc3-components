/**
 * @file Docker 容器管理类型定义 / Docker Container Management Type Definitions
 * @description 定义 Docker 容器、镜像、网络、卷管理相关数据结构
 * @module types/docker
 * @version 0.9.4
 * @since Personalize [Stage3]
 *
 * Docker container management type definitions
 * Defines data structures for Docker containers, images, networks, and volumes
 */

/* ══════════════════════════════════════════════════════════════════
 *  Docker 容器 / Docker Container
 * ══════════════════════════════════════════════════════════════════ */

/**
 * 容器状态 / Container status
 */
export type ContainerStatus =
  | 'created'
  | 'running'
  | 'paused'
  | 'restarting'
  | 'removing'
  | 'exited'
  | 'dead';

/**
 * 容器健康状态 / Container health status
 */
export type ContainerHealthStatus =
  | 'healthy'
  | 'unhealthy'
  | 'starting'
  | 'none';

/**
 * 容器端口映射 / Container port mapping
 */
export interface ContainerPort {
  /** 容器端口 / Container port */
  containerPort: number;
  /** 宿主机端口 / Host port */
  hostPort: number;
  /** 协议 / Protocol */
  protocol: 'tcp' | 'udp';
  /** 宿主机 IP / Host IP */
  hostIp: string;
}

/**
 * 容器挂载点 / Container mount
 */
export interface ContainerMount {
  /** 挂载类型 / Mount type */
  type: 'bind' | 'volume' | 'tmpfs';
  /** 源路径 / Source */
  source: string;
  /** 目标路径 / Destination */
  destination: string;
  /** 读写模式 / Read-write mode */
  mode: 'rw' | 'ro';
}

/**
 * 容器资源使用情况 / Container resource usage
 */
export interface ContainerStats {
  /** CPU 使用率 (0-100) / CPU usage percentage (0-100) */
  cpuPercent: number;
  /** 内存使用 (bytes) / Memory usage (bytes) */
  memoryUsage: number;
  /** 内存限制 (bytes) / Memory limit (bytes) */
  memoryLimit: number;
  /** 内存使用率 (0-100) / Memory percentage (0-100) */
  memoryPercent: number;
  /** 网络接收 (bytes) / Network RX (bytes) */
  networkRx: number;
  /** 网络发送 (bytes) / Network TX (bytes) */
  networkTx: number;
  /** 块设备读 (bytes) / Block I/O read (bytes) */
  blockRead: number;
  /** 块设备写 (bytes) / Block I/O write (bytes) */
  blockWrite: number;
  /** 进程数 / Process count */
  pids: number;
}

/**
 * Docker 容器 / Docker container
 */
export interface DockerContainer {
  /** 容器 ID / Container ID */
  id: string;
  /** 容器名称 / Container name */
  name: string;
  /** 镜像名称 / Image name */
  image: string;
  /** 镜像 ID / Image ID */
  imageId: string;
  /** 容器状态 / Container status */
  status: ContainerStatus;
  /** 健康状态 / Health status */
  health: ContainerHealthStatus;
  /** 端口映射 / Port mappings */
  ports: ContainerPort[];
  /** 挂载点 / Mounts */
  mounts: ContainerMount[];
  /** 网络 / Networks */
  networks: string[];
  /** 环境变量 / Environment variables */
  env: Record<string, string>;
  /** 标签 / Labels */
  labels: Record<string, string>;
  /** 命令 / Command */
  command: string;
  /** 创建时间 / Created timestamp */
  createdAt: string;
  /** 启动时间 / Started timestamp */
  startedAt: string | null;
  /** 资源使用情况 / Resource stats */
  stats: ContainerStats | null;
}

/* ══════════════════════════════════════════════════════════════════
 *  Docker 镜像 / Docker Image
 * ══════════════════════════════════════════════════════════════════ */

/**
 * Docker 镜像 / Docker image
 */
export interface DockerImage {
  /** 镜像 ID / Image ID */
  id: string;
  /** 仓库标签 / Repository tags */
  repoTags: string[];
  /** 仓库摘要 / Repository digests */
  repoDigests: string[];
  /** 大小 (bytes) / Size (bytes) */
  size: number;
  /** 虚拟大小 (bytes) / Virtual size (bytes) */
  virtualSize: number;
  /** 父镜像 ID / Parent image ID */
  parentId: string;
  /** 创建时间 / Created timestamp */
  createdAt: string;
  /** 标签 / Labels */
  labels: Record<string, string>;
  /** 是否悬空 / Is dangling */
  isDangling: boolean;
}

/* ══════════════════════════════════════════════════════════════════
 *  Docker 网络 / Docker Network
 * ══════════════════════════════════════════════════════════════════ */

/**
 * Docker 网络驱动 / Docker network driver
 */
export type DockerNetworkDriver =
  | 'bridge'
  | 'host'
  | 'overlay'
  | 'macvlan'
  | 'none'
  | 'custom';

/**
 * Docker 网络 / Docker network
 */
export interface DockerNetwork {
  /** 网络 ID / Network ID */
  id: string;
  /** 网络名称 / Network name */
  name: string;
  /** 驱动类型 / Driver type */
  driver: DockerNetworkDriver;
  /** 作用域 / Scope */
  scope: 'local' | 'global' | 'swarm';
  /** 子网 / Subnet */
  subnet: string;
  /** 网关 / Gateway */
  gateway: string;
  /** 已连接容器 / Connected containers */
  containers: string[];
  /** 是否为内部网络 / Is internal */
  internal: boolean;
  /** 是否可附加 / Is attachable */
  attachable: boolean;
  /** 创建时间 / Created timestamp */
  createdAt: string;
  /** 标签 / Labels */
  labels: Record<string, string>;
}

/* ══════════════════════════════════════════════════════════════════
 *  Docker 卷 / Docker Volume
 * ══════════════════════════════════════════════════════════════════ */

/**
 * Docker 卷 / Docker volume
 */
export interface DockerVolume {
  /** 卷名称 / Volume name */
  name: string;
  /** 驱动类型 / Driver type */
  driver: string;
  /** 挂载点 / Mount point */
  mountpoint: string;
  /** 作用域 / Scope */
  scope: 'local' | 'global';
  /** 创建时间 / Created timestamp */
  createdAt: string;
  /** 标签 / Labels */
  labels: Record<string, string>;
  /** 选项 / Options */
  options: Record<string, string>;
  /** 是否正在使用 / Is in use */
  inUse: boolean;
}

/* ══════════════════════════════════════════════════════════════════
 *  Docker 日志 / Docker Logs
 * ══════════════════════════════════════════════════════════════════ */

/**
 * Docker 日志条目 / Docker log entry
 */
export interface DockerLogEntry {
  /** 容器 ID / Container ID */
  containerId: string;
  /** 流类型 / Stream type */
  stream: 'stdout' | 'stderr';
  /** 日志内容 / Log content */
  content: string;
  /** 时间戳 / Timestamp */
  timestamp: string;
}

/* ══════════════════════════════════════════════════════════════════
 *  Docker 操作 / Docker Operations
 * ══════════════════════════════════════════════════════════════════ */

/**
 * 容器创建配置 / Container create configuration
 */
export interface ContainerCreateConfig {
  /** 容器名称 / Container name */
  name: string;
  /** 镜像名称 / Image name */
  image: string;
  /** 命令 / Command */
  command: string[];
  /** 环境变量 / Environment variables */
  env: Record<string, string>;
  /** 端口映射 / Port mappings */
  ports: Omit<ContainerPort, 'hostIp'>[];
  /** 卷挂载 / Volume mounts */
  volumes: Omit<ContainerMount, 'mode'>[];
  /** 网络 / Network */
  network: string | null;
  /** 自动重启 / Restart policy */
  restartPolicy: 'no' | 'always' | 'on-failure' | 'unless-stopped';
  /** 标签 / Labels */
  labels: Record<string, string>;
}

/**
 * 容器操作类型 / Container operation type
 */
export type ContainerOperationType =
  | 'start'
  | 'stop'
  | 'restart'
  | 'pause'
  | 'unpause'
  | 'kill'
  | 'remove'
  | 'rename'
  | 'inspect'
  | 'logs'
  | 'exec';

/**
 * 容器操作结果 / Container operation result
 */
export interface ContainerOperationResult {
  /** 操作类型 / Operation type */
  operation: ContainerOperationType;
  /** 容器 ID / Container ID */
  containerId: string;
  /** 是否成功 / Success */
  success: boolean;
  /** 错误信息 / Error message */
  error: string | null;
  /** 操作耗时 (ms) / Operation duration (ms) */
  duration: number;
  /** 时间戳 / Timestamp */
  timestamp: string;
}

/* ══════════════════════════════════════════════════════════════════
 *  Docker 指标 / Docker Metrics
 * ══════════════════════════════════════════════════════════════════ */

/**
 * Docker 指标 / Docker metrics
 */
export interface DockerMetrics {
  /** 总容器数 / Total containers */
  totalContainers: number;
  /** 运行中容器数 / Running containers */
  runningContainers: number;
  /** 已停止容器数 / Stopped containers */
  stoppedContainers: number;
  /** 总镜像数 / Total images */
  totalImages: number;
  /** 悬空镜像数 / Dangling images */
  danglingImages: number;
  /** 总卷数 / Total volumes */
  totalVolumes: number;
  /** 使用中卷数 / Volumes in use */
  volumesInUse: number;
  /** 总网络数 / Total networks */
  totalNetworks: number;
  /** 总 CPU 使用率 (0-100) / Total CPU usage (0-100) */
  totalCpuUsage: number;
  /** 总内存使用 (bytes) / Total memory usage (bytes) */
  totalMemoryUsage: number;
  /** Docker 版本 / Docker version */
  dockerVersion: string;
  /** Docker API 版本 / Docker API version */
  apiVersion: string;
}
