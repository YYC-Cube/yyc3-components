# @yyc3/panel-manager

YYC3 面板管理库 - 统一面板状态管理和可拖动布局。

## ✨ 特性

- 🎛️ 面板状态管理（打开、关闭、切换）
- 🖱️ 可拖动面板（拖拽调整大小、位置）
- 📑 编辑器标签页（标签页管理、切换）
- 🎯 统一面板状态（Single Source of Truth）
- 🚫 自动互斥（同一时间只能打开一个面板）
- 🔒 类型安全（TypeScript 类型保护）
- 🔄 向后兼容（支持旧的布尔值状态）

## 💡 使用示例

```tsx
import { usePanelManager } from '@yyc3/panel-manager';

function App() {
  const { isPanelOpen, openPanel, closePanel } = usePanelManager();

  return (
    <div>
      <button onClick={() => openPanel('settings')}>
        Open Settings
      </button>
      {isPanelOpen('settings') && (
        <SettingsPanel onClose={() => closePanel('settings')} />
      )}
    </div>
  );
}
```

## 📄 许可证

MIT License

---

Made with ❤️ by YanYuCloudCube Team
