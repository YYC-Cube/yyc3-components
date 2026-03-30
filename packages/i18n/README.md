# @yyc3/i18n

YYC3可复用组件库 - 国际化系统

## 📦 概述

`@yyc3/i18n` 提供了一套轻量级的国际化工具，用于管理多语言翻译。

## 🎯 特性

- ✅ **嵌套key支持** - 支持点分key访问嵌套翻译
- ✅ **模板变量** - 支持模板变量替换
- ✅ **翻译合并** - 支持合并基础和自定义翻译
- ✅ **翻译验证** - 验证翻译完整性
- ✅ **键提取** - 提取所有翻译键
- ✅ **一致性检查** - 比较两个翻译的一致性
- ✅ **TypeScript支持** - 完整类型定义
- ✅ **零依赖** - 纯TypeScript实现

## 📋 核心功能

### 1. createTranslator - 创建翻译器

创建类型安全的翻译函数。

**功能**:

- 嵌套key支持
- 模板变量替换
- 类型安全

**使用示例**:

```ts
import { createTranslator } from '@yyc3/i18n';

const messages = {
  welcome: '欢迎使用',
  greeting: '你好, {name}!',
  nav: {
    home: '首页',
    settings: '设置',
  },
};

const t = createTranslator(messages);

// 基础翻译
console.log(t('welcome')); // "欢迎使用"

// 模板变量
console.log(t('greeting', { name: '张三' })); // "你好, 张三!"

// 嵌套key
console.log(t('nav.home')); // "首页"
console.log(t('nav.settings')); // "设置"
```

### 2. mergeMessages - 合并翻译

合并基础翻译和自定义翻译。

**功能**:

- 深度合并
- 保留基础翻译
- 覆盖自定义翻译

**使用示例**:

```ts
import { mergeMessages } from '@yyc3/i18n';

const baseMessages = {
  common: {
    ok: '确定',
    cancel: '取消',
  },
  nav: {
    home: '首页',
  },
};

const customMessages = {
  common: {
    ok: '确认', // 覆盖
  },
  nav: {
    settings: '设置', // 新增
  },
};

const merged = mergeMessages(baseMessages, customMessages);
// merged.common.ok === '确认'
// merged.common.cancel === '取消'
// merged.nav.home === '首页'
// merged.nav.settings === '设置'
```

### 3. validateMessages - 验证翻译

验证翻译消息的完整性。

**功能**:

- 检查必需键是否存在
- 验证值类型

**使用示例**:

```ts
import { validateMessages } from '@yyc3/i18n';

const messages = {
  welcome: '欢迎使用',
  greeting: '你好, {name}!',
};

const result = validateMessages(messages, ['welcome', 'greeting']);
// result.valid === true
// result.missing === []

const incomplete = {
  welcome: '欢迎使用',
};

const result2 = validateMessages(incomplete, ['welcome', 'greeting']);
// result2.valid === false
// result2.missing === ['greeting']
```

### 4. extractKeys - 提取翻译键

提取所有翻译键。

**功能**:

- 递归提取所有键
- 支持前缀过滤
- 保持嵌套结构

**使用示例**:

```ts
import { extractKeys } from '@yyc3/i18n';

const messages = {
  common: {
    ok: '确定',
    cancel: '取消',
  },
  nav: {
    home: '首页',
    settings: '设置',
  },
};

const keys = extractKeys(messages);
// keys === ['common.ok', 'common.cancel', 'nav.home', 'nav.settings']

const navKeys = extractKeys(messages, 'nav');
// navKeys === ['nav.home', 'nav.settings']
```

### 5. compareMessages - 比较翻译

比较两个翻译消息的一致性。

**功能**:

- 找出仅在一个翻译中存在的键
- 找出共有的键

**使用示例**:

```ts
import { compareMessages } from '@yyc3/i18n';

const zhCN = {
  welcome: '欢迎使用',
  nav: {
    home: '首页',
    settings: '设置',
  },
};

const enUS = {
  welcome: 'Welcome',
  nav: {
    home: 'Home',
  },
};

const result = compareMessages(zhCN, enUS);
// result.onlyIn1 === ['nav.settings']
// result.onlyIn2 === []
// result.common === ['welcome', 'nav.home']
```

### 6. getNestedValue & interpolate - 底层工具

底层翻译工具函数。

**使用示例**:

```ts
import { getNestedValue, interpolate } from '@yyc3/i18n';

const messages = {
  nav: {
    home: '首页',
  },
};

// 获取嵌套值
const value = getNestedValue(messages, 'nav.home'); // "首页"

// 模板变量替换
const template = '你好, {name}!';
const result = interpolate(template, { name: '张三' }); // "你好, 张三!"
```

## 📦 安装

