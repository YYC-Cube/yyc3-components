# @yyc3/git

YYC3 Git 版本控制库 - 完整的 Git 仓库管理功能。

## ✨ 特性

- 📦 Git 仓库管理（初始化、克隆、状态）
- 🌿 分支管理（创建、切换、删除、合并）
- 📝 提交管理（提交、推送、拉取）
- 📜 日志查看（提交历史、变更对比）
- 📊 状态查看（暂存区、工作区）

## 💡 使用示例

```tsx
import { useGit } from '@yyc3/git';

function GitPanel() {
  const { repoInfo, branches, commits, gitStatus, commit, push, pull } =
    useGit();

  return (
    <div>
      <h1>Git Repository</h1>
      <p>Branch: {repoInfo.currentBranch}</p>
      {commits.map((commit) => (
        <div key={commit.hash}>
          {commit.message} - {commit.author}
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
