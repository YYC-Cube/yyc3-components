# @yyc3/hooks

YYC3可复用组件库 - 自定义Hooks包

## 📦 概述

`@yyc3/hooks` 提供了一套实用的React自定义Hooks，用于增强React应用的功能。

## 🎯 特性

- ✅ **国际化** - 完整的i18n解决方案
- ✅ **本地存储** - 简化的localStorage操作
- ✅ **防抖** - 优化性能的防抖Hook
- ✅ **媒体查询** - 响应式设计支持
- ✅ **切换状态** - 简化的布尔值状态管理
- ✅ **点击外部检测** - UI交互增强
- ✅ **窗口尺寸** - 响应式布局支持
- ✅ **TypeScript支持** - 完整类型定义
- ✅ **SSR安全** - 服务端渲染兼容

## 📦 Hooks列表

### 1. useI18n - 国际化

完整的国际化解决方案，支持动态切换语言。

**功能**:
- localStorage持久化语言偏好
- React Context全局共享
- 动态切换无需刷新
- 支持嵌套key和模板变量

**使用示例**:

```tsx
import { I18nProvider, useI18n } from "@yyc3/hooks";

const messages = {
  "zh-CN": {
    welcome: "欢迎使用",
    greeting: "你好, {name}!",
  },
  "en-US": {
    welcome: "Welcome",
    greeting: "Hello, {name}!",
  },
};

function App() {
  return (
    <I18nProvider messages={messages}>
      <Child />
    </I18nProvider>
  );
}

function Child() {
  const { t, locale, setLocale, availableLocales } = useI18n();

  return (
    <div>
      <p>{t("welcome")}</p>
      <p>{t("greeting", { name: "World" })}</p>
      <select value={locale} onChange={(e) => setLocale(e.target.value as any)}>
        {availableLocales.map((loc) => (
          <option key={loc.code} value={loc.code}>
            {loc.nativeLabel}
          </option>
        ))}
      </select>
    </div>
  );
}
```

**Props (I18nProvider)**:

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `children` | `ReactNode` | - | 子组件 |
| `defaultLocale` | `Locale` | `"zh-CN"` | 默认语言 |
| `messages` | `Record<Locale, I18nMessages>` | - | 翻译消息 |
| `availableLocales` | `LocaleInfo[]` | 中英文 | 可用语言列表 |
| `storageKey` | `string` | `"yyc3_locale"` | localStorage键名 |

**返回值 (useI18n)**:

| 属性 | 类型 | 说明 |
|------|------|------|
| `locale` | `Locale` | 当前语言 |
| `setLocale` | `(locale: Locale) => void` | 设置语言 |
| `t` | `(key: string, vars?) => string` | 翻译函数 |
| `availableLocales` | `LocaleInfo[]` | 可用语言列表 |

### 2. useLocalStorage - 本地存储

简化的localStorage操作Hook，支持自动同步和类型推断。

**功能**:
- 自动同步localStorage
- 支持任意类型的数据
- SSR安全
- 支持类型推断
- 监听其他标签页变化

**使用示例**:

```tsx
import { useLocalStorage } from "@yyc3/hooks";

function App() {
  const [count, setCount, removeCount] = useLocalStorage("count", 0);
  const [user, setUser, removeUser] = useLocalStorage("user", null);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount((c) => c + 1)}>+1</button>
      <button onClick={removeCount}>Reset</button>
    </div>
  );
}
```

**参数**:

| 参数 | 类型 | 说明 |
|------|------|------|
| `key` | `string` | localStorage键名 |
| `defaultValue` | `T` | 默认值 |

**返回值**:

| 索引 | 类型 | 说明 |
|------|------|------|
| 0 | `T` | 当前值 |
| 1 | `(value: T \| ((prev: T) => T)) => void` | 设置值 |
| 2 | `() => void` | 删除值 |

### 3. useDebounce - 防抖

防抖Hook，延迟执行函数。

**功能**:
- 延迟执行函数
- 支持取消
- 支持立即执行

**使用示例**:

```tsx
import { useDebounce, useDebouncedCallback } from "@yyc3/hooks";

function Search() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 500);

  const handleClick = useDebouncedCallback(
    () => {
      console.log("Clicked!");
    },
    300,
    { leading: true }
  );

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />
      <p>Debounced: {debouncedQuery}</p>
      <button onClick={handleClick}>Click me</button>
    </div>
  );
}
```

### 4. useMediaQuery - 媒体查询

监听媒体查询变化的Hook。

**功能**:
- 监听媒体查询变化
- SSR安全
- 支持自定义查询

**使用示例**:

```tsx
import { useMediaQuery, useIsMobile, useIsDarkMode } from "@yyc3/hooks";

function Responsive() {
  const isMobile = useIsMobile();
  const isDarkMode = useIsDarkMode();
  const isLarge = useMediaQuery("(min-width: 1200px)");

  return (
    <div>
      <p>Mobile: {isMobile ? "Yes" : "No"}</p>
      <p>Dark Mode: {isDarkMode ? "Yes" : "No"}</p>
      <p>Large Screen: {isLarge ? "Yes" : "No"}</p>
    </div>
  );
}
```