```bash
npm install @yyc3/i18n
# 或
yarn add @yyc3/i18n
# 或
pnpm add @yyc3/i18n
```

## 🚀 快速开始

### 基础使用

```ts
import { createTranslator } from '@yyc3/i18n';

const messages = {
  welcome: '欢迎使用',
  greeting: '你好, {name}!',
  nav: {
    home: '首页',
    settings: '设置',
  },
};

const t = createTranslator(messages);

// 使用翻译
console.log(t('welcome'));
console.log(t('greeting', { name: '张三' }));
console.log(t('nav.home'));
```

### 与React集成

```tsx
import { createTranslator } from '@yyc3/i18n';
import { useLocalStorage } from '@yyc3/hooks';

const zhCN = {
  welcome: '欢迎使用',
  greeting: '你好, {name}!',
};

const enUS = {
  welcome: 'Welcome',
  greeting: 'Hello, {name}!',
};

const locales = {
  'zh-CN': zhCN,
  'en-US': enUS,
};

function App() {
  const [locale, setLocale] = useLocalStorage('locale', 'zh-CN');
  const t = createTranslator(locales[locale as keyof typeof locales]);

  return (
    <div>
      <h1>{t('welcome')}</h1>
      <p>{t('greeting', { name: 'World' })}</p>
      <button onClick={() => setLocale('zh-CN')}>中文</button>
      <button onClick={() => setLocale('en-US')}>English</button>
    </div>
  );
}
```

### 翻译验证

```ts
import { validateMessages, extractKeys } from '@yyc3/i18n';

// 验证翻译完整性
const requiredKeys = ['welcome', 'greeting', 'nav.home'];
const result = validateMessages(messages, requiredKeys);

if (!result.valid) {
  console.warn('缺少翻译键:', result.missing);
}

// 提取所有翻译键
const allKeys = extractKeys(messages);
console.log('所有翻译键:', allKeys);
```

### 多语言一致性检查

```ts
import { compareMessages } from '@yyc3/i18n';

// 检查多语言翻译的一致性
const result = compareMessages(zhCN, enUS);

if (result.onlyIn1.length > 0) {
  console.warn('仅存在于中文的键:', result.onlyIn1);
}

if (result.onlyIn2.length > 0) {
  console.warn('仅存在于英文的键:', result.onlyIn2);
}
```

## 📊 API 参考

| 函数                                       | 参数                                     | 返回类型                     | 说明         |
| ------------------------------------------ | ---------------------------------------- | ---------------------------- | ------------ |
| `createTranslator(messages)`               | `I18nMessages`                           | `(key, vars?) => string`     | 创建翻译函数 |
| `mergeMessages(base, override)`            | `T, Partial<T>`                          | `T`                          | 合并翻译     |
| `validateMessages(messages, requiredKeys)` | `T, string[]`                            | `{valid, missing}`           | 验证翻译     |
| `extractKeys(messages, prefix?)`           | `T, string`                              | `string[]`                   | 提取所有键   |
| `compareMessages(messages1, messages2)`    | `T, T`                                   | `{onlyIn1, onlyIn2, common}` | 比较翻译     |
| `getNestedValue(messages, path)`           | `T, string`                              | `string`                     | 获取嵌套值   |
| `interpolate(template, vars)`              | `string, Record<string, string\|number>` | `string`                     | 替换模板变量 |

## 🎨 最佳实践

### 1. 翻译文件组织

建议使用嵌套对象结构组织翻译：

```ts
const messages = {
  common: {
    ok: '确定',
    cancel: '取消',
    delete: '删除',
  },
  user: {
    login: '登录',
    logout: '退出',
    profile: '个人资料',
  },
  nav: {
    home: '首页',
    settings: '设置',
  },
};
```

### 2. 类型安全

定义翻译类型以确保类型安全：

```ts
import type { I18nMessages } from '@yyc3/types';

type MyMessages = {
  welcome: string;
  greeting: string;
  nav: {
    home: string;
    settings: string;
  };
} & I18nMessages;

const messages: MyMessages = {
  welcome: '欢迎使用',
  greeting: '你好, {name}!',
  nav: {
    home: '首页',
    settings: '设置',
  },
};

const t = createTranslator(messages); // 类型安全
```

### 3. 翻译验证

在生产环境中验证翻译完整性：

```ts
import { validateMessages, extractKeys } from '@yyc3/i18n';

// 提取所有键作为必需键
const allKeys = extractKeys(messages);
const result = validateMessages(messages, allKeys);

if (!result.valid) {
  console.error('翻译不完整:', result.missing);
  throw new Error('翻译验证失败');
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

- **代码量**: ~200行
- **函数数量**: 7个
- **TypeScript**: 100%覆盖

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 依赖

- `@yyc3/types`: workspace:\* (dependency)

## 📝 许可证

MIT
