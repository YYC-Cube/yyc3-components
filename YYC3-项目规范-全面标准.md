---
file: YYC3-项目规范-全面标准.md
description: YYC³ 可复用组件库 · 全局项目规范标准（命名 + 代码标头 + 代码风格 + 结构 + DevOps + 文档 + 质量保障）
author: YanYuCloudCube Team
version: v1.0.0
created: 2026-03-30
updated: 2026-03-30
status: active
tags: [standard],[naming],[code-style],[architecture],[devops],[documentation],[quality]
checksum: pending
reviewers: []
changelog:
  - { version: "v1.0.0", date: "2026-03-30", author: "YanYuCloudCube Team", note: "合并代码标准与命名规范，建立全面性项目规范标准" }
---

> ***YanYuCloudCube***
> *言启象限 | 语枢未来*
> ***Words Initiate Quadrants, Language Serves as Core for Future***
> *万象归元于云枢 | 深栈智启新纪元*
> ***All things converge in cloud pivot; Deep stacks ignite a new era of intelligence***

---

# YYC³ 可复用组件库 · 全局项目规范标准

## 总纲

### 核心理念

| 体系 | 内容 |
|------|------|
| **五高架构** | 高可用 · 高性能 · 高安全 · 高扩展 · 高智能 |
| **五标体系** | 标准化 · 规范化 · 自动化 · 可视化 · 智能化 |
| **五化转型** | 流程化 · 数字化 · 生态化 · 工具化 · 服务化 |
| **五维评估** | 时间维 · 空间维 · 属性维 · 事件维 · 关联维 |

### 适用范围

本规范适用于 YYC³ 可复用组件库（`yyc3-reusable-components`）及其所有子包，包括但不限于：

- **代码文件**：`.ts` `.tsx` `.js` `.jsx` `.css` `.scss`
- **配置文件**：`vite.config.ts` `tsup.config.ts` `.eslintrc.js` 等
- **文档文件**：`.md` `.mdx`
- **测试文件**：`.test.ts` `.test.tsx` `.spec.ts`
- **Electron 文件**：主进程、预加载脚本

### 版本管理

本规范遵循语义化版本（SemVer），变更记录维护于标头 `changelog` 字段：

| 版本段 | 含义 | 示例 |
|--------|------|------|
| MAJOR | 不兼容的规范变更 | v2.0.0 |
| MINOR | 向下兼容的规范新增 | v1.1.0 |
| PATCH | 规范修正/补充 | v1.0.1 |

### 规范层级

```
🔴 强制（MUST）     — 违反将导致 CI 失败或代码审查不通过
🟡 推荐（SHOULD）   — 强烈建议遵循，特殊情况可豁免
🟢 参考（MAY）      — 最佳实践参考，团队可根据场景选用
```

---

## 第一章 命名规范

### 1.1 文档命名

#### 1.1.1 项目级文档（`/docs/`）

**目录命名格式**：`{序号}-{阶段}-{功能}-{子功能}`

| 字段 | 规则 | 示例 |
|------|------|------|
| 序号 | 2 位数字（00-99） | `00` `01` `12` |
| 阶段 | 固定阶段名 | 项目规划、项目开发、项目测试 |
| 功能 | 简短中文描述 | 项目总览、代码标头 |
| 子功能 | 可选，进一步细分 | 目录索引、启动阶段 |

**标准目录示例**：

```
00-YYC3-项目总览-目录索引/
01-YYC3-项目规划-启动阶段/
02-YYC3-项目规划-设计阶段/
03-YYC3-项目开发-实施阶段/
04-YYC3-项目测试-审核阶段/
05-YYC3-项目部署-文档闭环/
06-YYC3-项目运营-维护阶段/
07-YYC3-项目合规-安全保障/
08-YYC3-项目整合-实施阶段/
09-YYC3-项目资产-知识管理/
10-YYC3-项目模版-标准规范/
11-YYC3-智能演进-优化阶段/
12-YYC3-用户指南-操作手册/
```

**文件命名格式**：`{序号}-{项目}-{功能}-{描述}.md`

| 字段 | 规则 | 示例 |
|------|------|------|
| 序号 | 3 位数字（001-999） | `001` `002` |
| 项目 | CP-IM | CloudPivot Intelli-Matrix |
| 功能 | 简短中文描述 | 项目总览索引 |
| 描述 | 详细中文描述 | 项目总览手册 |

**标准规范文档命名格式**：`YYC3-{功能}-{描述}.md`

```
YYC3-项目规范-全面标准.md
YYC3-代码标头规范标准.md
YYC3-项目多维检测审查报告.md
```

#### 1.1.2 应用级文档（`/src/app/docs/`）

**命名格式**：`{功能}-{类型}.ts`

