# @yyc3/devops

YYC3 DevOps 智能运维库 - MCP 服务器管理、工作流引擎和基础设施监控。

## 📦 概述

`@yyc3/devops` 是一个完整的 DevOps 智能运维解决方案，支持 MCP (Model Context Protocol) 服务器管理、工作流编排和基础设施监控。

## ✨ 特性

- 🤖 **MCP 服务器管理** - 探测、连接、断开和自动连接 MCP 服务器
- ⚙️ **MCP 工具执行** - 远程工具调用和结果返回
- 🔄 **工作流引擎** - 创建、更新、删除和执行工作流
- 📊 **基础设施监控** - 实时监控基础设施服务状态
- 🔍 **诊断系统** - 自动诊断和修复基础设施问题
- 📝 **操作日志** - 完整的操作日志记录和查询
- 📈 **指标统计** - DevOps 指标收集和分析
- 🌐 **WebSocket 监控** - 实时 WebSocket 连接状态监控

## 🚀 安装

```bash
npm install @yyc3/devops
# 或
yarn add @yyc3/devops
# 或
pnpm add @yyc3/devops
```

## 📋 依赖

- React ^18.0.0
- React DOM ^18.0.0

## 💡 使用示例

### 基础用法 - MCP 服务器管理

```tsx
import { useDevOps } from '@yyc3/devops';

function DevOpsDashboard() {
  const {
    servers,
    probeServer,
    probeAllServers,
    disconnectServer,
    executeTool
  } = useDevOps();

  return (
    <div>
      <h1>MCP Servers</h1>
      {servers.map(server => (
        <div key={server.id}>
          <h2>{server.name}</h2>
          <p>Status: {server.status}</p>
          <button onClick={() => probeServer(server.id)}>
            Probe
          </button>
          <button onClick={() => disconnectServer(server.id)}>
            Disconnect
          </button>
        </div>
      ))}
    </div>
  );
}
```

### 工作流管理

```tsx
import { useDevOps } from '@yyc3/devops';

function WorkflowManager() {
  const {
    workflows,
    createWorkflow,
    updateWorkflow,
    deleteWorkflow,
    executeWorkflow
  } = useDevOps();

  const handleCreate = async () => {
    await createWorkflow({
      name: 'CI/CD Pipeline',
      description: 'Continuous integration and deployment',
      steps: [
        { name: 'Build', command: 'npm run build' },
        { name: 'Test', command: 'npm test' },
        { name: 'Deploy', command: 'npm run deploy' }
      ]
    });
  };

  return (
    <div>
      <button onClick={handleCreate}>Create Workflow</button>
      {workflows.map(workflow => (
        <div key={workflow.id}>
          <h3>{workflow.name}</h3>
          <button onClick={() => executeWorkflow(workflow.id)}>
            Execute
          </button>
        </div>
      ))}
    </div>
  );
}
```

### 基础设施监控

```tsx
import { useDevOps } from '@yyc3/devops';

function InfrastructureMonitor() {
  const {
    services,
    issues,
    metrics,
    runDiagnostics
  } = useDevOps();

  return (
    <div>
      <h2>Infrastructure Services</h2>
      {services.map(service => (
        <div key={service.id}>
          <h3>{service.name}</h3>
          <p>Status: {service.status}</p>
          <p>Health: {service.health}%</p>
        </div>
      ))}

      <h2>Diagnostic Issues</h2>
      {issues.map(issue => (
        <div key={issue.id}>
          <h3>{issue.title}</h3>
          <p>Severity: {issue.severity}</p>
          <p>Status: {issue.status}</p>
        </div>
      ))}

      <button onClick={runDiagnostics}>Run Diagnostics</button>
    </div>
  );
}
```

### 操作日志

```tsx
import { useDevOps } from '@yyc3/devops';

function OpsLogs() {
  const {
    logs,
    exportLogs,
    clearLogs
  } = useDevOps();

  return (
    <div>
      <h2>Operations Logs</h2>
      {logs.map(log => (
        <div key={log.id}>
          <p>{log.timestamp} - {log.level}: {log.message}</p>
        </div>
      ))}
      <button onClick={exportLogs}>Export Logs</button>
      <button onClick={clearLogs}>Clear Logs</button>
    </div>
  );
}
```

