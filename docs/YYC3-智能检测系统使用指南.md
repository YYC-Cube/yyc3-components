# YYC3 组件库 - 智能检测系统使用指南

## 📋 概述

YYC3 组件库智能检测系统是一套完整的自动化代码质量保障方案,在提交到远程仓库前自动检测代码质量,并根据结果决定是否允许推送。

## 🎯 核心功能

### 1. 自动化检测维度

| 检测项 | 说明 | 重要性 |
|--------|------|--------|
| **代码复杂度分析** | 检测超大文件、嵌套深度 | 🟡 推荐 |
| **依赖安全检查** | pnpm audit 检查漏洞 | 🔴 强制 |
| **类型安全检查** | TypeScript 严格类型检查 | 🔴 强制 |
| **代码规范检查** | ESLint 代码规范 | 🔴 强制 |
| **性能问题检测** | console 语句、同步操作 | 🟡 推荐 |
| **最佳实践检查** | any 类型使用、待办事项 | 🟡 推荐 |
| **构建产物检查** | 构建成功、产物完整 | 🔴 强制 |
| **测试覆盖率检查** | 单元测试运行 | 🔴 强制 |
| **包配置完整性** | package.json 必需字段 | 🔴 强制 |
| **安全检查** | 敏感文件、.gitignore | 🔴 强制 |

### 2. 智能检测脚本

#### `scripts/smart-check.sh` - 智能检测脚本

功能最全面的检测脚本,包含所有检测维度。

```bash
# 运行智能检测
bash scripts/smart-check.sh

# 输出示例:
# 🧠 智能检测报告
# 📊 统计数据:
# 总检查项:        41
# 通过:            36
# 失败:            0
# 警告:            6
# 🎯 代码质量分数: 87%
```

**判定规则:**
- ✅ 通过: 无失败项,允许推送
- ❌ 失败: 有失败项,阻止推送

#### `scripts/cicd-check.sh` - CI/CD 前置检查

专门为推送到远程前的 CI/CD 验证设计。

```bash
# 运行 CI/CD 检查
bash scripts/cicd-check.sh
```

**检查内容:**
- 环境检查(Node.js ≥ 18, pnpm ≥ 8)
- 依赖验证
- 构建测试
- 类型检查
- Lint 检查
- 测试运行
- 安全检查

#### `scripts/smart-fix.sh` - 智能修复脚本

自动修复常见的代码问题。

```bash
# 运行智能修复
bash scripts/smart-fix.sh

# 修复内容:
# - ESLint 问题自动修复
# - 类型错误修复
# - 缺失文件创建
# - 导入错误修复
# - 构建错误修复
# - 依赖问题修复
# - 代码格式化
```

#### `scripts/smart-commit.sh` - 智能提交脚本

集成了检测、修复、提交、推送的完整流程。

```bash
# 使用智能提交(自动检测->修复->提交->推送)
bash scripts/smart-commit.sh

# 或指定提交信息
bash scripts/smart-commit.sh "feat: 添加新功能"

# 流程:
# 1. 🔍 智能检测
# 2. 🔧 智能修复(最多3次)
# 3. 🏗️ CI/CD 本地验证
# 4. 💾 创建提交
# 5. 🚀 推送到远程
```

## 🔒 Git Pre-Push Hook

已自动配置 `git pre-push` hook,在每次推送到远程前自动运行智能检测。

### 工作流程

```
git push origin main
    ↓
Pre-Push Hook 触发
    ↓
运行智能检测 (smart-check.sh)
    ↓
┌─────────────┐
│ 检测通过?   │
└──────┬──────┘
       ├─ 是 → ✅ 允许推送
       └─ 否 → ❌ 阻止推送
                 ↓
            显示错误详情
                 ↓
            提供修复建议
```

### Hook 行为

**当检测通过时:**
```
╔═══════════════════════════════════════════════════════════╗
║       YYC3 组件库 - Pre-Push 智能检测 🛡️                   ║
╚═══════════════════════════════════════════════════════════╝

✅ 智能检测通过！
🚀 代码质量优秀，允许推送到远程
🎯 代码质量分数: 87%
```

**当检测失败时:**
```
╔═══════════════════════════════════════════════════════════╗
║       YYC3 组件库 - Pre-Push 智能检测 🛡️                   ║
╚═══════════════════════════════════════════════════════════╝

❌ 智能检测失败！
🛡️ 检测到代码质量问题，阻止推送到远程

⚠️ 检测失败详情:
  - 构建失败
  - 类型错误: 5 个
  - 代码质量分数: 65%

⚠️ 请修复上述问题后再推送:
  1. 运行 'bash scripts/smart-check.sh' 查看完整报告
  2. 运行 'bash scripts/smart-fix.sh' 自动修复部分问题
  3. 手动修复无法自动解决的问题
  4. 重新运行检测脚本验证
  5. 所有检查通过后再次推送
```

