# @yyc3/websocket

> YYC3 WebSocket React Hooks
> YYC3 可复用组件库 - WebSocket React Hooks

**完整的中英文文档** | English and Chinese documentation

---

## 特性 / Features

- ✅ **自动重连** - 支持最大重连次数和重连间隔配置 / Auto-reconnect with max attempts and interval config
- ✅ **心跳保活** - 可配置心跳间隔和超时时间 / Heartbeat with configurable interval and timeout
- ✅ **降级模式** - 支持 polling、long-polling、sse 三种降级策略 / Fallback with polling, long-polling, sse modes
- ✅ **消息订阅** - 支持类型、来源、优先级过滤 / Message subscription with type, source, priority filters
- ✅ **连接统计** - 发送/接收消息数、字节数、延迟等 / Statistics on messages, bytes, latency
- ✅ **TypeScript** - 完整类型支持 / Full TypeScript support

---

## 安装 / Installation

```bash
pnpm add @yyc3/websocket
```

---

## 快速开始 / Quick Start

### 基础用法 / Basic Usage

```tsx
import { useWebSocket } from '@yyc3/websocket';

function MyComponent() {
  const { state, send, subscribe, isConnected } = useWebSocket('ws://localhost:8080', {
    autoReconnect: true,
    maxReconnectAttempts: 3
  });

  useEffect(() => {
    const unsubscribe = subscribe((message) => {
      console.log('Received:', message);
    });
    return unsubscribe;
  }, []);

  return (
    <div>
      <p>Status: {state}</p>
      <button onClick={() => send('chat', { text: 'Hello' })}>
        Send Message
      </button>
    </div>
  );
}
```

---

## API 文档 / API Documentation

### useWebSocket

管理 WebSocket 连接的 Hook。

#### 参数 / Parameters

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| url | `string` | - | WebSocket 服务器 URL |
| config | `Partial<WebSocketConfig>` | `{}` | 配置选项 |

#### 返回值 / Returns

```typescript
interface UseWebSocketReturn {
  // 状态 / State
  state: WebSocketState;
  connectionInfo: WebSocketConnectionInfo;
  statistics: WebSocketStatistics;
  isConnected: boolean;
  isConnecting: boolean;
  isFallbackActive: boolean;
  lastError: string | null;

  // 控制函数 / Control functions
  connect: () => void;
  disconnect: () => void;
  reconnect: () => void;
  send: <T>(type: WebSocketMessageType, data: T) => void;
  subscribe: <T>(
    callback: (message: WebSocketMessage<T>) => void,
    options?: WebSocketSubscriptionOptions
  ) => () => void;
}
```

---

## 配置选项 / Configuration Options

### WebSocketConfig

```typescript
interface WebSocketConfig {
  url: string;                              // WebSocket URL
  reconnectInterval?: number;                // 重连间隔（毫秒）/ Reconnect interval (ms)
  maxReconnectAttempts?: number;             // 最大重连次数 / Max reconnect attempts
  heartbeatInterval?: number;                // 心跳间隔（毫秒）/ Heartbeat interval (ms)
  heartbeatTimeout?: number;                  // 心跳超时（毫秒）/ Heartbeat timeout (ms)
  autoReconnect?: boolean;                    // 自动重连 / Auto reconnect
  protocols?: string | string[];             // 协议 / Protocols
}
```

### 默认配置 / Default Config

```typescript
{
  reconnectInterval: 3000,      // 3 秒
  maxReconnectAttempts: 5,       // 5 次
  heartbeatInterval: 30000,     // 30 秒
  heartbeatTimeout: 5000,       // 5 秒
  autoReconnect: true
}
```

---

## 消息订阅 / Message Subscription

### 订阅所有消息

```tsx
const { subscribe } = useWebSocket(url);

useEffect(() => {
  const unsubscribe = subscribe((message) => {
    console.log('All messages:', message);
  });
  return unsubscribe;
}, []);
```

### 订阅特定类型

```tsx
useEffect(() => {
  const unsubscribe = subscribe(
    (message) => {
      console.log('Terminal output:', message);
    },
    {
      messageTypes: ['terminal_output']
    }
  );
  return unsubscribe;
}, []);
```

### 订阅多个类型和来源