| 类型后缀 | 用途 |
|----------|------|
| `REFERENCE` | API/组件参考文档 |
| `GUIDE` | 开发/设计指南 |
| `HANDOFF` | 开发者交接文档 |
| `REPORT` | 审核/审计报告 |
| `PLAN` | 对齐/执行计划 |
| `TEST` | 测试规范 |
| `AUDIT` | 审计报告 |

```
API-REFERENCE.ts
COMPONENT-REFERENCE.ts
DEVELOPER-HANDOFF.ts
TESTING-GUIDE.ts
ALIGNMENT-PLAN.ts
FINAL-AUDIT-REPORT.ts
```

#### 1.1.3 根目录文档

根目录仅保留以下标准文档，其余报告类文档应归档至 `docs/` 对应目录：

| 文件 | 用途 | 状态 |
|------|------|------|
| `README.md` | 项目入口文档 | 🔴 强制 |
| `CHANGELOG.md` | 版本变更记录 | 🔴 强制 |
| `CONTRIBUTING.md` | 贡献指南 | 🔴 强制 |
| `LICENSE` | 开源许可证 | 🔴 强制 |
| `YYC3-项目规范-全面标准.md` | 全局规范标准 | 🔴 强制 |
| `.gitignore` | Git 忽略配置 | 🔴 强制 |
| `package.json` | 项目配置 | 🔴 强制 |

### 1.2 包命名

#### 1.2.1 Monorepo 子包

**命名格式**：`@yyc3/{scope}`

| scope | 用途 | 示例 |
|-------|------|------|
| `core` | 核心基础组件 | `@yyc3/core` |
| `ui` | UI 组件库 | `@yyc3/ui` |
| `hooks` | 通用 Hooks | `@yyc3/hooks` |
| `ai` | AI 功能模块 | `@yyc3/ai` |
| `chat` | 聊天模块 | `@yyc3/chat` |
| `i18n` | 国际化 | `@yyc3/i18n` |
| `storage` | 存储方案 | `@yyc3/storage` |
| `database` | 数据库 | `@yyc3/database` |
| `git` | Git 集成 | `@yyc3/git` |
| `docker` | Docker 管理 | `@yyc3/docker` |
| `devops` | DevOps 工具 | `@yyc3/devops` |
| `terminal` | 终端模拟 | `@yyc3/terminal` |
| `collaboration` | 协作编辑 | `@yyc3/collaboration` |
| `crdt` | CRDT 同步 | `@yyc3/crdt` |
| `knowledge-base` | 知识库 | `@yyc3/knowledge-base` |
| `panel-manager` | 面板管理 | `@yyc3/panel-manager` |
| `filesystem` | 文件系统 | `@yyc3/filesystem` |
| `supabase` | Supabase 集成 | `@yyc3/supabase` |
| `diagnostics` | 诊断工具 | `@yyc3/diagnostics` |
| `error-handling` | 错误处理 | `@yyc3/error-handling` |
| `dynamic-config` | 动态配置 | `@yyc3/dynamic-config` |
| `backend-bridge` | 后端桥接 | `@yyc3/backend-bridge` |
| `types` | 类型定义 | `@yyc3/types` |
| `utils` | 工具函数 | `@yyc3/utils` |

**规则**：
- 🔴 所有子包必须使用 `@yyc3/` scope 前缀
- 🔁 scope 名称使用 kebab-case
- 🟡 新增包需在本文档中注册

### 1.3 代码文件命名

#### 1.3.1 通用规则

| 类型 | 命名规则 | 示例 |
|------|---------|------|
| React 组件 | PascalCase | `ErrorBoundary.tsx` `GlassCard.tsx` |
| Hook | camelCase + `use` 前缀 | `useI18n.ts` `useAI.ts` |
| 工具函数 | camelCase | `broadcastChannel.ts` `indexedDb.ts` |
| 类型定义 | camelCase | `collaboration.ts` `devops.ts` |
| 服务类 | PascalCase | `DatabaseService.ts` `GitService.ts` |
| 配置文件 | kebab-case | `vite.config.ts` `tsup.config.ts` |
| 测试文件 | 源文件名 + `.test` | `useI18n.test.ts` |
| Story 文件 | 源文件名 + `.stories` | `ErrorBoundary.stories.tsx` |

#### 1.3.2 目录结构命名

```
packages/{package-name}/
├── src/
│   ├── components/     # React 组件（PascalCase 文件名）
│   ├── hooks/          # 自定义 Hooks（use 前缀）
│   ├── services/       # 服务层（PascalCase）
│   ├── types/          # 类型定义（camelCase）
│   ├── utils/          # 工具函数（camelCase）
│   ├── functions/      # Supabase Edge Functions
│   └── index.ts        # 导出入口
├── __tests__/          # 测试文件
├── package.json
├── tsconfig.json
├── tsup.config.ts
├── README.md
└── CHANGELOG.md
```

