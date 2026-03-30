# @yyc3/ui

YYC3 UI Component Library - 完整的 shadcn/ui 组件库，基于 Tailwind CSS 构建。

## 📦 概述

`@yyc3/ui` 是一个完整的 UI 组件库，包含 48 个高质量的 React 组件，基于 shadcn/ui 和 Radix UI 构建，使用 Tailwind CSS 进行样式设计。

## ✨ 特性

- 🎨 **48 个高质量组件** - 覆盖所有常见 UI 需求
- 🚀 **基于 Radix UI** - 无障碍访问，键盘导航支持
- 🎯 **Tailwind CSS** - 完全可定制的样式
- 📱 **响应式设计** - 支持移动端和桌面端
- 🌙 **深色模式** - 内置深色模式支持
- 🔧 **TypeScript** - 完整的类型支持
- ♿ **无障碍访问** - 遵循 WAI-ARIA 规范

## 🚀 安装

```bash
npm install @yyc3/ui
# 或
yarn add @yyc3/ui
# 或
pnpm add @yyc3/ui
```

## 📋 依赖

- React ^18.0.0
- React DOM ^18.0.0

## 🎨 组件列表

### 基础组件 (Basic Components)

- `Button` - 按钮
- `Input` - 输入框
- `Label` - 标签
- `Textarea` - 文本域
- `Badge` - 徽章

### 容器组件 (Container Components)

- `Card` - 卡片
- `Dialog` - 对话框
- `Sheet` - 侧边面板
- `Drawer` - 抽屉
- `Popover` - 气泡
- `Alert` - 警告

### 菜单组件 (Menu Components)

- `DropdownMenu` - 下拉菜单
- `ContextMenu` - 右键菜单
- `NavigationMenu` - 导航菜单
- `Menubar` - 菜单栏
- `Command` - 命令面板

### 布局组件 (Layout Components)

- `Accordion` - 手风琴
- `Collapsible` - 折叠面板
- `Tabs` - 标签页
- `Separator` - 分隔线
- `ScrollArea` - 滚动区域

### 反馈组件 (Feedback Components)

- `Progress` - 进度条
- `Skeleton` - 骨架屏
- `Sonner` - 通知提示
- `Alert` - 警告框
- `Avatar` - 头像

### 列表组件 (List Components)

- `Table` - 表格
- `Pagination` - 分页
- `Breadcrumb` - 面包屑

### 表单组件 (Form Components)

- `Form` - 表单
- `Checkbox` - 复选框
- `RadioGroup` - 单选框
- `Switch` - 开关
- `Slider` - 滑块
- `Select` - 选择器
- `Calendar` - 日历

### 高级组件 (Advanced Components)

- `Sidebar` - 侧边栏
- `Resizable` - 可调整大小面板
- `Carousel` - 轮播图
- `Chart` - 图表
- `Command` - 命令面板

## 💡 使用示例

### 基础用法

```tsx
import { Button, Card, Input } from '@yyc3/ui';

function App() {
  return (
    <div>
      <Card>
        <h1>Hello YYC3 UI</h1>
        <Input placeholder="Enter your name" />
        <Button>Submit</Button>
      </Card>
    </div>
  );
}
```

### 深色模式

```tsx
import { Button } from '@yyc3/ui';

function App() {
  return (
    <div className="dark">
      <Button variant="outline">Dark Mode Button</Button>
    </div>
  );
}
```

### 组合使用

```tsx
import { Card, CardHeader, CardTitle, CardContent, Button } from '@yyc3/ui';

function UserCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <Button variant="outline">View Profile</Button>
      </CardContent>
    </Card>
  );
}
```

## 🎯 最佳实践

### 1. 使用 cn() 工具函数

```tsx
import { cn } from '@yyc3/ui';
import { Button } from '@yyc3/ui';

function MyButton() {
  return (
    <Button className={cn('base-styles', isActive && 'active-styles')}>
      Click Me
    </Button>
  );
}
```

### 2. 响应式设计

```tsx
import { Card } from '@yyc3/ui';

function ResponsiveCard() {
  return <Card className="w-full md:w-1/2 lg:w-1/3">{/* Content */}</Card>;
}
```

### 3. 深色模式支持

```tsx
import { Button } from '@yyc3/ui';

function DarkModeButton() {
  return (
    <Button className="dark:bg-white dark:text-black">Dark Mode Button</Button>
  );
}
```

## 🎨 定制化

### Tailwind 配置

```js
// tailwind.config.js
module.exports = {
  content: ['./node_modules/@yyc3/ui/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [require('tailwindcss-animate')],
};
```

### CSS 变量

```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    /* ... */
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    /* ... */
  }
}
```

## 📚 API 文档

完整的 API 文档请参考各个组件的源代码文件和 TypeScript 类型定义。

## 🤝 贡献

欢迎贡献！请查看 [贡献指南](../../CONTRIBUTING.md)。

## 📄 许可证

MIT License - 详见 [LICENSE](../../LICENSE)

## 🔗 相关链接

- [YYC3 主页](https://github.com/YYC-Cube/yyc3-reusable-components)
- [shadcn/ui](https://ui.shadcn.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Tailwind CSS](https://tailwindcss.com/)

## 📞 支持

如有问题，请提交 [Issue](https://github.com/YYC-Cube/yyc3-reusable-components/issues)。

---

Made with ❤️ by YanYuCloudCube Team
