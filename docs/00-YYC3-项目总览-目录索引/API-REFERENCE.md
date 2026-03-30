# YYC3 Reusable Components - API文档

所有包的完整API参考。

## 📦 包索引

- [@yyc3/ui](#yyc3ui)
- [@yyc3/utils](#yyc3utils)
- [@yyc3/types](#yyc3types)
- [@yyc3/core](#yyc3core)
- [@yyc3/hooks](#yyc3hooks)
- [@yyc3/error-handling](#yyc3error-handling)
- [@yyc3/i18n](#yyc3i18n)
- [@yyc3/storage](#yyc3storage)

---

## @yyc3/ui

### Button

**位置**: `packages/ui/src/Button.tsx`

```tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

export function Button(props: ButtonProps): JSX.Element
```

**Props**:

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| variant | `'primary' \| 'secondary' \| 'ghost'` | `'primary'` | 按钮变体 |
| size | `'sm' \| 'md' \| 'lg'` | `'md'` | 按钮大小 |
| disabled | `boolean` | `false` | 是否禁用 |
| loading | `boolean` | `false` | 是否显示加载状态 |
| onClick | `() => void` | - | 点击事件 |
| children | `React.ReactNode` | - | 按钮内容 |

**示例**:

```tsx
<Button variant="primary" onClick={() => console.log('clicked')}>
  点击我
</Button>
```

---

### Card

**位置**: `packages/ui/src/Card.tsx`

```tsx
interface CardProps {
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

export function Card(props: CardProps): JSX.Element
```

**Props**:

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| className | `string` | - | 自定义类名 |
| style | `React.CSSProperties` | - | 自定义样式 |
| children | `React.ReactNode` | - | 卡片内容 |

**示例**:

```tsx
<Card>
  <h2>标题</h2>
  <p>内容</p>
</Card>
```

---

## @yyc3/utils

### 字符串处理

#### truncate

```ts
function truncate(str: string, length: number): string
```

截断字符串到指定长度。

**参数**:
- `str`: 要截断的字符串
- `length`: 最大长度

**返回**: 截断后的字符串

**示例**:

```ts
truncate('Hello World', 5); // "Hello..."
```

---

#### capitalize

```ts
function capitalize(str: string): string
```

首字母大写。

**参数**:
- `str`: 要处理的字符串

**返回**: 首字母大写的字符串

**示例**:

```ts
capitalize('hello'); // "Hello"
```

---

#### uuid

```ts
function uuid(): string
```

生成UUID v4。

**返回**: UUID字符串

**示例**:

```ts
const id = uuid(); // "550e8400-e29b-41d4-a716-446655440000"
```

---

### 数据处理

#### deepClone

```ts
function deepClone<T>(obj: T): T
```

深度克隆对象。

**类型参数**:
- `T`: 对象类型

**参数**:
- `obj`: 要克隆的对象

**返回**: 克隆后的对象

**示例**:

```ts
const original = { a: 1, b: { c: 2 } };
const cloned = deepClone(original);
cloned.b.c = 3; // original.b.c 仍然是 2
```

---

#### unique

```ts
function unique<T>(arr: T[]): T[]
```

数组去重。

**类型参数**:
- `T`: 数组元素类型

**参数**:
- `arr`: 要去重的数组

**返回**: 去重后的数组

**示例**:

```ts
unique([1, 2, 2, 3, 3, 3]); // [1, 2, 3]
```

---

### 日期处理

#### formatDate

```ts
function formatDate(date: Date, locale?: string): string
```

格式化日期。

**参数**:
- `date`: 要格式化的日期
- `locale`: 区域设置（默认: 'en-US'）

**返回**: 格式化后的日期字符串

**示例**:

```ts
formatDate(new Date(), 'zh-CN'); // "2024年3月26日"
```

---

#### getRelativeTime

```ts
function getRelativeTime(date: Date): string
```

获取相对时间。

**参数**:
- `date`: 要比较的日期

**返回**: 相对时间字符串（如 "just now", "1 hour ago"）

**示例**:

```ts
getRelativeTime(new Date()); // "just now"
```

---

### 颜色处理

#### hexToRgb

```ts
function hexToRgb(hex: string): { r: number; g: number; b: number }
```

十六进制颜色转RGB。

**参数**:
- `hex`: 十六进制颜色值（如 #ffffff）

**返回**: RGB颜色对象

**示例**:

```ts
hexToRgb('#ffffff'); // { r: 255, g: 255, b: 255 }
```

---

#### isDarkColor

```ts
function isDarkColor(hex: string): boolean
```

检测颜色是否为深色。

**参数**:
- `hex`: 十六进制颜色值

**返回**: 是否为深色

**示例**:

```ts
isDarkColor('#000000'); // true
isDarkColor('#ffffff'); // false
```

---

## @yyc3/core

### ErrorBoundary

**位置**: `packages/core/src/ErrorBoundary.tsx`

```tsx
interface ErrorBoundaryProps {
  fallback?: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  children: React.ReactNode;
}

export function ErrorBoundary(props: ErrorBoundaryProps): JSX.Element
```

**Props**:

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| fallback | `React.ReactNode` | - | 错误发生时显示的内容 |
| onError | `(error: Error, errorInfo: React.ErrorInfo) => void` | - | 错误回调 |
| children | `React.ReactNode` | - | 子组件 |

**示例**:

```tsx
<ErrorBoundary fallback={<div>出错了！</div>}>
  <MyComponent />
</ErrorBoundary>
```

---

### GlassCard

**位置**: `packages/core/src/GlassCard.tsx`

```tsx
interface GlassCardProps {
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

export function GlassCard(props: GlassCardProps): JSX.Element
```

**Props**:

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| className | `string` | - | 自定义类名 |
| style | `React.CSSProperties` | - | 自定义样式 |
| children | `React.ReactNode` | - | 卡片内容 |

**示例**:

```tsx
<GlassCard style={{ padding: '20px' }}>
  <h2>标题</h2>
  <p>内容</p>
</GlassCard>
```

---

### FadeIn

**位置**: `packages/core/src/FadeIn.tsx`

```tsx
interface FadeInProps {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function FadeIn(props: FadeInProps): JSX.Element
```

**Props**:

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| children | `React.ReactNode` | - | 要动画的子元素 |
| duration | `number` | `500` | 动画持续时间（毫秒） |
| delay | `number` | `0` | 动画延迟（毫秒） |
| className | `string` | - | 自定义类名 |
| style | `React.CSSProperties` | - | 自定义样式 |

**示例**:

```tsx
<FadeIn duration={1000} delay={200}>
  <div>延迟200ms后淡入，持续1秒</div>
</FadeIn>
```

---

## @yyc3/hooks

### useToggle

```ts
function useToggle(initial: boolean): [boolean, () => void]
```

布尔值切换Hook。

**参数**:
- `initial`: 初始值

**返回**: `[state, toggle]` - 当前状态和切换函数

**示例**:

```tsx
const [isOpen, toggleOpen] = useToggle(false);
// toggleOpen() 切换 isOpen 的值
```

---

### useLocalStorage

```ts
function useLocalStorage<T>(key: string, initial: T): [T, (value: T | ((prev: T) => T)) => void]
```

本地存储Hook。

**类型参数**:
- `T`: 存储值的类型

**参数**:
- `key`: localStorage键名
- `initial`: 初始值

**返回**: `[value, setValue]` - 当前值和设置函数

**示例**:

```tsx
const [count, setCount] = useLocalStorage('count', 0);
setCount(count + 1);
```

---

### useDebounce

```ts
function useDebounce<T>(value: T, delay: number): T
```

防抖Hook。

**类型参数**:
- `T`: 值类型

**参数**:
- `value`: 要防抖的值
- `delay`: 延迟时间（毫秒）

**返回**: 防抖后的值

**示例**:

```tsx
const [input, setInput] = useState('');
const debouncedInput = useDebounce(input, 500);
```

---

### useWindowSize

```ts
function useWindowSize(): { width: number; height: number }
```

窗口尺寸Hook。

**返回**: `{ width, height }` - 窗口宽度和高度

**示例**:

```tsx
const { width, height } = useWindowSize();
console.log(`窗口: ${width} x ${height}`);
```

---

## @yyc3/error-handling

### getErrorHandler

```ts
function getErrorHandler(config?: ErrorHandlerConfig): ErrorHandler
```

获取错误处理器实例。

**参数**:
- `config`: 配置对象

**返回**: ErrorHandler实例

---

### captureError

```ts
function captureError(error: Error, context?: string): void
```

捕获错误。

**参数**:
- `error`: 错误对象
- `context`: 错误上下文

---

### trySafe

```ts
async function trySafe<T>(fn: () => Promise<T>, context?: string): Promise<[T | null, Error | null]>
```

安全异步执行包装器。

**参数**:
- `fn`: 要执行的异步函数
- `context`: 上下文标识

**返回**: `[result, error]` - 结果和错误

**示例**:

```ts
const [data, error] = await trySafe(
  async () => await fetch('/api/data'),
  'API-Data'
);

if (error) {
  console.error('操作失败:', error);
}
```

---

## @yyc3/i18n

### createTranslator

```ts
function createTranslator(messages: Record<string, string>): (key: string, params?: Record<string, any>) => string
```

创建翻译器函数。

**参数**:
- `messages`: 翻译消息对象

**返回**: 翻译函数

**示例**:

```ts
const t = createTranslator({
  welcome: '欢迎使用',
  greeting: '你好, {name}!',
});

console.log(t('welcome')); // "欢迎使用"
console.log(t('greeting', { name: '张三' })); // "你好, 张三!"
```

---

### mergeMessages

```ts
function mergeMessages(...messages: Record<string, string>[]): Record<string, string>
```

合并翻译消息。

**参数**:
- `messages`: 多个消息对象

**返回**: 合并后的消息对象

---

### validateMessages

```ts
function validateMessages(messages: Record<string, string>): string[]
```

验证翻译消息。

**参数**:
- `messages`: 消息对象

**返回**: 错误信息数组

---

## @yyc3/storage

### createIndexedDB

```ts
function createIndexedDB(config: IndexedDBConfig): IndexedDBWrapper
```

创建IndexedDB实例。

**参数**:
- `config`: 配置对象

```ts
interface IndexedDBConfig {
  name: string;
  version: number;
  stores: Array<{
    name: string;
    keyPath: string;
    indexes?: Array<{ name: string; keyPath: string }>;
  }>;
}
```

**返回**: IndexedDB包装器实例

**示例**:

```ts
const db = createIndexedDB({
  name: 'appDatabase',
  version: 1,
  stores: [{ name: 'users', keyPath: 'id' }],
});

await db.put('users', { id: '1', name: 'John' });
const user = await db.get('users', '1');
```

---

### createBroadcastChannel

```ts
function createBroadcastChannel(name: string, callback: (data: unknown) => void): BroadcastChannelWrapper
```

创建BroadcastChannel实例。

**参数**:
- `name`: 频道名称
- `callback`: 消息接收回调

**返回**: BroadcastChannel包装器

**示例**:

```ts
const channel = createBroadcastChannel('sync', (data) => {
  console.log('收到消息:', data);
});

channel.send('Hello from other tab!');
channel.close();
```

---

## 📖 更多信息

- [使用指南](./USAGE.md)
- [贡献指南](../CONTRIBUTING.md)
- [变更日志](../CHANGELOG.md)
- [主README](../README.md)
