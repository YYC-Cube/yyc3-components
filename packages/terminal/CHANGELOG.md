# @yyc3/terminal 变更日志

本文件包含 `@yyc3/terminal` 包的所有重要变更。

---

## [1.0.0] - 2026-03-26

### 新增 / Added

- ✅ `useTerminal` Hook - 完整的终端会话管理
- ✅ 终端会话管理（创建、关闭、查询）
- ✅ 命令执行（异步执行，支持超时）
- ✅ 命令历史（历史记录和清理）
- ✅ 快捷命令（添加、删除、查询）
- ✅ 统计信息（会话数、命令数、成功率、平均时长）
- ✅ 多 Shell 支持（bash, zsh, sh, powershell, cmd, fish）
- ✅ 订阅模式（状态变化自动通知）
- ✅ 完整的 TypeScript 类型支持

### 类型 / Types

- ✅ `TerminalSessionStatus` - 会话状态枚举
- ✅ `ShellType` - Shell 类型枚举
- ✅ `TerminalSession` - 终端会话接口
- ✅ `TerminalSessionConfig` - 会话配置接口
- ✅ `CommandExecutionResult` - 命令执行结果接口
- ✅ `CommandHistoryEntry` - 命令历史条目接口
- ✅ `TerminalShortcut` - 快捷命令接口
- ✅ `TerminalMetrics` - 终端统计接口
- ✅ `UseTerminalReturn` - Hook 返回类型

### 文档 / Documentation

- ✅ 完整的 README.md（中英文）
- ✅ 代码标头规范（YYC3 标准）
- ✅ 使用示例和最佳实践

---

## [Unreleased]

### 计划中 / Planned

- [ ] 实际终端连接（当前为模拟服务）
- [ ] 支持多个并发会话
- [ ] 命令自动补全
- [ ] 语法高亮
- [ ] 文件上传/下载
- [ ] 命令建议
- [ ] 终端主题定制
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
