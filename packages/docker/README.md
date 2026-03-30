# @yyc3/docker

YYC3 Docker 管理库 - 完整的容器、镜像、网络和卷管理功能。

## 📦 概述

`@yyc3/docker` 是一个完整的 Docker 管理解决方案，支持容器、镜像、网络和卷的完整生命周期管理。

## ✨ 特性

- 🐳 **容器管理** - 完整的容器 CRUD 操作和状态控制
- 🖼️ **镜像管理** - 镜像拉取、构建、删除和标签管理
- 🌐 **网络管理** - 自定义网络创建、连接和删除
- 💾 **卷管理** - 数据卷创建、挂载和清理
- 📊 **日志查看** - 实时和历史日志流
- 📈 **指标统计** - CPU、内存、网络、I/O 实时监控

## 🚀 安装

```bash
npm install @yyc3/docker
# 或
yarn add @yyc3/docker
# 或
pnpm add @yyc3/docker
```

## 💡 使用示例

### 容器管理

```tsx
import { useDocker } from '@yyc3/docker';

function DockerDashboard() {
  const {
    containers,
    containerOperation,
    createContainer,
    getContainerLogs,
    metrics
  } = useDocker();

  return (
    <div>
      <h1>Docker Containers</h1>
      {containers.map(container => (
        <div key={container.id}>
          <h2>{container.name}</h2>
          <p>Status: {container.state}</p>
          <button onClick={() => containerOperation(container.id, 'start')}>
            Start
          </button>
          <button onClick={() => containerOperation(container.id, 'stop')}>
            Stop
          </button>
          <button onClick={() => containerOperation(container.id, 'restart')}>
            Restart
          </button>
          <button onClick={() => containerOperation(container.id, 'remove')}>
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}
```

### 创建容器

```tsx
const handleCreate = async () => {
  const containerId = await createContainer({
    name: 'my-container',
    image: 'nginx:latest',
    ports: [
      { host: 8080, container: 80 }
    ],
    volumes: [
      { host: '/host/path', container: '/container/path' }
    ],
    environment: {
      ENV_VAR: 'value'
    }
  });
  
  if (containerId) {
    console.log('Container created:', containerId);
  }
};
```

### 查看日志

```tsx
const handleViewLogs = async (containerId: string) => {
  const logs = await getContainerLogs(containerId, 100);
  logs.forEach(log => {
    console.log(log.timestamp, log.message);
  });
};
```

## 🎯 核心 API

### useDocker Hook

```typescript
interface UseDockerReturn {
  // Containers
  containers: DockerContainer[];
  getContainer: (containerId: string) => DockerContainer | null;
  containerOperation: (containerId: string, operation: ContainerOperationType) => Promise<ContainerOperationResult>;
  createContainer: (config: ContainerCreateConfig) => Promise<string | null>;
  getContainerLogs: (containerId: string, tail?: number) => Promise<DockerLogEntry[]>;
  isOperating: boolean;
  lastOperationResult: ContainerOperationResult | null;

  // Images
  images: DockerImage[];
  pullImage: (imageName: string, tag?: string) => Promise<boolean>;
  removeImage: (imageId: string) => Promise<boolean>;
  
  // Networks
  networks: DockerNetwork[];
  createNetwork: (name: string) => Promise<string | null>;
  removeNetwork: (networkId: string) => Promise<boolean>;
  
  // Volumes
  volumes: DockerVolume[];
  createVolume: (name: string) => Promise<string | null>;
  removeVolume: (volumeId: string) => Promise<boolean>;
  
  // Metrics
  metrics: DockerMetrics;
}
```

## 📚 类型定义

### DockerContainer
```typescript
interface DockerContainer {
  id: string;
  name: string;
  image: string;
  state: DockerContainerState;
  status: string;
  ports: Array<{ host: number; container: number; protocol: string }>;
  created: Date;
  labels: Record<string, string>;
}
```

### DockerMetrics
```typescript
interface DockerMetrics {
  containerCount: number;
  runningCount: number;
  stoppedCount: number;
  totalImages: number;
  totalNetworks: number;
  totalVolumes: number;
  cpuUsage: number;
  memoryUsage: number;
  networkIO: { rx: number; tx: number };
  diskIO: { read: number; write: number };
}
```

## 🎯 最佳实践

### 1. 监控容器状态

```tsx
useEffect(() => {
  // 定期刷新容器列表
  const interval = setInterval(() => {
    // Refresh containers
  }, 5000);
  return () => clearInterval(interval);
}, []);
```

### 2. 批量操作

```tsx
const handleStopAll = async () => {
  const runningContainers = containers.filter(c => c.state === 'running');
  await Promise.all(
    runningContainers.map(c => containerOperation(c.id, 'stop'))
  );
};
```

## 🤝 贡献

欢迎贡献！请查看 [贡献指南](../../CONTRIBUTING.md)。

## 📄 许可证

MIT License - 详见 [LICENSE](../../LICENSE)

---

Made with ❤️ by YanYuCloudCube Team
