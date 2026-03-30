# YYC3 Reusable Components - 使用指南

完整的YYC3可复用组件库使用指南和最佳实践。

## 📦 安装

### 单独安装包

```bash
# 安装单个包
npm install @yyc3/core

# 安装多个包
npm install @yyc3/core @yyc3/utils @yyc3/hooks

# 使用pnpm
pnpm add @yyc3/core @yyc3/utils @yyc3/hooks
```

### 一次性安装所有包

```bash
npm install @yyc3/core @yyc3/utils @yyc3/types @yyc3/hooks \
            @yyc3/error-handling @yyc3/i18n @yyc3/storage
```

## 🚀 快速开始

### 1. 基础配置

```tsx
// tsconfig.json
{
  "compilerOptions": {
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true
  }
}
```

### 2. 导入组件

```tsx
// 从主入口导入
import {
  ErrorBoundary,
  GlassCard,
  Button,
  Card,
} from '@yyc3/core';

// 从具体包导入
import { ErrorBoundary, GlassCard } from '@yyc3/core';
import { Button, Card } from '@yyc3/ui';
import { useToggle, useLocalStorage } from '@yyc3/hooks';
import { formatDate, uuid } from '@yyc3/utils';
```

## 📚 包说明

### @yyc3/ui - UI组件库

包含48个常用UI组件，覆盖大部分前端开发需求。

#### 主要组件

- **Button** - 按钮组件
- **Card** - 卡片组件
- **Input** - 输入框
- **Select** - 选择器
- **Modal** - 模态框
- **Toast** - 提示框

#### 使用示例

```tsx
import { Button, Card, Input } from '@yyc3/ui';

function MyComponent() {
  return (
    <Card>
      <Input placeholder="请输入内容" />
      <Button variant="primary">提交</Button>
      <Button variant="secondary">取消</Button>
    </Card>
  );
}
```

### @yyc3/utils - 工具函数库

28个纯JavaScript工具函数，零依赖。

#### 主要函数

**字符串处理**
- `truncate(str, length)` - 截断字符串
- `capitalize(str)` - 首字母大写
- `camelToKebab(str)` / `kebabToCamel(str)` - 命名转换
- `uuid()` - 生成UUID
- `slugify(str)` - URL友好化

**数据处理**
- `deepClone(obj)` - 深度克隆
- `unique(arr)` - 去重
- `groupBy(arr, key)` - 分组
- `chunk(arr, size)` - 分块

**日期处理**
- `formatDate(date, locale)` - 格式化日期
- `getRelativeTime(date)` - 相对时间
- `isToday(date)` / `isThisWeek(date)` - 日期判断

**颜色处理**
- `hexToRgb(hex)` / `hexToRgba(hex, alpha)` - 颜色转换
- `isDarkColor(hex)` - 深色检测
- `getContrastColor(hex)` - 对比色

#### 使用示例

```ts
import {
  formatDate,
  uuid,
  deepClone,
  truncate,
} from '@yyc3/utils';

// 日期格式化
const formatted = formatDate(new Date(), 'zh-CN');

// 生成UUID
const id = uuid();

// 深度克隆
const cloned = deepClone(originalObject);

// 字符串截断
const truncated = truncate('这是一个很长的字符串', 10);
// 输出: "这是一个很..."
```

### @yyc3/hooks - 自定义Hooks

7个实用的React Hooks。

#### 主要Hooks

- `useToggle(initial)` - 布尔值切换
- `useLocalStorage(key, initial)` - 本地存储状态
- `useDebounce(value, delay)` - 防抖
- `useMediaQuery(query)` - 媒体查询
- `useWindowSize()` - 窗口尺寸
- `useClickOutside(ref, handler)` - 点击外部检测
- `useI18n(messages)` - 国际化

#### 使用示例

```tsx
import {
  useToggle,
  useLocalStorage,
  useDebounce,
  useWindowSize,
} from '@yyc3/hooks';

function MyComponent() {
  const [isOpen, toggleOpen] = useToggle(false);
  const [count, setCount] = useLocalStorage('count', 0);
  const [input, setInput] = useState('');
  const debouncedInput = useDebounce(input, 500);
  const { width, height } = useWindowSize();

  return (
    <div>
      <button onClick={() => toggleOpen()}>
        {isOpen ? '关闭' : '打开'}
      </button>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="输入内容..."
      />
      <p>防抖结果: {debouncedInput}</p>
      <p>窗口: {width} x {height}</p>
    </div>
  );
}
```

### @yyc3/core - 核心组件

4个企业级React组件。

#### 主要组件

- **ErrorBoundary** - 错误边界
- **GlassCard** - 玻璃态卡片
- **FadeIn** - 淡入动画
- **LoadingSpinner** - 加载动画

#### 使用示例

```tsx
import {
  ErrorBoundary,
  GlassCard,
  FadeIn,
  LoadingSpinner,
} from '@yyc3/core';

function MyComponent() {
  return (
    <ErrorBoundary
      fallback={
        <div>出错了！</div>
      }
    >
      <GlassCard>
        <FadeIn>
          <LoadingSpinner />
        </FadeIn>
      </GlassCard>
    </ErrorBoundary>
  );
}
```

### @yyc3/error-handling - 错误处理系统

完整的错误捕获、分类、记录、统计系统。

#### 主要功能

