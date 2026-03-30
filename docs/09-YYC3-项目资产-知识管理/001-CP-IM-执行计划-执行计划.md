# AI Family 可复用内容执行计划

> **启动日期**: 2026年3月26日
> **计划版本**: v1.0.0
> **总预估工时**: 40天
> **执行模式**: 渐进式复用，按优先级有序推进

---

## 📋 执行总览

### 阶段划分

| 阶段 | 名称 | 预估工时 | 状态 | 开始时间 |
|------|------|----------|------|----------|
| **Phase 1** | 评估与准备 | 1-2天 | 🟡 进行中 | 2026-03-26 |
| **Phase 2** | 提取核心组件 | 5-10天 | ⏳ 待开始 | - |
| **Phase 3** | 改造业务组件 | 20-30天 | ⏳ 待开始 | - |
| **Phase 4** | 集成与测试 | 5-10天 | ⏳ 待开始 | - |
| **Phase 5** | 文档与交付 | 3-5天 | ⏳ 待开始 | - |

---

## Phase 1: 评估与准备 (1-2天) 🟡 进行中

### 目标
- 完成复用模块的详细评估
- 创建复用项目目录结构
- 配置开发环境

### 任务清单

#### 1.1 复用模块评估 ✅ 已完成
- [x] 审核可复用模块清单
- [x] 评估复用成本
- [x] 制定复用计划
- [x] 生成统计报告

**输出**: `项目可复用内容统计报告.md`

#### 1.2 创建项目结构 🟡 进行中
创建复用项目的标准目录结构：

```
/yyc3-reusable-components/
├── packages/
│   ├── ui/                    # UI组件库
│   ├── core/                  # 核心组件
│   ├── utils/                 # 工具函数
│   ├── hooks/                 # 自定义Hooks
│   ├── types/                 # 类型定义
│   ├── error-handling/        # 错误处理
│   ├── i18n/                  # 国际化
│   └── storage/               # 存储系统
├── docs/                      # 文档
├── examples/                  # 示例
└── scripts/                   # 构建脚本
```

**执行命令**:
```bash
mkdir -p yyc3-reusable-components/packages/{ui,core,utils,hooks,types,error-handling,i18n,storage}
mkdir -p yyc3-reusable-components/{docs,examples,scripts}
```

#### 1.3 配置项目环境 🟡 进行中
- [ ] 初始化package.json
- [ ] 配置TypeScript
- [ ] 配置构建工具
- [ ] 配置ESLint + Prettier
- [ ] 配置Vitest测试框架

**执行**: 将在下一批次执行

---

## Phase 2: 提取核心组件 (5-10天) ⏳ 待开始

### 目标
提取低耦合、高价值的组件，零改造或轻微改造即可复用

### 2.1 UI组件库提取 (1-2天) 🔴 P0

#### 任务清单
- [ ] 提取48个UI组件到 `packages/ui/`
- [ ] 配置组件导出
- [ ] 创建组件文档
- [ ] 编写组件测试

#### 组件清单
```
packages/ui/
├── button.tsx              ✅ 强烈推荐
├── card.tsx                ✅ 强烈推荐
├── dialog.tsx              ✅ 强烈推荐
├── form.tsx                ✅ 强烈推荐
├── sidebar.tsx             ✅ 强烈推荐
├── input.tsx               ✅ 推荐
├── select.tsx              ✅ 推荐
├── checkbox.tsx            ✅ 推荐
├── switch.tsx              ✅ 推荐
├── slider.tsx              ✅ 推荐
├── badge.tsx               ✅ 推荐
├── alert.tsx               ✅ 推荐
├── toast/                   ✅ 推荐
├── dropdown-menu.tsx       ✅ 推荐
├── tabs.tsx                ✅ 推荐
├── table.tsx               ✅ 推荐
├── ... (其余32个组件)
└── utils.ts                ✅ 必需
```

#### 执行步骤
```bash
# 1. 创建包目录
mkdir -p packages/ui/src

# 2. 复制UI组件
cp -r src/components/ui/*.tsx packages/ui/src/

# 3. 复制工具函数
cp src/components/ui/utils.ts packages/ui/src/

# 4. 创建包配置
cat > packages/ui/package.json << 'EOF'
{
  "name": "@yyc3/ui",
  "version": "1.0.0",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  },
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "test": "vitest"
  },
  "peerDependencies": {
    "react": "^19.2.4",
    "react-dom": "^19.2.4"
  },
  "dependencies": {
    "@radix-ui/react-slot": "^1.2.4",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "tailwind-merge": "^3.5.0"
  },
  "devDependencies": {
    "@types/react": "^19.2.14",
    "@types/react-dom": "^19.2.3",
    "tsup": "^8.0.0",
    "typescript": "^5.9.3"
  }
}
EOF
```

### 2.2 工具函数提取 (0.5天) 🔴 P0

#### 任务清单
- [ ] 提取工具函数到 `packages/utils/`
- [ ] 配置函数导出
- [ ] 创建函数文档
- [ ] 编写函数测试

