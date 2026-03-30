# @yyc3/filesystem

YYC3 文件系统管理库 - 完整的文件浏览、操作和 Git 集成功能。

## ✨ 特性

- 📁 文件浏览（目录、列表、隐藏文件）
- 📝 文件操作（读、写、创建、重命名、复制、移动、删除）
- 🔍 文件搜索（按名称、类型、内容）
- 🌿 Git 仓库信息（状态、分支、提交）
- 📍 最近路径记录
- 🔄 文件夹导航（前进、后退、向上）

## 💡 使用示例

```tsx
import { useFileSystem } from '@yyc3/filesystem';

function FileManager() {
  const {
    currentPath,
    files,
    browseDirectory,
    readFile,
    writeFile,
    searchFiles,
  } = useFileSystem();

  return (
    <div>
      <h1>File Manager</h1>
      <p>Current Path: {currentPath}</p>
      {files.map((file) => (
        <div key={file.name}>
          {file.name} - {file.type}
        </div>
      ))}
    </div>
  );
}
```

## 📄 许可证

MIT License

---

Made with ❤️ by YanYuCloudCube Team
