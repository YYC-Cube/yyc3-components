# @yyc3/error-handling

YYC3可复用组件库 - 错误处理系统

## 📦 概述

`@yyc3/error-handling` 提供了一套完整的错误处理解决方案，包括错误捕获、分类、日志记录和统计分析。

## 🎯 特性

- ✅ **统一错误分类** - 网络/解析/认证/运行时/未知
- ✅ **多种存储后端** - 支持localStorage、IndexedDB等
- ✅ **全局监听器** - 自动捕获未处理异常
- ✅ **错误统计** - 按分类和严重程度统计
- ✅ **平台错误过滤** - 可配置的过滤规则
- ✅ **安全包装器** - 异步和同步操作的安全执行
- ✅ **TypeScript支持** - 完整类型定义

## 📋 核心功能

### 1. ErrorHandler - 错误处理器

核心错误处理器类，提供完整的错误管理功能。

**功能**:
- 自动错误分类
- 错误日志记录
- 错误统计分析
- 全局异常监听
- 平台错误过滤

**使用示例**:

```ts
import { ErrorHandler, getErrorHandler } from '@yyc3/error-handling';

// 创建错误处理器
const handler = new ErrorHandler({
  installGlobalListeners: true,
  logToConsole: true,
});

// 或使用全局单例
const globalHandler = getErrorHandler();

// 捕获错误
const error = globalHandler.capture(new Error('Something went wrong'), {
  category: 'runtime',
  severity: 'error',
  source: 'MyComponent',
  userAction: '请重试操作',
});

console.log(error.id, error.message);
```

### 2. PlatformErrorFilter - 平台错误过滤器

提供可配置的平台错误过滤规则，用于忽略特定平台的错误。

**功能**:
- 支持多种过滤维度（名称、消息、来源、堆栈）
- 可配置的过滤规则
- 内置Figma平台过滤器

**使用示例**:

```ts
import { PlatformErrorFilter, createFigmaErrorFilter, isPlatformError } from '@yyc3/error-handling';

// 使用内置Figma过滤器
const figmaFilter = createFigmaErrorFilter();

// 判断是否应该过滤错误
const shouldIgnore = figmaFilter.shouldFilter({
  name: 'IframeMessageAbortError',
  message: 'Message aborted',
  source: 'https://www.figma.com',
  stack: '...',
});

// 或使用快捷函数
const isFigmaError = isPlatformError(
  'IframeMessageAbortError',
  'Message aborted',
  'https://www.figma.com'
);
```

### 3. LocalStorageErrorStorage - 本地存储实现

基于localStorage的错误存储实现。

**功能**:
- 自动限制日志条目数量
- 存储满时自动清理
- 支持自定义key和最大条目数

**使用示例**:

```ts
import { LocalStorageErrorStorage } from '@yyc3/error-handling';

const storage = new LocalStorageErrorStorage('my_error_log', 100);

storage.save(error);
const log = storage.get();
storage.clear();
```

### 4. 安全包装器

提供异步和同步操作的安全包装器。

**功能**:
- 自动捕获错误
- 返回结果或错误元组
- 类型安全

**使用示例**:

```ts
import { trySafe, trySafeSync } from '@yyc3/error-handling';

// 异步操作
const [data, error] = await trySafe(
  async () => {
    return await fetch('/api/data');
  },
  'API-Data'
);

if (error) {
  console.error('操作失败:', error);
} else {
  console.log('操作成功:', data);
}

// 同步操作
const [result, syncError] = trySafeSync(
  () => JSON.parse(jsonString),
  'JSON-Parse'
);
```

## 📦 安装

```bash
npm install @yyc3/error-handling
# 或
yarn add @yyc3/error-handling
# 或
pnpm add @yyc3/error-handling
```

## 🚀 快速开始

### 基础使用

```ts
import { getErrorHandler, captureError } from '@yyc3/error-handling';

// 捕获错误
try {
  // 你的代码
} catch (err) {
  captureError(err, {
    category: 'network',
    severity: 'error',
    source: 'MyComponent',
  });
}

// 获取错误统计
const stats = getErrorHandler().getErrorStats();
console.log(stats.total, stats.byCategory);

// 获取错误日志
const log = getErrorHandler().getErrorLog(10);
```

### 自定义配置