#### 函数清单
```
packages/utils/
├── color.ts                 # hexToRgb
├── date.ts                  # getGreeting, getHourlyCare
├── data.ts                  # getMember, getFamilyDataSummary
├── string.ts                # 字符串处理工具
└── index.ts                 # 统一导出
```

#### 执行步骤
```bash
# 1. 创建包目录
mkdir -p packages/utils/src

# 2. 从shared.ts提取工具函数
# 将提取 hexToRgb, getGreeting, getHourlyCare, getMember, getFamilyDataSummary

# 3. 创建包配置
cat > packages/utils/package.json << 'EOF'
{
  "name": "@yyc3/utils",
  "version": "1.0.0",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "scripts": {
    "build": "tsup",
    "test": "vitest"
  },
  "devDependencies": {
    "tsup": "^8.0.0",
    "typescript": "^5.9.3"
  }
}
EOF
```

### 2.3 类型定义提取 (0.5天) 🔴 P0

#### 任务清单
- [ ] 提取类型定义到 `packages/types/`
- [ ] 配置类型导出
- [ ] 创建类型文档

#### 类型清单
```
packages/types/
├── error.ts                 # AppError, ErrorCategory, ErrorSeverity
├── i18n.ts                  # Locale, LocaleInfo, I18nContextValue
├── ui.ts                    # UI相关类型
├── audio.ts                 # 音频相关类型
└── index.ts                 # 统一导出
```

#### 执行步骤
```bash
# 1. 创建包目录
mkdir -p packages/types/src

# 2. 从src/types/index.ts提取类型定义

# 3. 创建包配置
cat > packages/types/package.json << 'EOF'
{
  "name": "@yyc3/types",
  "version": "1.0.0",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "scripts": {
    "build": "tsup"
  },
  "devDependencies": {
    "tsup": "^8.0.0",
    "typescript": "^5.9.3"
  }
}
EOF
```

### 2.4 简单组件提取 (0.5天) 🔴 P0

#### 任务清单
- [ ] 提取FadeIn组件到 `packages/core/`
- [ ] 提取GlassCard组件到 `packages/core/`
- [ ] 创建组件文档

#### 组件清单
```
packages/core/
├── FadeIn.tsx              # 沙箱安全的动画组件
├── GlassCard.tsx           # 玻璃态卡片
└── index.ts                # 统一导出
```

#### 执行步骤
```bash
# 1. 创建包目录
mkdir -p packages/core/src

# 2. 复制组件
cp src/ai-family/FadeIn.tsx packages/core/src/
cp src/components/GlassCard.tsx packages/core/src/

# 3. 创建包配置
cat > packages/core/package.json << 'EOF'
{
  "name": "@yyc3/core",
  "version": "1.0.0",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "scripts": {
    "build": "tsup",
    "test": "vitest"
  },
  "peerDependencies": {
    "react": "^19.2.4",
    "react-dom": "^19.2.4"
  },
  "devDependencies": {
    "@types/react": "^19.2.14",
    "@types/react-dom": "^19.2.3",
    "tsup": "^8.0.0",
    "typescript": "^5.9.3"
  }
}
EOF
```

### 2.5 Hooks提取 (0.5天) 🟡 P1

#### 任务清单
- [ ] 提取useI18n到 `packages/hooks/`
- [ ] 配置Hook导出
- [ ] 创建Hook文档

#### Hooks清单
```
packages/hooks/
├── useI18n.ts              # 国际化Hook
└── index.ts                # 统一导出
```

---

## Phase 3: 改造业务组件 (20-30天) ⏳ 待开始

### 目标
改造高耦合、高价值的组件,去业务化,增加灵活性

### 3.1 AIFamilyRouter改造 (2天) 🟡 P1

#### 任务清单
- [ ] 移除AI Family特定路由
- [ ] 支持自定义路由配置
- [ ] 提供路由配置接口
- [ ] 创建改造后文档

#### 改造方案
```typescript
// 改造前: 硬编码路由
const lazyMap = {
  home: () => import("./FamilyHome"),
  chat: () => import("./FamilyChat"),
  // ...
};

// 改造后: 支持配置
interface RouterConfig {
  [key: string]: {
    component: () => Promise<{ default: React.ComponentType }>;
    fallback?: React.ReactNode;
  };
}

export function LazyRouter({ config }: { config: RouterConfig }) {
  // ...
}
```

### 3.2 shared.ts改造 (3天) 🟡 P1

#### 任务清单
- [ ] 提取通用数据模型
- [ ] 移除AI Family特定数据
- [ ] 参数化配置
- [ ] 创建改造后文档

#### 改造方案
```typescript
// 改造后: 可配置的角色系统
interface RoleConfig {
  id: string;
  name: string;
  role: string;
  // ...通用字段
}

export function createRoleSystem(config: RoleConfig[]) {
  return {
    roles: config,
    getRole: (id: string) => config.find(r => r.id === id),
    // ...
  };
}
```

### 3.3 ErrorBoundary改造 (2天) 🟡 P1

#### 任务清单
- [ ] 移除赛博朋克风格(可选)
- [ ] 提供自定义主题配置
- [ ] 增加SSR兼容性
- [ ] 创建改造后文档