- 错误分类（网络/解析/认证/运行时）
- 错误日志记录
- 错误统计分析
- 平台错误过滤
- 异步和同步安全包装

#### 使用示例

```ts
import {
  getErrorHandler,
  captureError,
  trySafe,
} from '@yyc3/error-handling';

// 捕获错误
try {
  throw new Error('Something went wrong');
} catch (error) {
  captureError(error, 'MyComponent');
}

// 安全包装器
const [data, error] = await trySafe(
  async () => {
    return await fetch('/api/data');
  },
  'API-Data'
);

if (error) {
  console.error('操作失败:', error);
}

// 查看错误统计
const handler = getErrorHandler();
const stats = handler.getErrorStats();
console.log(stats.total, stats.byCategory);
```

### @yyc3/i18n - 国际化系统

轻量级国际化工具，支持嵌套key和模板变量。

#### 主要功能

- 嵌套key支持
- 模板变量替换
- 翻译合并
- 翻译验证
- 一致性检查

#### 使用示例

```ts
import { createTranslator, mergeMessages, validateMessages } from '@yyc3/i18n';

const messages = {
  welcome: '欢迎使用',
  greeting: '你好, {name}!',
  nav: {
    home: '首页',
    settings: '设置',
  },
};

// 创建翻译器
const t = createTranslator(messages);

// 使用翻译
console.log(t('welcome'));
console.log(t('greeting', { name: '张三' }));
console.log(t('nav.home'));

// 合并翻译
const merged = mergeMessages(baseMessages, overrideMessages);

// 验证翻译
const errors = validateMessages(messages);
if (errors.length > 0) {
  console.error('翻译有错误:', errors);
}
```

### @yyc3/storage - 存储系统

完整的存储解决方案，支持IndexedDB和BroadcastChannel。

#### 主要功能

- IndexedDB封装（自动初始化、CRUD操作）
- BroadcastChannel（跨标签页/窗口通信）
- localStorage fallback（降级机制）

#### 使用示例

```ts
import { createIndexedDB, createBroadcastChannel } from '@yyc3/storage';

// IndexedDB
const db = createIndexedDB({
  name: 'appDatabase',
  version: 1,
  stores: [
    { name: 'users', keyPath: 'id' },
    { name: 'settings', keyPath: 'key' },
  ],
});

// 添加数据
await db.put('users', { id: '1', name: 'John' });

// 获取数据
const user = await db.get('users', '1');

// 获取所有数据
const allUsers = await db.getAll('users');

// 删除数据
await db.delete('users', '1');

// 清空存储
await db.clear('users');

// BroadcastChannel
const channel = createBroadcastChannel('sync', (data) => {
  console.log('收到消息:', data);
});

// 发送消息
channel.send('Hello from other tab!');

// 关闭频道
channel.close();
```

## 🎯 最佳实践

### 1. 按需导入

只导入需要的功能，减少打包体积。

```tsx
// ✅ 好的做法
import { ErrorBoundary } from '@yyc3/core';
import { formatDate } from '@yyc3/utils';

// ❌ 不推荐
import * as Core from '@yyc3/core';
import * as Utils from '@yyc3/utils';
```

### 2. 使用TypeScript

始终使用TypeScript以获得类型安全。

```tsx
// ✅ 好的做法
import type { AppError } from '@yyc3/types';
import { ErrorBoundary } from '@yyc3/core';

function handleError(error: AppError) {
  // 类型安全的错误处理
}

// ❌ 不推荐
function handleError(error: any) {
  // 失去了类型安全
}
```

### 3. 错误处理

使用ErrorBoundary包裹关键组件。

```tsx
// ✅ 好的做法
<ErrorBoundary fallback={<ErrorFallback />}>
  <MyComponent />
</ErrorBoundary>

// ❌ 不推荐
<MyComponent />  // 没有错误边界保护
```

### 4. 性能优化

使用useDebounce等Hooks优化性能。

```tsx
// ✅ 好的做法
const [input, setInput] = useState('');
const debouncedInput = useDebounce(input, 500);

useEffect(() => {
  // 使用防抖值进行搜索
  search(debouncedInput);
}, [debouncedInput]);

// ❌ 不推荐
const [input, setInput] = useState('');

useEffect(() => {
  // 每次输入都触发搜索
  search(input);
}, [input]);
```

### 5. 国际化

使用i18n包进行多语言支持。

```ts
// ✅ 好的做法
const t = createTranslator(messages);
const greeting = t('greeting', { name: userName });

// ❌ 不推荐
const greeting = `Hello, ${userName}!`;  // 硬编码
```

## 🐛 调试技巧

### 1. 启用详细日志

```ts
import { getErrorHandler } from '@yyc3/error-handling';

const handler = getErrorHandler({
  logLevel: 'debug',
  enableConsole: true,
});
```

### 2. 测试翻译

```ts
import { extractKeys, validateMessages } from '@yyc3/i18n';

const keys = extractKeys(messages);
const errors = validateMessages(messages);

console.log('所有翻译键:', keys);
console.log('翻译错误:', errors);
```

### 3. 检查存储

```ts
import { createIndexedDB } from '@yyc3/storage';

const db = createIndexedDB({ ... });

const count = await db.count('users');
console.log('用户数量:', count);
```

## 📖 相关文档

- [API文档](./API.md)
- [贡献指南](../CONTRIBUTING.md)
- [示例项目](../examples/)
- [包文档](../packages/)
