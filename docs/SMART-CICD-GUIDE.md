# YYC3 智能代码检测和自动化系统

## 📖 概述

YYC3 组件库配备了完整的智能代码检测和自动化系统，包括：

- 🔍 **智能检测** - 全维度代码质量检查
- 🔧 **智能修复** - 自动修复常见问题
- 🤖 **智能提交** - 自动化检测、修复、提交流程
- ✅ **CI/CD 验证** - 推送前完整的 CI 模拟

## 🚀 快速开始

### 1. 智能提交（推荐）

一键完成检测、修复、提交和推送：

```bash
# 使用智能提交系统
bash scripts/smart-commit.sh

# 或使用自定义提交信息
bash scripts/smart-commit.sh "feat: 添加新功能"
```

### 2. 仅检测

```bash
# 运行智能检测
bash scripts/smart-check.sh

# 运行 CI/CD 前置检查
bash scripts/cicd-check.sh
```

### 3. 仅修复

```bash
# 自动修复常见问题
bash scripts/smart-fix.sh
```

### 4. 完整流程

```bash
# 1. 开发代码
vim packages/core/src/index.ts

# 2. 运行智能提交
bash scripts/smart-commit.sh "feat: 核心功能优化"

# 系统会自动：
# - 运行智能检测
# - 如果失败，自动修复（最多 3 次）
# - 运行 CI/CD 验证
# - 创建提交
# - 推送到远程
```

## 🔧 Git Hooks

### Pre-commit Hook

在每次 `git commit` 前自动运行：

- ✅ 智能代码检测
- 🔧 自动修复（如果检测失败）
- ✅ 重新验证修复结果

**跳过 hook（不推荐）：**

```bash
git commit --no-verify -m "message"
```

### Pre-push Hook

在每次 `git push` 前自动运行：

- 🔍 环境检查
- 📦 依赖验证
- 🏗️ 构建测试
- 🔍 类型检查
- 🧪 测试运行
- 🔒 安全检查

**跳过 hook（不推荐）：**

```bash
git push --no-verify
```

## 📊 检测维度

### 智能检测 (smart-check.sh)

1. **代码复杂度分析**
   - 超大文件检测（>500 行）
   - 嵌套深度检查
   - 循环复杂度

2. **依赖安全检查**
   - 安全漏洞扫描
   - 未使用依赖检测
   - 版本冲突检查

3. **类型安全检查**
   - TypeScript 严格模式检查
   - 隐式 any 类型检测
   - 类型导入验证

4. **代码规范检查**
   - ESLint 规则验证
   - 代码风格一致性
   - 最佳实践建议

5. **性能问题检测**
   - console 语句检测
   - 同步阻塞操作
   - 内存泄漏风险

6. **最佳实践检查**
   - TypeScript 最佳实践
   - React Hooks 规则
   - 代码重复检测

7. **构建产物检查**
   - 构建成功率
   - 产物完整性
   - Tree-shaking 验证

8. **测试覆盖率检查**
   - 测试文件检测
   - 覆盖率统计
   - 测试质量评估

9. **包配置完整性检查**
   - package.json 必需字段
   - tsconfig.json 配置
   - 导出配置验证

10. **安全检查**
    - 敏感文件检测
    - .gitignore 完整性
    - 权限配置验证

### CI/CD 验证 (cicd-check.sh)

1. **环境检查**
   - Node.js 版本
   - pnpm 版本
   - 磁盘空间

2. **依赖检查**
   - lockfile 完整性
   - 依赖安装验证
   - 版本一致性

3. **构建检查**
   - 全量构建
   - 产物生成
   - 构建性能

4. **类型检查**
   - TypeScript 编译
   - 类型错误
   - 类型覆盖率

5. **Lint 检查**
   - ESLint 规则
   - 代码风格
   - 自动修复建议

6. **测试检查**
   - 单元测试
   - 集成测试
   - 测试覆盖率

7. **安全检查**
   - 依赖安全审计
   - 敏感文件检测
   - 权限验证

## 🔧 自动修复

智能修复系统可以自动处理以下问题：

### 依赖问题

```bash
# 自动添加缺失的类型定义
- @types/react
- @types/react-dom
- @types/node
```

### 配置问题

```bash
# 自动创建缺失的配置文件
- tsconfig.json
- package.json 必需字段
```

### 代码问题

```bash
# ESLint 自动修复
pnpm run lint --fix

# 代码格式化
prettier --write "**/*.{ts,tsx}"
```

### 构建问题

```bash
# 清理构建缓存
pnpm run clean

# 重新安装依赖
pnpm install --frozen-lockfile
```

## 🤖 自动化流程

### Smart Commit 工作流

```
┌─────────────────┐
│  开发代码        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Git 暂存        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  智能检测        │ ◄─┐
└────────┬────────┘    │
         │             │
    失败 │             │ 最多 3 次
         ▼             │
┌─────────────────┐    │
│  智能修复        │ ───┘
└────────┬────────┘
         │ 成功
         ▼
┌─────────────────┐
│  CI/CD 验证      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  创建提交        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  推送到远程      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  GitHub Actions  │
│  自动 CI/CD      │
└─────────────────┘
```