## 🎯 核心 API

### useDevOps Hook

```typescript
interface UseDevOpsReturn {
  // MCP Servers
  servers: MCPServer[];
  probeServer: (serverId: string) => Promise<boolean>;
  probeAllServers: () => Promise<number>;
  disconnectServer: (serverId: string) => void;
  toggleAutoConnect: (serverId: string) => void;
  executeTool: (serverId: string, toolId: string, params?: Record<string, any>) => Promise<MCPToolResult>;
  lastToolResult: MCPToolResult | null;
  isToolExecuting: boolean;

  // Workflows
  workflows: Workflow[];
  createWorkflow: (input: WorkflowCreateInput) => Promise<string>;
  updateWorkflow: (id: string, input: WorkflowUpdateInput) => Promise<boolean>;
  deleteWorkflow: (id: string) => Promise<boolean>;
  executeWorkflow: (id: string, params?: Record<string, any>) => Promise<WorkflowExecutionResult>;

  // Infrastructure
  services: InfraService[];
  issues: DiagnosticIssue[];
  runDiagnostics: () => Promise<void>;

  // Logs
  logs: OpsLogEntry[];
  exportLogs: () => Promise<string>;
  clearLogs: () => void;

  // Metrics
  metrics: DevOpsMetrics;
}
```

## 🎨 组件

### DevOpsHub
DevOps 智能运维中心主组件

### GitPanel
Git 版本控制面板

### SystemMonitor
系统监控面板

### WebSocketStatus
WebSocket 连接状态显示

## 🎯 最佳实践

### 1. 自动探测 MCP 服务器

```tsx
useEffect(() => {
  // 在组件挂载时自动探测所有服务器
  probeAllServers();
}, []);
```

### 2. 监控连接状态

```tsx
useEffect(() => {
  // 监控服务器连接状态变化
  if (lastToolResult) {
    console.log('Tool executed:', lastToolResult);
  }
}, [lastToolResult]);
```

### 3. 错误处理

```tsx
const handleExecute = async () => {
  try {
    const result = await executeTool(serverId, toolId, params);
    if (result.success) {
      toast.success('Tool executed successfully');
    } else {
      toast.error('Tool execution failed');
    }
  } catch (error) {
    toast.error('Error executing tool');
  }
};
```

## 📚 类型定义

### MCPServer
```typescript
interface MCPServer {
  id: string;
  name: string;
  url: string;
  status: 'connected' | 'disconnected' | 'connecting' | 'error';
  autoConnect: boolean;
  lastConnected?: Date;
  tools: MCPTool[];
}
```

### Workflow
```typescript
interface Workflow {
  id: string;
  name: string;
  description?: string;
  steps: WorkflowStep[];
  status: 'idle' | 'running' | 'completed' | 'failed';
  createdAt: Date;
  updatedAt: Date;
}
```

### InfraService
```typescript
interface InfraService {
  id: string;
  name: string;
  type: 'database' | 'cache' | 'queue' | 'storage' | 'api';
  status: 'running' | 'stopped' | 'error' | 'unknown';
  health: number;
  metadata?: Record<string, any>;
}
```

## 🤝 贡献

欢迎贡献！请查看 [贡献指南](../../CONTRIBUTING.md)。

## 📄 许可证

MIT License - 详见 [LICENSE](../../LICENSE)

## 🔗 相关链接

- [YYC3 主页](https://github.com/YYC-Cube/yyc3-reusable-components)
- [MCP Protocol](https://modelcontextprotocol.io/)
- [DevOps Best Practices](https://www.atlassian.com/devops)

## 📞 支持

如有问题，请提交 [Issue](https://github.com/YYC-Cube/yyc3-reusable-components/issues)。

---

Made with ❤️ by YanYuCloudCube Team
