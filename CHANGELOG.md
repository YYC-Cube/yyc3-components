# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-03-26

### Added

#### @yyc3/ui

- 48个UI组件
  - Button组件
  - Card组件
  - Input组件
  - Select组件
  - Modal组件
  - Toast组件
  - ...等48个组件

#### @yyc3/utils

- 28个工具函数
  - 字符串处理：truncate, capitalize, camelToKebab, kebabToCamel, uuid, slugify等
  - 数据处理：deepClone, unique, groupBy, chunk等
  - 日期处理：formatDate, getRelativeTime, isToday, isThisWeek等
  - 颜色处理：hexToRgb, hexToRgba, isDarkColor, getContrastColor等

#### @yyc3/types

- 50+个类型定义
  - AppError
  - Locale
  - Theme
  - ...等类型

#### @yyc3/core

- 4个核心组件
  - ErrorBoundary - 错误边界
  - GlassCard - 玻璃态卡片
  - FadeIn - 淡入动画
  - LoadingSpinner - 加载动画

#### @yyc3/hooks

- 7个自定义Hooks
  - useToggle - 布尔切换
  - useLocalStorage - 本地存储
  - useDebounce - 防抖
  - useMediaQuery - 媒体查询
  - useWindowSize - 窗口尺寸
  - useClickOutside - 点击外部检测
  - useI18n - 国际化

#### @yyc3/error-handling

- 完整的错误处理系统
  - 错误分类（网络/解析/认证/运行时）
  - 错误日志记录
  - 错误统计分析
  - 平台错误过滤（支持Figma等）
  - 异步和同步安全包装

#### @yyc3/i18n

- 轻量级国际化工具
  - 嵌套key支持
  - 模板变量替换
  - 翻译合并
  - 翻译验证
  - 一致性检查

#### @yyc3/storage

- 完整的存储解决方案
  - IndexedDB封装（自动初始化、CRUD操作）
  - BroadcastChannel（跨标签页/窗口通信）
  - localStorage fallback（降级机制）

### Features

- 完整的TypeScript类型支持
- 零依赖设计
- 完整的测试覆盖
- ESLint和Prettier配置
- GitHub Actions CI/CD
- 详细的文档
- 示例项目

### Documentation

- 完整的使用指南
- API文档
- 最佳实践
- 贡献指南
- 示例项目

### Testing

- Vitest测试框架
- 9个测试文件
- 100+测试用例
- 代码覆盖率报告

### Build Tooling

- Turborepo monorepo配置
- tsup打包工具
- TypeScript 5.9.3
- Vite 5.0

---

## [Unreleased]

### Planned

- Storybook集成
- 性能优化
- 可访问性测试
- 浏览器兼容性测试
- 更多UI组件
- 更多工具函数

---

## 版本说明

### 1.0.0

这是YYC3 Reusable Components的首个正式版本！

**包含内容**:

- 8个完整的包
- 52个组件
- 7个Hooks
- 28个工具函数
- 50+个类型定义
- 完整的测试覆盖
- 详细的文档

**适用场景**:

- Web应用开发
- 企业级项目
- 快速原型开发
- 组件库参考

---

## 更新类型说明

- `Added`: 新功能
- `Changed`: 功能变更
- `Deprecated`: 即将废弃的功能
- `Removed`: 已移除的功能
- `Fixed`: Bug修复
- `Security`: 安全问题修复