**可用的Hooks**:
- `useMediaQuery(query: string)` - 自定义查询
- `useIsMobile()` - 移动设备 (max-width: 768px)
- `useIsTablet()` - 平板设备 (769px-1024px)
- `useIsDesktop()` - 桌面设备 (min-width: 1025px)
- `useIsDarkMode()` - 深色模式
- `useIsReducedMotion()` - 减少动画模式

### 5. useToggle - 切换状态

简化的布尔值状态管理Hook。

**功能**:
- 简单的布尔值状态管理
- 提供便捷的切换方法

**使用示例**:

```tsx
import { useToggle } from "@yyc3/hooks";

function Modal() {
  const [isOpen, { toggle, setTrue, setFalse }] = useToggle(false);

  return (
    <div>
      <button onClick={toggle}>
        {isOpen ? "Close" : "Open"} Modal
      </button>
      <button onClick={setTrue}>Open</button>
      <button onClick={setFalse}>Close</button>

      {isOpen && <div>Modal content</div>}
    </div>
  );
}
```

**返回值**:

| 索引 | 类型 | 说明 |
|------|------|------|
| 0 | `boolean` | 当前值 |
| 1 | `{ toggle, setTrue, setFalse }` | 操作方法 |

### 6. useClickOutside - 点击外部检测

检测点击是否在元素外部的Hook。

**功能**:
- 检测点击是否在元素外部
- 支持多个ref
- 支持自定义事件

**使用示例**:

```tsx
import { useClickOutside } from "@yyc3/hooks";
import { useRef } from "react";

function Dropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useClickOutside(ref, () => setIsOpen(false), isOpen);

  return (
    <div ref={ref}>
      <button onClick={() => setIsOpen(!isOpen)}>Toggle</button>
      {isOpen && (
        <div className="dropdown">
          <p>Menu items...</p>
        </div>
      )}
    </div>
  );
}
```

**参数**:

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `ref` | `RefObject \| RefObject[]` | - | 元素引用 |
| `handler` | `(event) => void` | - | 点击外部时的回调 |
| `active` | `boolean` | `true` | 是否激活检测 |

### 7. useWindowSize - 窗口尺寸

实时监听窗口尺寸变化的Hook。

**功能**:
- 实时监听窗口尺寸变化
- SSR安全
- 提供宽高信息

**使用示例**:

```tsx
import { useWindowSize, useWindowWidth, useWindowHeight } from "@yyc3/hooks";

function WindowInfo() {
  const { width, height } = useWindowSize();
  const windowWidth = useWindowWidth();
  const windowHeight = useWindowHeight();

  return (
    <div>
      <p>Width: {width}px</p>
      <p>Height: {height}px</p>
      <p>Window Width: {windowWidth}px</p>
      <p>Window Height: {windowHeight}px</p>
    </div>
  );
}
```

**可用的Hooks**:
- `useWindowSize()` - 返回 `{ width, height }`
- `useWindowWidth()` - 返回窗口宽度
- `useWindowHeight()` - 返回窗口高度

## 📦 安装

```bash
npm install @yyc3/hooks
# 或
yarn add @yyc3/hooks
# 或
pnpm add @yyc3/hooks
```

## 🚀 快速开始

```tsx
import { I18nProvider, useLocalStorage, useMediaQuery } from "@yyc3/hooks";

function App() {
  return (
    <I18nProvider messages={{ "zh-CN": {}, "en-US": {} }}>
      <Content />
    </I18nProvider>
  );
}

function Content() {
  const [theme, setTheme] = useLocalStorage("theme", "light");
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <div>
      <p>Theme: {theme}</p>
      <p>Mobile: {isMobile ? "Yes" : "No"}</p>
    </div>
  );
}
```

## 🎨 最佳实践

### 1. 国际化消息组织

建议使用嵌套对象结构组织翻译消息：

```tsx
const messages = {
  "zh-CN": {
    common: {
      ok: "确定",
      cancel: "取消",
      delete: "删除",
    },
    user: {
      login: "登录",
      logout: "退出",
      profile: "个人资料",
    },
  },
  "en-US": {
    common: {
      ok: "OK",
      cancel: "Cancel",
      delete: "Delete",
    },
    user: {
      login: "Login",
      logout: "Logout",
      profile: "Profile",
    },
  },
};

// 使用
t("common.ok");
t("user.login");
```

### 2. 防抖使用场景

```tsx
// 搜索输入
const debouncedQuery = useDebounce(query, 300);
useEffect(() => {
  search(debouncedQuery);
}, [debouncedQuery]);

// 按钮点击防抖
const handleClick = useDebouncedCallback(
  () => submitForm(),
  1000,
  { leading: true }
);
```

### 3. 响应式设计

```tsx
function ResponsiveComponent() {
  const isMobile = useIsMobile();
  const isDesktop = useIsDesktop();

  if (isMobile) {
    return <MobileLayout />;
  }

  if (isDesktop) {
    return <DesktopLayout />;
  }

  return <TabletLayout />;
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

- **Hooks数量**: 7个
- **代码量**: ~500行
- **TypeScript**: 100%覆盖
- **测试覆盖**: 计划中

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 依赖

- `react`: >=18.0.0 (peer dependency)
- `@yyc3/types`: workspace:* (dependency)

## 📝 许可证

MIT