### 1.4 代码标识符命名

#### 1.4.1 命名约定

| 标识符类型 | 规则 | 示例 |
|-----------|------|------|
| 变量 / 常量 | camelCase / UPPER_SNAKE_CASE | `userName` / `MAX_RETRY_COUNT` |
| 函数 | camelCase，动词开头 | `formatDate()` `fetchData()` |
| 类 / 接口 / 类型 | PascalCase | `DatabaseService` `AIConfig` |
| 枚举 | PascalCase（类型）+ UPPER_SNAKE_CASE（值） | `enum Status { ACTIVE, INACTIVE }` |
| 类型参数 | 单个大写字母或描述性 PascalCase | `T` `TItem` `TResponse` |
| 布尔变量 | `is`/`has`/`should`/`can` 前缀 | `isVisible` `hasPermission` |
| 事件处理 | `handle`/`on` 前缀 | `handleClick` `onSubmit` |
| 回调 Props | `on` 前缀 | `onChange` `onClose` |
| 私有成员 | `_` 前缀 | `_internalState` |

#### 1.4.2 缩写处理

| 缩写 | 变量/函数 | 类型/类 |
|------|----------|---------|
| API | `apiClient` | `ApiClient` |
| URL | `urlString` | `URLParser` |
| ID | `userId` | `UserId` |
| UI | `uiElement` | `UIElement` |
| DB | `dbConnection` | `DBConnection` |
| IO | `ioStream` | `IOStream` |
| HTTP | `httpClient` | `HttpClient` |
| JSON | `jsonParser` | `JsonParser` |

---

## 第二章 代码标头规范

### 2.1 标头格式定义

#### 2.1.1 TypeScript / JavaScript 文件

```typescript
/**
 * file: 文件名.tsx
 * description: 文件描述（一句话概括，≤50字）
 * author: YanYuCloudCube Team
 * version: v1.0.0
 * created: YYYY-MM-DD
 * updated: YYYY-MM-DD
 * status: active
 * tags: [标签1],[标签2],[标签3]
 *
 * copyright: YanYuCloudCube Team
 * license: MIT
 *
 * brief: 简要说明（≤100字）
 *
 * details:
 * - 功能点 1
 * - 功能点 2
 * - 功能点 3
 *
 * dependencies: 依赖列表
 * exports: 导出内容
 * notes: 注意事项
 */
```

#### 2.1.2 CSS / SCSS 文件

```css
/**
 * file: 文件名.css
 * description: 文件描述
 * author: YanYuCloudCube Team
 * version: v1.0.0
 * created: YYYY-MM-DD
 * updated: YYYY-MM-DD
 * status: active
 * tags: [style],[theme],[global]
 *
 * brief: 简要说明
 *
 * details: 详细说明
 *
 * dependencies: 依赖列表
 * notes: 注意事项
 */
```

#### 2.1.3 配置文件

```typescript
/**
 * file: 文件名.ts
 * description: 文件描述
 * author: YanYuCloudCube Team
 * version: v1.0.0
 * created: YYYY-MM-DD
 * updated: YYYY-MM-DD
 * status: active
 * tags: [config],[build],[vite]
 *
 * brief: 简要说明
 *
 * details: 详细说明
 *
 * dependencies: 依赖列表
 * notes: 注意事项
 */
```

#### 2.1.4 测试文件

```typescript
/**
 * file: 文件名.test.ts
 * description: 测试描述
 * author: YanYuCloudCube Team
 * version: v1.0.0
 * created: YYYY-MM-DD
 * updated: YYYY-MM-DD
 * status: active
 * tags: [test],[unit],[hook]
 *
 * brief: 简要说明
 *
 * details: 详细说明
 *
 * test-target: 被测文件路径
 * coverage: 覆盖率目标
 * notes: 注意事项
 */
```

#### 2.1.5 Electron 文件

```javascript
/**
 * file: 文件名.js
 * description: 文件描述
 * author: YanYuCloudCube Team
 * version: v1.0.0
 * created: YYYY-MM-DD
 * updated: YYYY-MM-DD
 * status: active
 * tags: [electron],[main-process],[ipc]
 *
 * brief: 简要说明
 *
 * details: 详细说明
 *
 * dependencies: 依赖列表
 * notes: 注意事项
 */
```

### 2.2 字段规范

#### 2.2.1 必填字段

| 字段 | 规则 | 示例 |
|------|------|------|
| `file` | 文件名含扩展名 | `file: useI18n.ts` |
| `description` | 一句话概括，≤50 字 | `description: 国际化 Hook · 支持中文/English 动态切换` |
| `author` | 作者名称 | `author: YanYuCloudCube Team` |
| `version` | 语义化版本 | `version: v1.0.0` |
| `created` | YYYY-MM-DD | `created: 2026-03-05` |
| `updated` | YYYY-MM-DD | `updated: 2026-03-05` |
| `status` | 状态枚举值 | `status: active` |
| `tags` | 2-4 个标签 | `tags: [hook],[i18n],[locale]` |

