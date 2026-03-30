# @yyc3/virtual-fs

YYC3 虚拟文件系统 - 内存虚拟文件系统。

## ✨ 特性

- 💾 虚拟文件系统（内存文件系统）
- 🔄 文件同步（与后端同步）
- 💻 终端虚拟文件系统（Terminal VFS）
- 👁️ 文件监控
- 🔍 路径解析
- 🔒 权限管理

## 💡 使用示例

```tsx
import { useVirtualFileSystem } from '@yyc3/virtual-fs';

function VirtualFileManager() {
  const { files, readFile, writeFile } = useVirtualFileSystem();
  // ...
}
```

## 📄 许可证

MIT License

---

Made with ❤️ by YanYuCloudCube Team