#### 改造方案
```typescript
// 改造后: 可配置主题
interface ErrorBoundaryTheme {
  primary?: string;
  secondary?: string;
  background?: string;
}

export function ErrorBoundary({ 
  children, 
  theme = {} 
}: ErrorBoundaryProps & { theme?: ErrorBoundaryTheme }) {
  // 使用theme参数
}
```

### 3.4 error-handler改造 (3天) 🟡 P1

#### 任务清单
- [ ] 移除YYC3特定标识
- [ ] 提供自定义错误分类
- [ ] 增加远程日志上报接口
- [ ] 创建改造后文档

#### 改造方案
```typescript
// 改造后: 可配置错误上报
interface ErrorHandlerConfig {
  appName?: string;
  remoteLogger?: (error: AppError) => Promise<void>;
  customCategories?: Record<string, ErrorCategory>;
}

export function initErrorHandler(config: ErrorHandlerConfig) {
  // 使用config配置
}
```

### 3.5 FamilyModelSettings改造 (5天) 🟡 P1

#### 任务清单
- [ ] 移除8位AI家人绑定
- [ ] 支持自定义模型提供商
- [ ] 提供配置导出接口
- [ ] 创建改造后文档

#### 改造方案
```typescript
// 改造后: 通用AI模型配置
interface ModelProvider {
  id: string;
  name: string;
  models: ModelInfo[];
  configFields: ConfigField[];
}

interface ModelConfig {
  [roleId: string]: {
    providerId: string;
    modelId: string;
    config: Record<string, unknown>;
  };
}

export function ModelSettings({ 
  providers, 
  config, 
  onChange 
}: ModelSettingsProps) {
  // ...
}
```

### 3.6 FamilyVoiceSystem改造 (7天) 🟡 P1

#### 任务清单
- [ ] 移除8位AI家人语音
- [ ] 支持自定义语音档案
- [ ] 增加语音合成接口
- [ ] 创建改造后文档

#### 改造方案
```typescript
// 改造后: 通用语音系统
interface VoiceProfile {
  id: string;
  name: string;
  pitch: number;
  rate: number;
  volume: number;
  lang: string;
}

export function VoiceSystem({ 
  profiles, 
  onSpeak 
}: VoiceSystemProps) {
  // ...
}
```

---

## Phase 4: 集成与测试 (5-10天) ⏳ 待开始

### 目标
将改造后的组件集成到示例项目,完成测试

### 4.1 创建示例项目 (2天)
- [ ] 初始化示例项目
- [ ] 配置依赖
- [ ] 集成所有复用组件
- [ ] 创建示例页面

### 4.2 单元测试 (2-3天)
- [ ] 为UI组件编写测试
- [ ] 为工具函数编写测试
- [ ] 为Hooks编写测试
- [ ] 为核心组件编写测试

### 4.3 集成测试 (1-2天)
- [ ] 测试组件集成
- [ ] 测试类型兼容性
- [ ] 测试构建流程
- [ ] 测试文档准确性

### 4.4 性能测试 (1天)
- [ ] Bundle大小分析
- [ ] 渲染性能测试
- [ ] 内存泄漏检测

---

## Phase 5: 文档与交付 (3-5天) ⏳ 待开始

### 目标
完善文档,完成交付

### 5.1 文档编写 (2-3天)
- [ ] 组件文档(Markdown)
- [ ] API文档(TypeScript)
- [ ] 使用示例(Storybook)
- [ ] 迁移指南

### 5.2 发布准备 (1-2天)
- [ ] 版本号管理
- [ ] CHANGELOG生成
- [ ] NPM发布配置
- [ ] CI/CD配置

---

## 📊 执行进度追踪

### 整体进度
```
[████████░░░░░░░░░░░░░░░] 20% 完成
```

### 阶段进度
- Phase 1: [████████████░░░░░░░░░] 80% 完成
- Phase 2: [░░░░░░░░░░░░░░░░░░░░] 0% 完成
- Phase 3: [░░░░░░░░░░░░░░░░░░░░] 0% 完成
- Phase 4: [░░░░░░░░░░░░░░░░░░░░] 0% 完成
- Phase 5: [░░░░░░░░░░░░░░░░░░░░] 0% 完成

### 任务完成情况
- ✅ 复用模块评估: 100%
- 🟡 创建项目结构: 30%
- ⏳ 配置项目环境: 0%
- ⏳ 提取UI组件库: 0%
- ⏳ 提取工具函数: 0%
- ⏳ 提取类型定义: 0%
- ⏳ 提取简单组件: 0%
- ⏳ 改造业务组件: 0%
- ⏳ 集成与测试: 0%
- ⏳ 文档与交付: 0%

---

## 🎯 下一步行动

### 立即执行(今天)
1. ✅ 创建项目目录结构
2. ⏳ 配置项目环境(package.json, tsconfig.json)
3. ⏳ 创建构建脚本

### 明天
4. ⏳ 提取UI组件库
5. ⏳ 提取工具函数
6. ⏳ 提取类型定义

---

**执行开始时间**: 2026年3月26日
**预计完成时间**: 2026年5月5日 (40天后)
**当前状态**: 🟡 Phase 1 进行中