#### 2.2.2 可选字段

| 字段 | 用途 |
|------|------|
| `copyright` | 版权信息 |
| `license` | 许可证类型 |
| `brief` | 简要功能说明（≤100 字） |
| `details` | 详细功能列表 |
| `dependencies` | 主要依赖 |
| `exports` | 导出内容列表 |
| `notes` | 使用注意事项 |
| `test-target` | 测试目标文件路径（仅测试文件） |
| `coverage` | 覆盖率目标（仅测试文件） |

#### 2.2.3 状态枚举

| 状态值 | 含义 | 使用场景 |
|--------|------|---------|
| `active` | 活跃 | 正在使用的文件 |
| `stable` | 稳定 | 已验证的稳定版本 |
| `deprecated` | 已弃用 | 即将移除的文件 |
| `experimental` | 实验性 | 实验性功能 |
| `draft` | 草稿 | 开发中的文件 |

#### 2.2.4 标签分类

| 类别 | 标签 | 说明 |
|------|------|------|
| **类型** | `[component]` | React 组件 |
| | `[hook]` | 自定义 Hook |
| | `[util]` | 工具函数 |
| | `[type]` | 类型定义 |
| | `[config]` | 配置文件 |
| | `[test]` | 测试文件 |
| | `[service]` | 服务类 |
| **功能** | `[i18n]` | 国际化 |
| | `[ai]` | AI 功能 |
| | `[auth]` | 认证授权 |
| | `[api]` | API 接口 |
| | `[ui]` | UI 相关 |
| | `[data]` | 数据处理 |
| | `[storage]` | 存储方案 |
| | `[sync]` | 数据同步 |
| **模块** | `[dashboard]` | 仪表板 |
| | `[cp-im]` | CP-IM 模块 |
| | `[devops]` | DevOps 模块 |
| | `[collaboration]` | 协作模块 |
| | `[terminal]` | 终端模块 |
| **技术** | `[electron]` | Electron |
| | `[react]` | React |
| | `[style]` | 样式 |
| | `[theme]` | 主题 |
| | `[build]` | 构建 |

### 2.3 标头维护规则

| 操作 | 触发条件 | 更新字段 |
|------|---------|---------|
| 日常修改 | 代码变更 | `updated` |
| 功能新增 | 向下兼容的新功能 | `version`（MINOR）+ `updated` |
| 破坏性变更 | 不兼容的 API 修改 | `version`（MAJOR）+ `updated` |
| Bug 修复 | 问题修正 | `version`（PATCH）+ `updated` |
| 状态变更 | 弃用/稳定/实验 | `status` |
| 功能变更 | 文件用途变化 | `description` + `tags` |

---

## 第三章 代码风格规范

### 3.1 TypeScript 规范

#### 3.1.1 基础规则

| 规则 | 级别 | 说明 |
|------|------|------|
| 使用 `const` / `let`，禁止 `var` | 🔴 强制 | `prefer-const` + `no-var` |
| 严格相等 `===` / `!==` | 🔴 强制 | `eqeqeq: ['error', 'always']` |
| 必须使用花括号 | 🔴 强制 | `curly: ['error', 'all']` |
| 禁止 `console.log`（允许 `warn`/`error`） | 🔴 强制 | `no-console: ['warn']` |
| 禁止 `debugger` | 🔴 强制 | `no-debugger: 'error'` |
| 禁止 `alert` | 🟡 推荐 | `no-alert: 'warn'` |
| 未使用变量以 `_` 前缀忽略 | 🔴 强制 | `argsIgnorePattern: '^_'` |
| 禁止 `any` 类型 | 🟡 推荐 | `@typescript-eslint/no-explicit-any: 'warn'` |
| 优先 `??` 替代 `\|\|` | 🔴 强制 | `prefer-nullish-coalescing` |
| 优先 `?.` 替代链式判断 | 🔴 强制 | `prefer-optional-chain` |
| Promise 必须 await 或处理 | 🔴 强制 | `no-floating-promises` |
| 禁止不必要的类型断言 | 🔴 强制 | `no-unnecessary-type-assertion` |

#### 3.1.2 类型定义

```typescript
interface UserProps {
  readonly id: string;
  name: string;
  age?: number;
  role: 'admin' | 'user' | 'guest';
}

type Status = 'active' | 'inactive' | 'pending';

type FetchResult<T> = {
  data: T | null;
  error: Error | null;
  loading: boolean;
};
```