### GitHub Actions 工作流

推送后自动触发：

1. **Smart Check** - 智能质量检查
   - 运行 smart-check.sh
   - 运行 cicd-check.sh
   - 生成质量报告
   - PR 评论展示结果

2. **CI Pipeline** - 标准 CI 流程
   - Lint 检查
   - 类型检查
   - 测试运行
   - 构建验证

3. **Release** - 自动发布（main 分支）
   - 版本号更新
   - Changelog 生成
   - NPM 发布

## 📝 常见场景

### 场景 1: 开发新功能

```bash
# 1. 创建分支
git checkout -b feature/new-feature

# 2. 开发代码
vim packages/core/src/new-feature.ts

# 3. 智能提交
bash scripts/smart-commit.sh "feat: 添加新功能"

# 系统自动处理所有检测和修复
```

### 场景 2: 修复 Bug

```bash
# 1. 修复代码
vim packages/utils/src/bug.ts

# 2. 智能提交
bash scripts/smart-commit.sh "fix: 修复 utils 中的 bug"

# 系统确保修复不会引入新问题
```

### 场景 3: 批量优化

```bash
# 1. 批量修改
find packages -name "*.ts" -exec sed -i 's/old/new/g' {} \;

# 2. 运行修复
bash scripts/smart-fix.sh

# 3. 验证并提交
bash scripts/smart-commit.sh "refactor: 批量优化代码"
```

### 场景 4: 依赖更新

```bash
# 1. 更新依赖
pnpm update

# 2. 运行 CI 检查
bash scripts/cicd-check.sh

# 3. 提交
bash scripts/smart-commit.sh "chore: 更新依赖"
```

## 🛠️ 配置和自定义

### 自定义检测规则

编辑 `scripts/smart-check.sh`：

```bash
# 添加自定义检查
check_custom_rules() {
    print_section "自定义检查"

    # 你的检查逻辑
    if your_check; then
        print_pass "自定义检查通过"
    else
        print_fail "自定义检查失败"
    fi
}
```

### 自定义修复规则

编辑 `scripts/smart-fix.sh`：

```bash
# 添加自定义修复
fix_custom_issues() {
    print_section "自定义修复"

    # 你的修复逻辑
    your_fix_command

    ((FIXES_APPLIED++))
}
```

### 调整最大修复次数

编辑 `scripts/smart-commit.sh`：

```bash
# 修改最大修复尝试次数
MAX_FIX_ATTEMPTS=5  # 默认 3
```

## 📈 质量分数

智能检测会计算代码质量分数：

- **90-100%**: 优秀 ✅
- **80-89%**: 良好 👍
- **70-79%**: 合格 ⚠️
- **< 70%**: 需改进 ❌

### 分数影响因素

- ✅ 通过的检查项
- ❌ 失败的检查项
- ⚠️ 警告数量
- 🔒 安全问题
- 📊 代码复杂度

## 🔍 查看报告

### 本地报告

```bash
# 查看最新检测报告
cat /tmp/smart-check.log

# 查看最新修复日志
cat /tmp/smart-fix.log

# 查看 CI 检查日志
cat /tmp/cicd-*.log
```

### GitHub Actions 报告

```bash
# 查看最新运行
gh run list --limit 5

# 查看特定运行详情
gh run view <run-id>

# 查看失败日志
gh run view <run-id> --log-failed
```

## 🆘 故障排除

### 检测失败

```bash
# 1. 查看详细错误
bash scripts/smart-check.sh 2>&1 | tee check.log

# 2. 运行自动修复
bash scripts/smart-fix.sh

# 3. 重新检测
bash scripts/smart-check.sh
```

### 构建失败

```bash
# 1. 清理构建缓存
pnpm run clean

# 2. 重新安装依赖
rm -rf node_modules pnpm-lock.yaml
pnpm install

# 3. 重新构建
pnpm run build
```

### 类型错误

```bash
# 1. 检查缺失的类型定义
pnpm run type-check 2>&1 | grep "Cannot find"

# 2. 安装缺失的类型
pnpm add -D @types/package-name

# 3. 重新检查
pnpm run type-check
```

## 📚 最佳实践

1. **频繁提交** - 小步快跑，频繁提交
2. **信任系统** - 让智能系统处理检测和修复
3. **关注警告** - 即使通过也要关注警告
4. **定期更新** - 定期运行 `pnpm update`
5. **保持质量** - 追求 80%+ 的质量分数

## 🎯 总结

YYC3 智能系统确保：

- ✅ **代码质量** - 全维度检测
- 🔧 **自动修复** - 减少人工干预
- 🤖 **自动化流程** - 提交即验证
- 📊 **可视化报告** - 清晰的质量指标
- 🚀 **高效开发** - 专注于业务逻辑

开始使用：

```bash
bash scripts/smart-commit.sh "你的提交信息"
```
