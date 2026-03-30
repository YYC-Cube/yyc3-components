# @yyc3/backend-bridge

YYC3 后端桥接 - 统一的后端通信接口。

## ✨ 特性

- 🔌 后端桥接（WebSocket 连接、API 调用）
- 📨 消息代理（消息路由、过滤、转换）
- 🔄 连接管理（自动重连、心跳、超时）
- ❌ 错误处理（错误捕获、重试、降级）
- 📡 状态同步（客户端状态同步）
- 🎺 事件总线（事件发布、订阅、广播）

## 💡 使用示例

```tsx
import { getBackendBridge } from '@yyc3/backend-bridge';

const bridge = getBackendBridge();
await bridge.connect();
bridge.send({ type: 'message', data: 'Hello' });
```

## 📄 许可证

MIT License

---

Made with ❤️ by YanYuCloudCube Team