**规则**：
- 🔴 优先使用 `interface` 定义对象类型，`type` 用于联合类型/工具类型
- 🔴 导出的类型必须显式定义，禁止内联类型
- 🟡 可选属性使用 `?` 而非 `\| undefined`
- 🟡 只读属性使用 `readonly` 修饰

#### 3.1.3 函数规范

```typescript
export function formatDate(
  date: Date,
  locale: string = 'zh-CN'
): string {
  return date.toLocaleDateString(locale);
}

export async function fetchData<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  return response.json();
}
```

**规则**：
- 🔴 导出函数必须有返回类型注解
- 🟡 参数超过 3 个时使用对象参数
- 🟡 默认参数放在参数列表末尾
- 🔴 异步函数必须处理错误

### 3.2 React 规范

#### 3.2.1 组件定义

```tsx
import type { ReactNode } from 'react';

interface CardProps {
  title: string;
  description?: string;
  children?: ReactNode;
  variant?: 'default' | 'bordered' | 'elevated';
  className?: string;
}

export function Card({
  title,
  description,
  children,
  variant = 'default',
  className,
}: CardProps) {
  return (
    <div className={`card card--${variant} ${className ?? ''}`}>
      <h3>{title}</h3>
      {description && <p>{description}</p>}
      {children}
    </div>
  );
}
```

**规则**：
- 🔴 使用函数组件 + Hooks，禁止 Class 组件（ErrorBoundary 等特殊场景除外）
- 🔴 Props 必须定义 interface 并导出
- 🔴 组件文件名使用 PascalCase
- 🟡 组件内部状态优先使用 `useState` / `useReducer`
- 🟡 复杂逻辑抽取为自定义 Hook

#### 3.2.2 Hooks 规范

```typescript
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const nextValue = value instanceof Function ? value(prev) : value;
        window.localStorage.setItem(key, JSON.stringify(nextValue));
        return nextValue;
      });
    },
    [key]
  );

  return [storedValue, setValue];
}
```

**规则**：
- 🔴 自定义 Hook 必须以 `use` 开头
- 🔴 Hook 文件名与 Hook 名一致
- 🔴 返回值使用数组元组（状态 + setter）或对象
- 🟡 使用 `useCallback` / `useMemo` 优化性能

### 3.3 CSS / 样式规范

#### 3.3.1 TailwindCSS 优先

```tsx
export function Badge({ children, variant = 'default' }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variant === 'default' && 'bg-gray-100 text-gray-800',
        variant === 'success' && 'bg-green-100 text-green-800',
        variant === 'danger' && 'bg-red-100 text-red-800'
      )}
    >
      {children}
    </span>
  );
}
```

#### 3.3.2 CSS 变量

```css
:root {
  --color-primary: #3b82f6;
  --color-secondary: #06b6d4;
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}
```

**规则**：
- 🔴 优先使用 TailwindCSS 工具类
- 🟡 全局主题变量使用 CSS 自定义属性
- 🟡 避免内联样式（动态计算除外）
- 🔴 禁止使用 `!important`

### 3.4 格式化规范

基于项目 `.prettierrc` 配置：

| 配置项 | 值 | 说明 |
|--------|-----|------|
| `semi` | `true` | 使用分号 |
| `singleQuote` | `true` | 使用单引号 |
| `trailingComma` | `es5` | ES5 尾逗号 |
| `printWidth` | `80` | 每行最大 80 字符 |
| `tabWidth` | `2` | 2 空格缩进 |
| `useTabs` | `false` | 使用空格 |
| `arrowParens` | `always` | 箭头函数始终加括号 |
| `endOfLine` | `lf` | LF 换行符 |

---

## 第四章 项目结构规范

### 4.1 Monorepo 结构

```
yyc3-reusable-components/
├── .github/
│   └── workflows/
│       └── ci.yml              # CI/CD 配置
├── .storybook/                  # Storybook 配置
├── docs/                        # 项目文档（按标准目录命名）
│   ├── 00-YYC3-项目总览-目录索引/
│   │   ├── API-REFERENCE.md
│   │   └── USAGE-GUIDE.md
│   ├── 03-YYC3-项目开发-实施阶段/
│   ├── 04-YYC3-项目测试-审核阶段/
│   ├── 05-YYC3-项目部署-文档闭环/
│   ├── 09-YYC3-项目资产-知识管理/
│   └── 10-YYC3-项目模版-标准规范/
├── examples/                    # 示例项目
│   └── basic-usage/
├── packages/                    # 子包（30+）
│   ├── ai/
│   ├── core/
│   ├── hooks/
│   ├── ui/
│   └── ...
├── .eslintrc.js                 # ESLint 配置
├── .prettierrc                  # Prettier 配置
├── .gitignore                   # Git 忽略
├── package.json                 # 根配置（workspaces）
├── pnpm-workspace.yaml          # pnpm 工作空间
├── turbo.json                   # Turbo 配置
├── tsconfig.json                # 根 TypeScript 配置
├── YYC3-项目规范-全面标准.md       # 本规范文档
├── README.md                    # 项目入口
├── CHANGELOG.md                 # 变更日志
├── CONTRIBUTING.md              # 贡献指南
└── LICENSE                      # 许可证
```

