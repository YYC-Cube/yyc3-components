# YYC3 Reusable Components - Basic Usage Example

这是一个使用YYC3可复用组件库的基础示例项目。

## 🚀 快速开始

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build
```

## 📦 使用的包

- `@yyc3/core` - 核心组件 (ErrorBoundary, GlassCard, FadeIn)
- `@yyc3/utils` - 工具函数 (formatDate, getRelativeTime, uuid)
- `@yyc3/hooks` - 自定义Hooks (useToggle, useLocalStorage, useDebounce, useWindowSize)

## 📚 功能展示

### 1. 错误边界
使用 `ErrorBoundary` 组件捕获子组件中的错误。

### 2. 玻璃态卡片
使用 `GlassCard` 组件创建美观的毛玻璃效果。

### 3. 淡入动画
使用 `FadeIn` 组件添加平滑的入场动画。

### 4. 工具函数
- `formatDate()` - 格式化日期
- `getRelativeTime()` - 获取相对时间
- `uuid()` - 生成UUID

### 5. 自定义Hooks
- `useToggle()` - 布尔值切换
- `useLocalStorage()` - 本地存储状态
- `useDebounce()` - 防抖
- `useWindowSize()` - 窗口尺寸

## 🎯 最佳实践

1. **按需导入**: 只导入需要的功能，减少打包体积
2. **TypeScript**: 始终使用TypeScript以获得类型安全
3. **错误处理**: 使用ErrorBoundary包裹关键组件
4. **性能优化**: 使用useDebounce等Hooks优化性能

## 📖 更多示例

查看其他示例项目：
- [基础用法](./basic-usage/)
- [错误处理](./error-handling/)
- [国际化](./i18n/)
- [存储](./storage/)

## 🔗 相关文档

- [主README](../../README.md)
- [API文档](../../docs/API.md)
- [使用指南](../../docs/USAGE.md)