## 📊 检测报告说明

### 代码质量分数

基于所有检查项的通过率计算:

```
质量分数 = (通过项数 / 总检查项数) × 100%

等级划分:
- 90-100%: 🟢 优秀 - 代码质量极佳
- 80-89%:  🟡 良好 - 建议优化
- 70-79%:  🟠 一般 - 需要改进
- < 70%:   🔴 较差 - 必须修复
```

### 警告与失败

| 类型 | 含义 | 是否阻止推送 |
|------|------|--------------|
| ✅ 通过 | 检查通过 | - |
| ⚠️ 警告 | 非关键问题 | 不阻止 |
| ❌ 失败 | 关键问题 | 阻止推送 |

## 🚀 使用场景

### 场景 1: 日常开发提交

```bash
# 1. 编写代码
# 2. 暂存更改
git add .

# 3. 提交
git commit -m "feat: 添加新功能"

# 4. 推送(自动触发 pre-push 检测)
git push origin main
# ↓
# 如果检测通过 → 自动推送
# 如果检测失败 → 阻止推送,显示修复建议
```

### 场景 2: 发布前的完整检测

```bash
# 运行完整的智能检测
bash scripts/smart-check.sh

# 如果有问题,运行智能修复
bash scripts/smart-fix.sh

# 重新验证
bash scripts/smart-check.sh

# 确认后推送
git push origin main
```

### 场景 3: 使用智能提交(推荐)

```bash
# 一键完成: 检测 -> 修复 -> 提交 -> 推送
bash scripts/smart-commit.sh "feat: 添加新功能"

# 脚本会自动:
# 1. 检测代码质量
# 2. 如果有问题,自动修复(最多3次)
# 3. 运行 CI/CD 本地验证
# 4. 创建提交
# 5. 推送到远程
```

### 场景 4: CI/CD 本地验证

```bash
# 在推送到远程前,模拟远程 CI/CD 检查
bash scripts/cicd-check.sh

# 这会运行:
# - 环境检查
# - 依赖验证
# - 构建测试
# - 类型检查
# - Lint 检查
# - 测试运行
# - 安全检查
```

## 🛠️ 故障排除

### 问题 1: Pre-Push Hook 被阻止

**症状:** `git push` 被 hook 阻止

**解决:**
```bash
# 1. 查看完整检测报告
bash scripts/smart-check.sh

# 2. 运行智能修复
bash scripts/smart-fix.sh

# 3. 手动修复无法自动修复的问题

# 4. 重新检测
bash scripts/smart-check.sh

# 5. 检测通过后再次推送
git push origin main
```

### 问题 2: 想要跳过检测(不推荐)

**警告:** 跳过检测可能导致低质量代码推送到远程!

```bash
# 方法 1: 使用 --no-verify 标志(跳过所有 hooks)
git push --no-verify origin main

# 方法 2: 临时重命名 hook
mv .git/hooks/pre-push .git/hooks/pre-push.disabled
git push origin main
mv .git/hooks/pre-push.disabled .git/hooks/pre-push

# ⚠️ 仅在紧急情况下使用!
```

### 问题 3: 检测误报

如果检测误报,可以调整检测规则:

1. 修改 `scripts/smart-check.sh` 中的检测逻辑
2. 调整 `packages/*/package.json` 中的配置
3. 更新 `.eslintrc.js` 或 `tsconfig.json` 配置

## 📝 最佳实践

### 1. 提交前手动检测

```bash
# 在提交前先运行检测
bash scripts/smart-check.sh

# 确保检测通过再提交
git add .
git commit -m "message"
```

### 2. 定期运行修复脚本

```bash
# 每周运行一次,保持代码质量
bash scripts/smart-fix.sh
```

### 3. 关注代码质量分数

目标保持代码质量分数在 **80% 以上**,建议优化到 **90% 以上**。

### 4. 及时处理警告

虽然警告不阻止推送,但建议及时处理以提高代码质量。

### 5. 使用智能提交脚本

对于重要提交,使用 `smart-commit.sh` 自动完成整个流程。

## 🔗 相关资源

- **项目规范:** `YYC3-项目规范-全面标准.md`
- **代码标头规范:** 详见项目规范第二章
- **CI/CD 配置:** `.github/workflows/ci.yml`
- **ESLint 配置:** `.eslintrc.js`
- **TypeScript 配置:** `tsconfig.json`

## 📞 支持与反馈

如有问题或建议,请:
1. 查看项目文档
2. 运行 `bash scripts/smart-check.sh` 查看详细报告
3. 运行 `bash scripts/smart-fix.sh` 尝试自动修复
4. 联系团队: admin@0379.email

---

**YYC³ Team**
**YanYuCloudCube | 言启象限 | 语枢未来**