### 4.2 子包结构模板

```
packages/{package-name}/
├── src/
│   ├── components/              # React 组件（可选）
│   │   └── ComponentName.tsx
│   ├── hooks/                   # 自定义 Hooks（可选）
│   │   └── useHookName.ts
│   ├── services/                # 服务层（可选）
│   │   └── ServiceName.ts
│   ├── types/                   # 类型定义（可选）
│   │   └── module-types.ts
│   ├── utils/                   # 工具函数（可选）
│   │   └── helper.ts
│   ├── functions/               # Edge Functions（可选）
│   │   └── server/
│   └── index.ts                 # 导出入口（🔴 强制）
├── __tests__/                   # 测试文件
│   └── module.test.ts
├── package.json                 # 包配置（🔴 强制）
├── tsconfig.json                # TS 配置（🔴 强制）
├── tsup.config.ts               # 构建配置（🔴 强制）
├── README.md                    # 包文档（🔴 强制）
└── CHANGELOG.md                 # 变更日志（🟡 推荐）
```

### 4.3 导出入口规范

```typescript
// packages/hooks/src/index.ts
export { useI18n } from './useI18n';
export { useLocalStorage } from './useLocalStorage';
export { useDebounce } from './useDebounce';
export { useClickOutside } from './useClickOutside';
export { useMediaQuery } from './useMediaQuery';
export { useToggle } from './useToggle';
export { useWindowSize } from './useWindowSize';
```

**规则**：
- 🔴 每个子包必须有 `src/index.ts` 作为统一导出入口
- 🔁 导出使用命名导出，避免默认导出
- 🟡 按功能分组导出，保持字母序

---

## 第五章 DevOps 规范

### 5.1 Git 规范

#### 5.1.1 分支策略

| 分支 | 用途 | 命名 |
|------|------|------|
| `main` | 生产稳定版本 | `main` |
| `develop` | 开发集成分支 | `develop` |
| 功能分支 | 新功能开发 | `feat/{package}/{description}` |
| 修复分支 | Bug 修复 | `fix/{package}/{description}` |
| 发布分支 | 版本发布 | `release/v{version}` |
| 热修复 | 紧急修复 | `hotfix/{description}` |

#### 5.1.2 提交信息格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

| type | 说明 |
|------|------|
| `feat` | 新功能 |
| `fix` | Bug 修复 |
| `docs` | 文档更新 |
| `style` | 代码格式（不影响逻辑） |
| `refactor` | 代码重构 |
| `test` | 测试相关 |
| `chore` | 构建/工具变动 |
| `perf` | 性能优化 |
| `ci` | CI/CD 配置 |

**示例**：

```
feat(hooks): add useDebounce hook with configurable delay

- Support leading/trailing edge options
- Add TypeScript generics for typed debounce
- Include unit tests with 95% coverage

Closes #123
```

### 5.2 CI/CD 规范

#### 5.2.1 CI 流水线

项目 CI 流水线（`.github/workflows/ci.yml`）包含以下阶段：

| 阶段 | 命令 | 说明 |
|------|------|------|
| Lint | `pnpm run lint` | ESLint 检查 |
| Type Check | `pnpm run type-check` | TypeScript 类型检查 |
| Test | `pnpm run test` | 单元测试 + 覆盖率 |
| Build | `pnpm run build` | 生产构建 |

**规则**：
- 🔴 所有 PR 必须通过全部 CI 阶段
- 🔴 Build 阶段依赖 Lint + Type Check + Test 通过
- 🟡 测试覆盖率上传至 Codecov

#### 5.2.2 版本发布

```bash
# 添加变更记录
pnpm run changeset

# 更新版本号
pnpm run version-packages

# 构建并发布
pnpm run release
```

### 5.3 环境要求

| 工具 | 版本 | 说明 |
|------|------|------|
| Node.js | ≥ 18.0.0 | 运行时 |
| pnpm | ≥ 8.0.0 | 包管理器 |
| TypeScript | 5.9+ | 类型系统 |
| Turbo | 2.0+ | 构建编排 |
| Vitest | 4.0+ | 测试框架 |
| tsup | 8.0+ | 构建工具 |

---

## 第六章 文档规范

### 6.1 README 规范

每个子包的 `README.md` 必须包含以下章节：