```ts
import { ErrorHandler, LocalStorageErrorStorage, createFigmaErrorFilter } from '@yyc3/error-handling';

const handler = new ErrorHandler({
  // 自定义存储
  storage: new LocalStorageErrorStorage('custom_log', 500),

  // 不自动安装全局监听器
  installGlobalListeners: false,

  // 不打印到控制台
  logToConsole: false,

  // 自定义平台错误过滤器
  platformErrorFilter: (name, message, source, stack) => {
    // 你的过滤逻辑
    return false;
  },
});

// 手动安装全局监听器
handler.installGlobalListeners();
```

### 自定义存储

```ts
import { ErrorHandler, type ErrorStorage, type AppError } from '@yyc3/error-handling';

class CustomStorage implements ErrorStorage {
  async save(error: AppError): Promise<void> {
    // 发送到服务器
    await fetch('/api/errors', {
      method: 'POST',
      body: JSON.stringify(error),
    });
  }

  async get(limit?: number): Promise<AppError[]> {
    // 从服务器获取
    const res = await fetch('/api/errors');
    const data = await res.json();
    return limit ? data.slice(0, limit) : data;
  }

  async clear(): Promise<void> {
    // 清除服务器上的错误
    await fetch('/api/errors/clear', { method: 'DELETE' });
  }
}

const handler = new ErrorHandler({ storage: new CustomStorage() });
```

## 📊 API 参考

### ErrorHandler

| 方法 | 返回类型 | 说明 |
|------|----------|------|
| `capture(error, options)` | `AppError` | 捕获并记录错误 |
| `getErrorLog(limit?)` | `AppError[]` | 获取错误日志 |
| `getErrorStats()` | `ErrorStats` | 获取错误统计 |
| `clearErrorLog()` | `void` | 清除错误日志 |
| `installGlobalListeners()` | `void` | 安装全局监听器 |
| `trySafe(fn, source?)` | `Promise<[T, null] \| [null, AppError]>` | 异步安全包装 |
| `trySafeSync(fn, source?)` `[T, null] \| [null, AppError]` | 同步安全包装 |

### 快捷函数

| 函数 | 说明 |
|------|------|
| `getErrorHandler()` | 获取全局错误处理器 |
| `captureError(error, options?)` | 捕获错误（快捷方式） |
| `getErrorLog(limit?)` | 获取错误日志（快捷方式） |
| `getErrorStats()` | 获取错误统计（快捷方式） |
| `clearErrorLog()` | 清除错误日志（快捷方式） |
| `trySafe(fn, source?)` | 异步安全包装（快捷方式） |
| `trySafeSync(fn, source?)` | 同步安全包装（快捷方式） |

## 🎨 使用场景

### 1. 全局错误捕获

```ts
// App.tsx
import { getErrorHandler } from '@yyc3/error-handling';

function App() {
  // 安装全局监听器
  useEffect(() => {
    const handler = getErrorHandler();
    // 监听器已自动安装，这里可以做其他初始化
  }, []);

  return <YourApp />;
}
```

### 2. API错误处理

```ts
import { trySafe } from '@yyc3/error-handling';

async function fetchUserData() {
  const [data, error] = await trySafe(
    async () => {
      const res = await fetch('/api/user');
      return res.json();
    },
    'API-UserData'
  );

  if (error) {
    // 错误已被自动捕获和记录
    // 可以在这里处理用户反馈
    showErrorToast(error.message, error.userAction);
  }

  return data;
}
```

### 3. 组件错误边界集成

```tsx
import React from 'react';
import { captureError } from '@yyc3/error-handling';

class ErrorBoundary extends React.Component {
  componentDidCatch(error: React.ErrorInfo, info: React.ErrorInfo) {
    captureError(error, {
      category: 'runtime',
      severity: 'critical',
      source: info.componentStack.split('\n')[1]?.trim(),
    });
  }

  render() {
    return this.props.children;
  }
}
```

## 🔧 开发

```bash
# 安装依赖
npm install

# 类型检查
npm run type-check

# 构建
npm run build

# 监听模式
npm run dev
```

## 📊 统计信息

- **代码量**: ~600行
- **类数量**: 3个 (ErrorHandler, PlatformErrorFilter, LocalStorageErrorStorage)
- **快捷函数**: 7个
- **TypeScript**: 100%覆盖

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 依赖

- `@yyc3/types`: workspace:* (dependency)

## 📝 许可证

MIT
