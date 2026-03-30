# @yyc3/utils

> YYC3工具函数库 - 通用JavaScript/TypeScript工具函数

[![Version](https://img.shields.io/npm/v/@yyc3/utils.svg)](https://www.npmjs.com/package/@yyc3/utils)
[![License](https://img.shields.io/npm/l/@yyc3/utils.svg)](LICENSE)

## 简介

@yyc3/utils 是从 [AI Family](https://github.com/YYC-Cube/ai-family) 项目中提取的通用工具函数库。它提供了开箱即用的JavaScript/TypeScript工具函数,涵盖颜色、日期、数据、字符串等常用场景。

### 特点

✅ **零依赖** - 纯JavaScript/TypeScript实现
✅ **TypeScript** - 完整的类型定义
✅ **Tree-shaking** - 按需导入,减少Bundle大小
✅ **生产就绪** - 在AI Family项目中经过验证
✅ **全面覆盖** - 涵盖常用工具函数

## 安装

```bash
# 使用npm
npm install @yyc3/utils

# 使用yarn
yarn add @yyc3/utils

# 使用pnpm
pnpm add @yyc3/utils
```

## 快速开始

### 颜色处理

```ts
import { hexToRgb, isDarkColor, getContrastColor } from '@yyc3/utils';

// 十六进制转RGB
const rgb = hexToRgb('#00d4ff'); // "0,212,255"

// 判断深色
const dark = isDarkColor('#000000'); // true

// 获取对比色
const contrast = getContrastColor('#ffffff'); // "#000000"
```

### 日期处理

```ts
import { getGreeting, formatDate, getRelativeTime, isToday } from '@yyc3/utils';

// 获取问候语
const greeting = getGreeting(); // { text: "上午好，精力充沛", emoji: "morning" }

// 格式化日期
const formatted = formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss'); // "2026-03-26 10:30:00"

// 相对时间
const relative = getRelativeTime(Date.now() - 3600000); // "1小时前"

// 判断是否为今天
const today = isToday(new Date()); // true
```

### 数据处理

```ts
import { getMember, unique, groupBy, chunk, deepClone } from '@yyc3/utils';

// 根据ID查找
const member = getMember('user-001', users); // { id: 'user-001', ... }

// 数组去重
const uniqueUsers = unique(users, 'id'); // 去重后的用户数组

// 数组分组
const grouped = groupBy(items, 'category'); // { 'category1': [...], 'category2': [...] }

// 数组分块
const chunks = chunk(array, 10); // [[...10项], [...10项], ...]

// 深度克隆
const cloned = deepClone(obj); // 克隆对象
```

### 字符串处理

```ts
import { truncate, capitalize, uuid, slugify, interpolate } from '@yyc3/utils';

// 截断字符串
const truncated = truncate('这是一个很长的字符串', 10); // "这是一个很..."

// 首字母大写
const capitalized = capitalize('hello'); // "Hello"

// 生成UUID
const id = uuid(); // "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx"

// 生成slug
const slug = slugify('Hello World'); // "hello-world"

// 模板替换
const result = interpolate('Hello {name}', { name: 'World' }); // "Hello World"
```

## API文档

### 颜色处理

| 函数                    | 说明           | 返回值                   |
| ----------------------- | -------------- | ------------------------ |
| `hexToRgb(hex)`         | 十六进制转RGB  | `string`                 |
| `hexToRgba(hex, alpha)` | 十六进制转RGBA | `string`                 |
| `isDarkColor(hex)`      | 判断是否为深色 | `boolean`                |
| `getContrastColor(hex)` | 获取对比色     | `"#000000" \| "#ffffff"` |

### 日期处理

| 函数                       | 说明         | 返回值                |
| -------------------------- | ------------ | --------------------- |
| `getGreeting()`            | 获取问候语   | `{ text, emoji }`     |
| `getHourlyCare(members)`   | 整点关爱播报 | `{ member, message }` |
| `formatDate(date, format)` | 格式化日期   | `string`              |
| `getRelativeTime(date)`    | 相对时间     | `string`              |
| `isToday(date)`            | 是否为今天   | `boolean`             |
| `isThisWeek(date)`         | 是否为本周   | `boolean`             |

### 数据处理

| 函数                               | 说明         | 返回值                |
| ---------------------------------- | ------------ | --------------------- |
| `getMember(id, members)`           | 根据ID查找   | `T \| undefined`      |
| `getDataSummary(members, options)` | 数据统计摘要 | `DataSummary`         |
| `deepClone<T>(obj)`                | 深度克隆     | `T`                   |
| `unique<T>(arr, key)`              | 数组去重     | `T[]`                 |
| `groupBy<T>(arr, key)`             | 数组分组     | `Record<string, T[]>` |
| `chunk<T>(arr, size)`              | 数组分块     | `T[][]`               |

### 字符串处理

| 函数                                     | 说明         | 返回值    |
| ---------------------------------------- | ------------ | --------- |
| `truncate(str, maxLength, suffix)`       | 截断字符串   | `string`  |
| `capitalize(str)`                        | 首字母大写   | `string`  |
| `camelToKebab(str)`                      | 驼峰转短横线 | `string`  |
| `kebabToCamel(str)`                      | 短横线转驼峰 | `string`  |
| `randomString(length, chars)`            | 随机字符串   | `string`  |
| `uuid()`                                 | 生成UUID     | `string`  |
| `interpolate(template, vars)`            | 模板替换     | `string`  |
| `escapeHtml(str)`                        | 转义HTML     | `string`  |
| `unescapeHtml(str)`                      | 反转义HTML   | `string`  |
| `isBlank(str)`                           | 判断空白     | `boolean` |
| `removeWhitespace(str)`                  | 移除空白     | `string`  |
| `truncateByWords(str, maxWords, suffix)` | 按单词截断   | `string`  |
| `slugify(str)`                           | 生成slug     | `string`  |

## 开发

```bash
# 克隆仓库
git clone https://github.com/YYC-Cube/yyc3-reusable-components.git

# 进入目录
cd yyc3-reusable-components/packages/utils

# 安装依赖
pnpm install

# 开发模式
pnpm dev

# 构建
pnpm build

# 测试
pnpm test
```

## 许可证

[MIT](LICENSE)

## 作者

YYC3 Team <admin@0379.email>

## 链接

- [GitHub](https://github.com/YYC-Cube/yyc3-reusable-components)
- [AI Family](https://github.com/YYC-Cube/ai-family)
