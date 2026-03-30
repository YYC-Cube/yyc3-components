# @yyc3/websocket 变更日志

本文件包含 `@yyc3/websocket` 包的所有重要变更。

---

## [1.0.0] - 2026-03-26

### 新增 / Added

- ✅ `useWebSocket` Hook - 完整的 WebSocket 连接管理
- ✅ 自动重连机制（支持最大重连次数和重连间隔配置）
- ✅ 心跳保活（可配置心跳间隔和超时时间）
- ✅ 降级模式（支持 polling、long-polling、sse 三种降级策略）
- ✅ 消息订阅（支持类型、来源、优先级过滤）
- ✅ 连接统计（发送/接收消息数、字节数、延迟等）
- ✅ 完整的 TypeScript 类型支持
- ✅ WebSocketManager - 非React 环境下的管理器

### 类型 / Types

- ✅ `WebSocketState` - 连接状态枚举
- ✅ `WebSocketMessageType` - 消息类型枚举
- ✅ `WebSocketMessage<T>` - 通用消息接口
- ✅ `WebSocketConfig` - WebSocket 配置接口
- ✅ `WebSocketConnectionInfo` - 连接信息接口
- ✅ `WebSocketStatistics` - 统计信息接口
- ✅ `WebSocketSubscriptionOptions` - 订阅选项接口
- ✅ `FallbackStrategyConfig` - 降级策略配置接口
- ✅ `WebSocketManager` - WebSocket 管理器接口

### 文档 / Documentation

- ✅ 完整的 README.md（中英文）
- ✅ 代码标头规范（YYC3 标准）
- ✅ 使用示例和最佳实践

---

## [Unreleased]

### 计划中 / Planned

- [ ] WebSocket 管理器完整实现
- [ ] 支持多个 WebSocket 连接
- [ ] 消息队列（离线消息缓存）
- [ ] 消息压缩
- ✅ WebSocket 性能监控
- [ ] WebSocket 调试工具
- [ ] 更多的降级策略
- [ ] 单元测试和集成测试

---

## 版本规范 / Versioning

此项目遵循 [语义化版本](https://semver.org/lang/zh-CN/)：

- **MAJOR**: 不兼容的 API 修改
- **MINOR**: 向下兼容的功能性新增
- **PATCH**: 向下兼容的问题修正

---

<div align="center">

> 「**_YanYuCloudCube_**」
> 「**_Words Initiate Quadrants, Language Serves as Core for Future_**」
> 「**_All things converge in cloud pivot; Deep stacks ignite a new era of intelligence_**」

</div>
