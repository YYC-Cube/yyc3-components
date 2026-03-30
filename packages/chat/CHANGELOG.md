# @yyc3/chat 变更日志

本文件包含 `@yyc3/chat` 包的所有重要变更。

---

## [1.0.0] - 2026-03-26

### 新增 / Added
- ✅ `useChatPersistence` Hook - 聊天数据持久化
- ✅ `useChannelManager` Hook - 频道管理
- ✅ `TypingIndicator` 组件 - 打字指示器
- ✅ localStorage 自动保存和加载
- ✅ 数据迁移（自动添加新字段）
- ✅ 自动清理（存储空间和过期数据）
- ✅ 数据导出（JSON 格式文件下载）
- ✅ 数据导入（JSON 格式文件上传）
- ✅ 多频道支持（独立存储）
- ✅ 收藏保护（星标聊天不会被清理）

### 类型 / Types
- ✅ `Message` - 消息接口（支持流式状态）
- ✅ `Chat` - 聊天会话接口（包含消息列表和元数据）
- ✅ `Channel` - 频道接口（支持加密和预设）
- ✅ `UseChatPersistenceReturn` - 聊天持久化 Hook 返回类型
- ✅ `UseChannelManagerReturn` - 频道管理 Hook 返回类型

### 文档 / Documentation
- ✅ 完整的 README.md（中英文）
- ✅ 代码标头规范（YYC3 标准）
- ✅ 使用示例和最佳实践

---

## [Unreleased]

### 计划中 / Planned
- [ ] 支持消息编辑和删除
- [ ] 支持消息搜索和过滤
- [ ] 支持消息标签和分类
- [ ] 支持消息附件和图片
- [ ] 支持消息引用和回复
- [ ] 支持消息转发

---

## 版本规范 / Versioning

此项目遵循 [语义化版本](https://semver.org/lang/zh-CN/)：

- **MAJOR**: 不兼容的 API 修改
- **MINOR**: 向下兼容的功能性新增
- **PATCH**: 向下兼容的问题修正

---

<div align="center">

> 「***YanYuCloudCube***」
> 「***Words Initiate Quadrants, Language Serves as Core for Future***」
> 「***All things converge in cloud pivot; Deep stacks ignite a new era of intelligence***」

</div>