```markdown
# @yyc3/{package-name}

> 简短描述（一句话）

## 功能特性

- 特性 1
- 特性 2

## 安装

\```bash
pnpm add @yyc3/{package-name}
\```

## 使用

### 基础用法

\```tsx
import { Component } from '@yyc3/{package-name}';
\```

### 高级用法

\```tsx
\```

## API

### Props

| 属性 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| prop1 | `string` | ✅ | - | 说明 |

## 类型定义

\```typescript
interface Props {
  prop1: string;
}
\```

## 许可证

MIT
```

### 6.2 CHANGELOG 规范

遵循 [Keep a Changelog](https://keepachangelog.com/) 格式：

```markdown
# Changelog

## [Unreleased]

## [1.1.0] - 2026-03-30

### Added
- 新增功能描述

### Changed
- 变更描述

### Fixed
- 修复描述

### Deprecated
- 弃用描述

### Removed
- 移除描述

### Security
- 安全修复描述
```

### 6.3 JSDoc 注释规范

```typescript
/**
 * 格式化日期为可读字符串
 *
 * @param date - 要格式化的日期
 * @param locale - 语言环境（默认: 'zh-CN'）
 * @returns 格式化后的日期字符串
 *
 * @example
 * ```ts
 * formatDate(new Date(), 'zh-CN')
 * // => "2026年3月30日"
 * ```
 *
 * @throws {Error} 当 date 参数无效时抛出
 *
 * @since v1.0.0
 * @see https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date
 */
export function formatDate(date: Date, locale: string = 'zh-CN'): string {
  // implementation
}
```

**规则**：
- 🔴 所有导出函数/类/接口必须有 JSDoc
- 🔴 JSDoc 包含 `@param` `@returns` `@example`
- 🟡 复杂逻辑添加 `@throws` `@since` `@see`

---

## 第七章 质量保障规范

### 7.1 代码审查清单

#### 7.1.1 提交前检查

- [ ] 代码通过 `pnpm run lint`
- [ ] 代码通过 `pnpm run type-check`
- [ ] 代码通过 `pnpm run test`
- [ ] 测试覆盖率 ≥ 80%（核心路径 ≥ 90%）
- [ ] 代码通过 `pnpm run format:check`
- [ ] 文件标头符合第二章规范
- [ ] 新增文件命名符合第一章规范
- [ ] 导出内容已在 `index.ts` 中注册

#### 7.1.2 PR 审查标准

| 维度 | 检查项 | 级别 |
|------|--------|------|
| **正确性** | 逻辑正确，边界处理完善 | 🔴 |
| **类型安全** | 无 `any`，类型定义完整 | 🔴 |
| **测试覆盖** | 新代码有对应测试 | 🔴 |
| **文档完整** | JSDoc + README 更新 | 🔴 |
| **命名规范** | 符合第一章命名规范 | 🔴 |
| **标头规范** | 符合第二章标头规范 | 🔴 |
| **代码风格** | 符合第三章风格规范 | 🟡 |
| **性能影响** | 无明显性能退化 | 🟡 |
| **向后兼容** | 不破坏现有 API | 🔴 |

### 7.2 测试规范

#### 7.2.1 测试文件组织

```
packages/{package}/
├── __tests__/
│   ├── module.test.ts          # 模块单元测试
│   ├── component.test.tsx      # 组件测试
│   └── integration.test.ts     # 集成测试
```

#### 7.2.2 测试命名

```typescript
describe('useI18n', () => {
  describe('t() - 翻译函数', () => {
    it('应返回正确的翻译文本', () => { /* ... */ });
    it('应支持嵌套 key', () => { /* ... */ });
    it('应支持模板变量替换', () => { /* ... */ });
    it('找不到 key 时应返回 key 本身', () => { /* ... */ });
  });

  describe('setLocale() - 语言切换', () => {
    it('应切换当前语言', () => { /* ... */ });
    it('应持久化到 localStorage', () => { /* ... */ });
  });
});
```

**规则**：
- 🔴 使用 `describe` + `it` 组织测试
- 🔴 测试描述使用中文，格式为 `应{预期行为}`
- 🟡 每个测试只验证一个行为
- 🟡 测试顺序：正常路径 → 边界情况 → 异常情况

#### 7.2.3 覆盖率要求

| 类型 | 最低覆盖率 | 说明 |
|------|-----------|------|
| 核心模块（core, hooks, types） | 90% | 基础设施级 |
| 功能模块（ai, chat, storage） | 80% | 功能级 |
| UI 组件（ui, core 组件） | 80% | 组件级 |
| 工具模块（utils, diagnostics） | 80% | 工具级 |

### 7.3 安全规范

| 规则 | 级别 | 说明 |
|------|------|------|
| 禁止硬编码密钥 | 🔴 | 使用环境变量 |
| 输入验证 | 🔴 | 所有外部输入必须验证 |
| XSS 防护 | 🔴 | React 自动转义，禁止 `dangerouslySetInnerHTML` |
| 依赖审计 | 🟡 | 定期运行 `pnpm audit` |
| CORS 配置 | 🟡 | 明确允许的源 |
| 最小权限 | 🟡 | 仅请求必要的权限 |

---

## 附录

### A. 标头规范检查清单

#### 新文件创建

- [ ] 复制对应文件类型的标头模板
- [ ] 填写所有必填字段（file, description, author, version, created, updated, status, tags）
- [ ] 根据需要填写可选字段
- [ ] 选择正确的状态值
- [ ] 添加 2-4 个标签（类型 + 功能）
- [ ] description ≤ 50 字

#### 现有文件更新

- [ ] 检查标头是否存在且格式正确
- [ ] 更新 `updated` 日期
- [ ] 重大修改更新 `version`
- [ ] 状态变化更新 `status`
- [ ] 功能变化更新 `description` 和 `tags`

### B. 命名规范速查表

| 场景 | 规则 | 示例 |
|------|------|------|
| 项目文档目录 | `{序号}-{阶段}-{功能}-{子功能}` | `03-YYC3-项目开发-实施阶段` |
| 标准规范文件 | `YYC3-{功能}-{描述}.md` | `YYC3-项目规范-全面标准.md` |
| 应用级文档 | `{功能}-{类型}.ts` | `API-REFERENCE.ts` |
| 子包目录 | kebab-case | `error-handling` |
| React 组件文件 | PascalCase | `ErrorBoundary.tsx` |
| Hook 文件 | camelCase + use 前缀 | `useLocalStorage.ts` |
| 测试文件 | 源文件名 + `.test` | `useAI.test.ts` |
| 变量 | camelCase | `userName` |
| 常量 | UPPER_SNAKE_CASE | `MAX_RETRY_COUNT` |
| 接口/类型 | PascalCase | `AIConfig` |
| 布尔变量 | is/has/should 前缀 | `isVisible` |

### C. 代码风格速查表

| 规则 | 配置 | 值 |
|------|------|-----|
| 分号 | `semi` | `true` |
| 引号 | `singleQuote` | `true` |
| 尾逗号 | `trailingComma` | `es5` |
| 行宽 | `printWidth` | `80` |
| 缩进 | `tabWidth` | `2` |
| 换行符 | `endOfLine` | `lf` |
| 箭头函数括号 | `arrowParens` | `always` |

### D. Git 提交类型速查表

| type | 说明 | 示例 |
|------|------|------|
| `feat` | 新功能 | `feat(hooks): add useDebounce` |
| `fix` | Bug 修复 | `fix(core): resolve crash on null` |
| `docs` | 文档 | `docs: update README` |
| `style` | 格式 | `style: format with prettier` |
| `refactor` | 重构 | `refactor(ai): simplify config` |
| `test` | 测试 | `test(hooks): add useI18n tests` |
| `chore` | 工具 | `chore: update dependencies` |
| `perf` | 性能 | `perf(storage): optimize indexedDB` |
| `ci` | CI/CD | `ci: add coverage upload` |

### E. 术语表

| 术语 | 定义 |
|------|------|
| 标头 | 文件开头的 JSDoc 注释块，包含文件元信息 |
| Monorepo | 单一代码仓库管理多个包的架构 |
| Workspace | pnpm/Turbo 工作空间中的子包 |
| SemVer | 语义化版本规范（MAJOR.MINOR.PATCH） |
| Changeset | 变更集，用于跟踪版本变更 |
| CRDT | 无冲突复制数据类型 |
| Edge Function | 边缘函数，在服务端运行的函数 |

### F. 参考文档

| 文档 | 链接 |
|------|------|
| 语义化版本 | https://semver.org/lang/zh-CN/ |
| Keep a Changelog | https://keepachangelog.com/zh-CN/ |
| Conventional Commits | https://www.conventionalcommits.org/zh-hans/ |
| TypeScript Handbook | https://www.typescriptlang.org/docs/handbook/ |
| React 文档 | https://react.dev/ |
| Vitest 文档 | https://vitest.dev/ |
| ESLint 文档 | https://eslint.org/docs/latest/ |
| Prettier 文档 | https://prettier.io/docs/ |

### G. 规范变更日志

| 版本 | 日期 | 变更内容 |
|------|------|---------|
| v1.0.0 | 2026-03-30 | 合并《代码标准》与《命名规范》，建立全面性项目规范标准 |

---

<div align="center">

> 「***YanYuCloudCube***」
> 「***<admin@0379.email>***」
> 「***Words Initiate Quadrants, Language Serves as Core for Future***」
> 「***All things converge in cloud pivot; Deep stacks ignite a new era of intelligence***」

</div>
