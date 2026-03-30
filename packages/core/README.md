# @yyc3/core

YYC3可复用组件库 - 核心组件包

## 📦 概述

`@yyc3/core` 提供了一套通用的核心React组件，用于构建现代Web应用。

## 🎯 特性

- ✅ **错误边界** - 企业级错误捕获与处理
- ✅ **玻璃态卡片** - 现代UI风格组件
- ✅ **入场动画** - 流畅的过渡效果
- ✅ **加载动画** - 多种加载样式
- ✅ **完全可访问** - 遵循WCAG 2.1标准
- ✅ **TypeScript支持** - 完整类型定义
- ✅ **主题友好** - 支持深色模式

## 📦 组件列表

### 1. ErrorBoundary - 错误边界

React错误边界组件，用于捕获子组件树中的JavaScript错误。

**功能**:

- 捕获运行时错误
- 分级错误展示（页面级/模块级/组件级）
- 支持自定义降级UI
- 错误详情查看与复制
- 重试和返回首页功能

**使用示例**:

```tsx
import { ErrorBoundary } from '@yyc3/core';

function App() {
  return (
    <ErrorBoundary
      level="page"
      source="App"
      onError={(error, info) => {
        console.error('Error caught:', error);
      }}
    >
      <YourComponent />
    </ErrorBoundary>
  );
}
```

**Props**:

| Prop              | 类型                    | 默认值            | 说明               |
| ----------------- | ----------------------- | ----------------- | ------------------ |
| `children`        | `ReactNode`             | -                 | 子组件             |
| `level`           | `ErrorBoundaryLevel`    | `"page"`          | 错误边界级别       |
| `fallback`        | `ReactNode \| function` | -                 | 自定义降级UI       |
| `source`          | `string`                | `"ErrorBoundary"` | 错误来源标识       |
| `onError`         | `function`              | -                 | 错误回调           |
| `onCaptureError`  | `function`              | -                 | 自定义错误处理     |
| `generateErrorId` | `function`              | -                 | 自定义错误ID生成器 |

### 2. GlassCard - 玻璃态卡片

提供玻璃态视觉效果的现代卡片组件。

**功能**:

- 玻璃态背景效果
- 自定义发光效果
- 点击交互支持
- 响应式设计
- 深色模式支持

**使用示例**:

```tsx
import { GlassCard } from '@yyc3/core';

function Card() {
  return (
    <GlassCard
      glowColor="#00d4ff"
      clickable
      onClick={() => console.log('clicked')}
      className="p-6"
    >
      <h2>标题</h2>
      <p>内容</p>
    </GlassCard>
  );
}
```

**Props**:

| Prop        | 类型        | 默认值  | 说明       |
| ----------- | ----------- | ------- | ---------- |
| `children`  | `ReactNode` | -       | 子组件     |
| `className` | `string`    | `""`    | 自定义类名 |
| `glowColor` | `string`    | -       | 发光颜色   |
| `clickable` | `boolean`   | `false` | 是否可点击 |
| `onClick`   | `function`  | -       | 点击事件   |

### 3. FadeIn - 入场动画

提供流畅的入场动画效果。

**功能**:

- 多种入场方向
- 延迟设置
- 自定义动画时长
- 兼容性强

**使用示例**:

```tsx
import { FadeIn } from '@yyc3/core';

function AnimatedList() {
  return (
    <div>
      <FadeIn delay={0} direction="up">
        <p>第一个元素</p>
      </FadeIn>
      <FadeIn delay={0.1} direction="up">
        <p>第二个元素</p>
      </FadeIn>
      <FadeIn delay={0.2} direction="up">
        <p>第三个元素</p>
      </FadeIn>
    </div>
  );
}
```

**Props**:

| Prop        | 类型                                            | 默认值 | 说明           |
| ----------- | ----------------------------------------------- | ------ | -------------- |
| `children`  | `ReactNode`                                     | -      | 子组件         |
| `delay`     | `number`                                        | `0`    | 延迟时间（秒） |
| `duration`  | `number`                                        | `0.5`  | 动画时长（秒） |
| `direction` | `"up" \| "down" \| "left" \| "right" \| "none"` | `"up"` | 动画方向       |
| `className` | `string`                                        | `""`   | 自定义类名     |
| `onClick`   | `function`                                      | -      | 点击事件       |

### 4. LoadingSpinner - 加载动画

提供多种样式的加载动画。

**功能**:

- 多种动画样式（旋转/圆点/条形/脉冲）
- 自定义尺寸和颜色
- 完全可访问

**使用示例**:

```tsx
import { LoadingSpinner } from '@yyc3/core';

function Loading() {
  return (
    <div className="flex gap-4">
      <LoadingSpinner variant="default" size="lg" />
      <LoadingSpinner variant="dots" color="#00d4ff" />
      <LoadingSpinner variant="bars" size={40} />
      <LoadingSpinner variant="pulse" />
    </div>
  );
}
```

**Props**:

| Prop        | 类型                                       | 默认值           | 说明       |
| ----------- | ------------------------------------------ | ---------------- | ---------- |
| `size`      | `ComponentSize \| number`                  | `"default"`      | 尺寸       |
| `color`     | `string`                                   | `"currentColor"` | 颜色       |
| `variant`   | `"default" \| "dots" \| "bars" \| "pulse"` | `"default"`      | 动画类型   |
| `className` | `string`                                   | `""`             | 自定义类名 |

## 📦 安装

```bash
npm install @yyc3/core
# 或
yarn add @yyc3/core
# 或
pnpm add @yyc3/core
```

## 🚀 快速开始

```tsx
import { ErrorBoundary, GlassCard, FadeIn, LoadingSpinner } from '@yyc3/core';

function App() {
  return (
    <ErrorBoundary>
      <FadeIn delay={0.2}>
        <GlassCard className="p-6">
          <h1>欢迎使用 YYC3 Core</h1>
          <LoadingSpinner />
        </GlassCard>
      </FadeIn>
    </ErrorBoundary>
  );
}
```

## 🎨 样式定制

所有组件都支持通过`className`属性自定义样式，使用Tailwind CSS或普通CSS均可。

### 示例：自定义玻璃态卡片

```tsx
<GlassCard className="bg-white/90 p-8 dark:bg-gray-800/90">
  <h2 className="text-xl font-bold">自定义样式</h2>
</GlassCard>
```

## 🌓 深色模式

所有组件都内置深色模式支持，只需确保您的应用包含深色模式CSS：

```css
@media (prefers-color-scheme: dark) {
  /* 深色模式样式 */
}
```

或使用Tailwind CSS的深色模式：

```tsx
<html className="dark">
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

- **组件数量**: 4个
- **代码量**: ~600行
- **TypeScript**: 100%覆盖
- **测试覆盖**: 计划中

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 依赖

- `react`: >=18.0.0 (peer dependency)
- `react-dom`: >=18.0.0 (peer dependency)
- `@yyc3/types`: workspace:\* (dependency)
- `@yyc3/ui`: workspace:\* (dependency)
- `lucide-react`: 图标库 (dependency)

## 📝 许可证

MIT