```tsx
useEffect(() => {
  const unsubscribe = subscribe(
    (message) => {
      console.log('Filtered message:', message);
    },
    {
      messageTypes: ['terminal_output', 'docker_log'],
      sources: ['server1', 'server2'],
      priorities: ['high', 'normal']
    }
  );
  return unsubscribe;
}, []);
```

---

## 连接状态 / Connection States

```typescript
type WebSocketState =
  | 'connecting'     // 连接中 / Connecting
  | 'connected'      // 已连接 / Connected
  | 'disconnected'   // 已断开 / Disconnected
  | 'reconnecting'   // 重连中 / Reconnecting
  | 'failed';        // 连接失败 / Failed
```

---

## 消息类型 / Message Types

```typescript
type WebSocketMessageType =
  | 'terminal_output'      // 终端输出 / Terminal output
  | 'docker_log'           // Docker 日志 / Docker log
  | 'git_operation'        // Git 操作 / Git operation
  | 'system_diagnostic'    // 系统诊断 / System diagnostic
  | 'workflow_execution'   // 工作流执行 / Workflow execution
  | 'heartbeat'            // 心跳 / Heartbeat
  | 'error'                // 错误 / Error
  | 'ping'                 // Ping
  | 'pong';                // Pong
```

---

## 降级策略 / Fallback Strategy

当 WebSocket 连接失败时，Hook 会自动降级到 polling 模式。

```typescript
const DEFAULT_FALLBACK: FallbackStrategyConfig = {
  enabled: true,
  mode: 'polling',
  pollingInterval: 5000,        // 5 秒
  maxPollingFailures: 3,
  trigger: {
    connectionFailures: 3,      // 3 次连接失败后降级
    timeout: 10000,            // 10 秒超时
  },
};
```

---

## 连接统计 / Connection Statistics

```typescript
interface WebSocketStatistics {
  messagesSent: number;       // 发送消息数 / Messages sent
  messagesReceived: number;    // 接收消息数 / Messages received
  bytesSent: number;           // 发送字节数 / Bytes sent
  bytesReceived: number;       // 接收字节数 / Bytes received
  errorCount: number;          // 错误次数 / Error count
  averageLatency: number;      // 平均延迟（毫秒）/ Average latency (ms)
  lastActivityAt: Date;       // 最后活动时间 / Last activity time
}
```

---

## 最佳实践 / Best Practices

### 1. 清理订阅

```tsx
useEffect(() => {
  const unsubscribe = subscribe(callback);
  return unsubscribe; // 组件卸载时自动清理 / Cleanup on unmount
}, []);
```

### 2. 错误处理

```tsx
const { lastError, reconnect } = useWebSocket(url);

useEffect(() => {
  if (lastError) {
    console.error('WebSocket error:', lastError);
    // 显示错误提示 / Show error notification
  }
}, [lastError]);
```

### 3. 连接状态监控

```tsx
const { isConnected, isConnecting } = useWebSocket(url);

return (
  <div>
    {isConnecting && <LoadingSpinner />}
    {!isConnected && <ConnectionError />}
    {isConnected && <ChatInterface />}
  </div>
);
```

---

## 故障排除 / Troubleshooting

### 连接失败 / Connection Failed

1. 检查 WebSocket 服务器是否运行
   ```bash
   # 检查服务器状态 / Check server status
   curl -i -N \
     -H "Connection: Upgrade" \
     -H "Upgrade: websocket" \
     -H "Sec-WebSocket-Version: 13" \
     -H "Sec-WebSocket-Key: test" \
     http://localhost:8080
   ```

2. 检查防火墙设置 / Check firewall settings

3. 验证 URL 格式 / Verify URL format

### 自动重连不工作 / Auto Reconnect Not Working

确保 `autoReconnect` 设置为 `true`：

```tsx
const { } = useWebSocket(url, {
  autoReconnect: true,  // ✅ 必须启用 / Must be enabled
  maxReconnectAttempts: 5
});
```

---

## 许可证 / License

MIT License

---

<div align="center">

> 「***YanYuCloudCube***」
> 「***<admin@0379.email>***」
> 「***Words Initiate Quadrants, Language Serves as Core for Future***」
> 「***All things converge in cloud pivot; Deep stacks ignite a new era of intelligence***」

</div>
