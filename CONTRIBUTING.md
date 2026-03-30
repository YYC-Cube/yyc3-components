# 贡献指南

感谢你考虑为YYC3 Reusable Components做出贡献！

## 🤝 如何贡献

### 报告问题

如果你发现了bug或有功能建议，请：

1. 检查[Issues](../../issues)是否已存在相似问题
2. 如果没有，创建新的Issue
3. 清楚地描述问题或建议

### 提交代码

#### 1. Fork项目

点击GitHub页面右上角的"Fork"按钮。

#### 2. 克隆你的Fork

```bash
git clone https://github.com/YOUR_USERNAME/yyc3-reusable-components.git
cd yyc3-reusable-components
```

#### 3. 创建分支

```bash
git checkout -b feature/your-feature-name
# 或
git checkout -b fix/your-bug-fix
```

#### 4. 安装依赖

```bash
pnpm install
```

#### 5. 开发和测试

```bash
# 运行开发服务器
pnpm run dev

# 运行测试
pnpm run test

# 运行Lint
pnpm run lint

# 格式化代码
pnpm run format
```

#### 6. 提交更改

```bash
git add .
git commit -m "feat: add new component"
# 或
git commit -m "fix: resolve bug in component"
```

提交信息格式：
- `feat:` 新功能
- `fix:` Bug修复
- `docs:` 文档更新
- `style:` 代码格式调整
- `refactor:` 代码重构
- `test:` 测试相关
- `chore:` 构建工具或辅助工具变动

#### 7. 推送到你的Fork

```bash
git push origin feature/your-feature-name
```

#### 8. 创建Pull Request

1. 访问原项目的GitHub页面
2. 点击"New Pull Request"
3. 选择你的分支
4. 填写PR模板
5. 提交PR

## 📋 开发规范

### 代码风格

- 使用TypeScript
- 遵循ESLint规则
- 使用Prettier格式化代码
- 遵循项目的命名约定

### 组件开发

#### 1. 文件结构

```
packages/your-package/
├── src/
│   ├── index.ts          # 导出入口
│   ├── YourComponent.tsx # 组件实现
│   └── types.ts         # 类型定义
├── __tests__/           # 测试文件
│   └── YourComponent.test.ts
├── package.json
├── tsup.config.ts
└── README.md           # 组件文档
```

#### 2. 组件模板

```tsx
import React from 'react';
import type { YourComponentProps } from './types';

/**
 * Component description
 */
export function YourComponent({ prop1, prop2 }: YourComponentProps) {
  return <div>{prop1}</div>;
}
```

#### 3. 类型定义

```ts
export interface YourComponentProps {
  /** prop description */
  prop1: string;
  /** prop description */
  prop2?: number;
  /** prop description */
  children?: React.ReactNode;
}
```

#### 4. 文档要求

每个组件/函数必须包含：
- JSDoc注释
- 参数说明
- 返回值说明
- 使用示例

```ts
/**
 * Formats a date to a readable string
 * @param date - The date to format
 * @param locale - The locale to use (default: 'en-US')
 * @returns The formatted date string
 * @example
 * ```ts
 * formatDate(new Date(), 'zh-CN')
 * // returns: "2024年3月26日"
 * ```
 */
export function formatDate(date: Date, locale = 'en-US'): string {
  // implementation
}
```

### 测试要求

#### 1. 测试覆盖率

所有新代码必须有测试，目标覆盖率 >= 80%。

#### 2. 测试类型

- 单元测试 - 测试单个函数/组件
- 集成测试 - 测试多个组件协作
- E2E测试 - 测试完整流程

#### 3. 测试模板

```ts
import { describe, it, expect } from 'vitest';
import { yourFunction } from '../src';

describe('yourFunction', () => {
  it('should do something', () => {
    const result = yourFunction(input);
    expect(result).toBe(expected);
  });

  it('should handle edge cases', () => {
    expect(() => yourFunction(invalid)).not.toThrow();
  });
});
```

## 📦 包开发

### 添加新包

1. 在`packages/`目录创建新包
2. 添加`package.json`（参考其他包）
3. 添加`tsup.config.ts`
4. 创建`src/`目录和源文件
5. 创建`__tests__/`目录和测试
6. 添加`README.md`文档
7. 更新主`README.md`
8. 更新根`package.json`的workspaces

### 包规范

- 依赖零外部库（如果可能）
- TypeScript 5.9+
- 使用tsup打包
- 导出TypeScript类型
- 包含完整的测试
- 详细的README

## 📝 文档

### 文档类型

1. **README.md** - 包的主文档
2. **API.md** - API参考
3. **USAGE.md** - 使用指南
4. **CHANGELOG.md** - 变更日志
5. **CONTRIBUTING.md** - 贡献指南（本文档）

### 文档要求

- 清晰的标题结构
- 代码示例
- API表格
- 最佳实践
- 常见问题

## 🧪 测试

### 运行测试

```bash
# 运行所有测试
pnpm run test

# 运行特定包的测试
pnpm --filter @yyc3/utils run test

# 运行测试并查看覆盖率
pnpm run test:coverage

# 监听模式
pnpm run test -- --watch
```

### 测试工具

- Vitest - 测试框架
- @testing-library/react - React组件测试
- happy-dom - DOM环境

## 🔍 代码审查

### 审查清单

提交PR前请确认：

- [ ] 代码通过所有测试
- [ ] 代码通过Lint检查
- [ ] 代码通过TypeScript类型检查
- [ ] 添加了必要的测试
- [ ] 更新了相关文档
- [ ] 提交信息符合规范
- [ ] 遵循了项目的代码风格

### 审查标准

- 代码质量和可读性
- 测试覆盖率
- 文档完整性
- 向后兼容性
- 性能影响

## 🏷️ 版本管理

我们使用[语义化版本](https://semver.org/)：

- **主版本号(MAJOR)**: 不兼容的API修改
- **次版本号(MINOR)**: 向下兼容的功能性新增
- **修订号(PATCH)**: 向下兼容的问题修正

使用Changesets管理版本：

```bash
# 添加changeset
pnpm run changeset

# 发布新版本
pnpm run release
```

## 📧 联系方式

- **GitHub Issues**: [提交问题](../../issues)
- **讨论**: [GitHub Discussions](../../discussions)
- **邮箱**: admin@0379.email

## 📄 许可证

通过贡献代码，你同意你的贡献将按照[MIT许可证](../../LICENSE)进行授权。

## 🌟 贡献者

感谢所有贡献者！

---

## 额外资源

- [开发指南](../docs/USAGE.md)
- [API文档](../docs/API.md)
- [示例项目](../examples/)
- [项目结构](../README.md#项目结构)

---

再次感谢你的贡献！🎉
