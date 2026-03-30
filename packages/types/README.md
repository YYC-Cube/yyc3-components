# @yyc3/types

YYC3可复用组件库 - 通用类型定义包

## 📦 概述

`@yyc3/types` 提供了一套通用的TypeScript类型定义，用于构建类型安全的前端应用。

## 🎯 特性

- ✅ **完整的类型覆盖** - 错误处理、用户认证、国际化、表单、存储等
- ✅ **零依赖** - 纯TypeScript类型定义
- ✅ **类型安全** - 完整的TypeScript支持
- ✅ **易于复用** - 通用设计，适用于大多数前端项目

## 📋 包含的类型

### 1. 错误处理类型
- `ErrorCategory` - 错误分类
- `ErrorSeverity` - 错误严重程度
- `AppError` - 应用错误对象
- `ErrorStats` - 错误统计

### 2. 用户与认证类型
- `UserRole` - 用户角色
- `AppUser` - 用户信息
- `AppSession` - 会话信息
- `AuthContextValue` - 认证上下文

### 3. 国际化类型
- `Locale` - 语言代码
- `LocaleInfo` - 语言信息
- `I18nContextValue` - 国际化上下文
- `I18nMessages` - 消息类型

### 4. 组件状态类型
- `LoadingState` - 加载状态
- `AsyncState` - 异步状态
- `ComponentStatus` - 组件状态

### 5. 表单类型
- `FormField` - 表单字段
- `FormState` - 表单状态

### 6. 网络请求类型
- `ApiResponse` - API响应
- `RequestConfig` - 请求配置

### 7. 存储类型
- `StorageType` - 存储类型
- `StorageItem` - 存储项
- `StorageOptions` - 存储选项

### 8. 主题与样式类型
- `Theme` - 主题模式
- `ThemeContextValue` - 主题上下文
- `ColorScheme` - 色彩方案
- `ColorPalette` - 色彩调色板

### 9. 动画类型
- `AnimationDuration` - 动画时长
- `AnimationEasing` - 动画缓动
- `AnimationOptions` - 动画选项

### 10. 通用工具类型
- `Nullable` - 可空类型
- `Optional` - 可选类型
- `MaybePromise` - Promise包装类型
- `PaginationParams` - 分页参数
- `PaginatedResponse` - 分页响应
- `SortParams` - 排序参数
- `FilterParams` - 过滤参数

### 11. 路由类型
- `RoutePath` - 路由路径
- `RouteParams` - 路由参数
- `RouteMatch` - 路由匹配

### 12. 文件类型
- `FileType` - 文件类型
- `FileInfo` - 文件信息

### 13. 通知类型
- `NotificationType` - 通知类型
- `Notification` - 通知对象

### 14. 性能监控类型
- `PerformanceMetric` - 性能指标
- `PerformanceStats` - 性能统计

### 15. React组件相关类型
- `ComponentSize` - 组件尺寸
- `ComponentVariant` - 组件变体
- `BaseComponentProps` - 基础组件属性
- `PolymorphicComponentProps` - 多态组件属性

## 📦 安装

```bash
npm install @yyc3/types
# 或
yarn add @yyc3/types
# 或
pnpm add @yyc3/types
```

## 🚀 使用

### 导入类型

```typescript
import type {
  AppError,
  ApiResponse,
  PaginationParams,
  FormState,
  Theme
} from '@yyc3/types';
```

### 使用示例

#### 错误处理

```typescript
import type { AppError, ErrorCategory, ErrorSeverity } from '@yyc3/types';

const handleError = (error: AppError) => {
  if (error.severity === 'critical') {
    // 处理严重错误
  }
};
```

#### API响应

```typescript
import type { ApiResponse, RequestConfig } from '@yyc3/types';

async function fetchUser(id: string): Promise<ApiResponse<User>> {
  const config: RequestConfig = {
    method: 'GET',
    timeout: 5000
  };
  // ... fetch logic
}
```

#### 表单状态

```typescript
import type { FormState, FormField } from '@yyc3/types';

const formState: FormState = {
  fields: {
    username: { name: 'username', value: '', error: null },
    password: { name: 'password', value: '', error: null }
  },
  isValid: false,
  isDirty: false,
  isSubmitting: false
};
```

#### 主题

```typescript
import type { Theme, ThemeContextValue } from '@yyc3/types';

const themeContext: ThemeContextValue = {
  theme: 'dark',
  setTheme: (theme: Theme) => { /* ... */ },
  resolvedTheme: 'dark'
};
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

- **类型定义**: 50+ 个
- **导出接口**: 30+ 个
- **类型别名**: 20+ 个
- **代码量**: ~300 行

## 📝 许可证

MIT

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 依赖

- `react`: >=18.0.0 (peer dependency)
- `typescript`: >=5.4.0 (dev dependency)
