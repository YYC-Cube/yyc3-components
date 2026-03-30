# @yyc3/ai 变更日志

本文件包含 `@yyc3/ai` 包的所有重要变更。

---

## [1.0.0] - 2026-03-26

### 新增 / Added

- ✅ `useAI` Hook - 完整的 AI 对话功能
- ✅ 流式响应支持（SSE）
- ✅ 多提供商支持（OpenAI, Anthropic, Ollama, Zhipu, Qwen, DeepSeek）
- ✅ 配置管理（localStorage 持久化，支持版本迁移）
- ✅ 自动降级（网络失败时使用模拟响应）
- ✅ 超时控制（默认 2 秒超时）
- ✅ 完整的 TypeScript 类型支持
- ✅ `createAIStreamParser` - 流式响应解析工具

### 类型 / Types

- ✅ `AIProvider` - AI 提供商枚举
- ✅ `AIConfig` - AI 配置接口
- ✅ `AIMessage` - AI 消息接口
- ✅ `AIStreamCallback` - 流式回调类型
- ✅ `StreamChunk` - 流式块接口
- ✅ `UseAIReturn` - Hook 返回类型

### 文档 / Documentation

- ✅ 完整的 README.md（中英文）
- ✅ 代码标头规范（YYC3 标准）
- ✅ 使用示例和最佳实践

---

## [Unreleased]

### 计划中 / Planned

- [ ] 支持多轮对话上下文
- [ ] 消息历史管理
- [ ] Token 计数和限制
- [ ] 图片生成支持
- [ ] 语音识别和合成
- [ ] 自定义函数调用
- [ ] RAG 集成
- [ ] 多模态输入

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
