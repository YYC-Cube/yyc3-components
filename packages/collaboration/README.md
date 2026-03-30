# @yyc3/collaboration

YYC3 实时协同编辑库 - 基于 CRDT 和 OT 的实时协同编辑解决方案。

## 📦 概述

`@yyc3/collaboration` 是一个完整的实时协同编辑解决方案，支持多用户实时编辑、冲突解决和 Presence 用户感知。

## ✨ 特性

- 🔄 **CRDT 协同编辑引擎** - 无冲突复制数据类型，保证数据一致性
- 🎯 **OT 操作转换** - Operational Transformation，自动解决编辑冲突
- 👥 **Presence 用户感知** - 实时显示其他用户的光标和选区
- 📄 **文件同步** - 多文件同步、冲突合并
- 🔌 **离线编辑缓冲** - 离线操作、重连后自动同步
- 🔧 **冲突检测与解决** - Last-Writer-Wins + OT merge
- 📊 **版本向量管理** - Version Vector，追踪文档版本
- 🎨 **Monaco Editor 集成** - 专业的代码编辑器

## 🚀 安装

```bash
npm install @yyc3/collaboration
# 或
yarn add @yyc3/collaboration
# 或
pnpm add @yyc3/collaboration
```

## 📋 依赖

- React ^18.0.0
- React DOM ^18.0.0
- Monaco Editor

## 💡 使用示例

### 基础用法 - 协同编辑

```tsx
import { useCollaborativeEditing } from '@yyc3/collaboration';

function CollaborativeEditor() {
  const { document, participants, handleOperation, joinSession, leaveSession } =
    useCollaborativeEditing();

  return (
    <div>
      <h1>Collaborative Editor</h1>
      <div>
        <h2>Participants ({participants.length})</h2>
        {participants.map((p) => (
          <div key={p.id}>
            <span style={{ color: p.cursorColor }}>{p.name}</span>
          </div>
        ))}
      </div>
      <MonacoCodeEditor
        value={document.content}
        onChange={handleOperation}
        participants={participants}
      />
    </div>
  );
}
```

### CRDT 同步

```tsx
import { useCRDTSync } from '@yyc3/collaboration';

function CRDTSync() {
  const { syncStatus, pendingOperations, lastSyncTime, forceSync } =
    useCRDTSync();

  return (
    <div>
      <h2>Sync Status: {syncStatus}</h2>
      <p>Pending Operations: {pendingOperations.length}</p>
      <p>Last Sync: {lastSyncTime}</p>
      <button onClick={forceSync}>Force Sync</button>
    </div>
  );
}
```

### 文件同步

```tsx
import { useFileSync } from '@yyc3/collaboration';

function FileSync() {
  const { files, syncFile, resolveConflict, syncStatus } = useFileSync();

  return (
    <div>
      <h2>File Sync</h2>
      {files.map((file) => (
        <div key={file.id}>
          <h3>{file.name}</h3>
          <p>Status: {file.syncStatus}</p>
          {file.hasConflict && (
            <button onClick={() => resolveConflict(file.id)}>
              Resolve Conflict
            </button>
          )}
          <button onClick={() => syncFile(file.id)}>Sync</button>
        </div>
      ))}
    </div>
  );
}
```

## 🎯 核心 API

### useCollaborativeEditing Hook

```typescript
interface UseCollaborativeEditingReturn {
  // Document
  document: CRDTDocumentState;
  participants: CollaborationParticipant[];

  // Session
  joinSession: (sessionId: string) => Promise<void>;
  leaveSession: () => void;

  // Operations
  handleOperation: (operation: TextOperation) => void;
  applyRemoteOperation: (operation: TextOperation) => void;

  // Presence
  cursorPositions: Map<string, CursorPosition>;
  selectionRanges: Map<string, SelectionRange>;
}
```

### useCRDTSync Hook

```typescript
interface UseCRDTSyncReturn {
  // Sync State
  syncStatus: 'synced' | 'syncing' | 'offline' | 'conflict';
  pendingOperations: TextOperation[];
  lastSyncTime: Date;

  // Actions
  forceSync: () => Promise<void>;
  clearPending: () => void;

  // Conflict
  conflicts: Conflict[];
  resolveConflict: (conflictId: string) => Promise<void>;
}
```

### useFileSync Hook

```typescript
interface UseFileSyncReturn {
  // Files
  files: SyncedFile[];
  syncStatus: Map<string, FileSyncStatus>;

  // Actions
  syncFile: (fileId: string) => Promise<void>;
  syncAll: () => Promise<void>;

  // Conflict
  conflicts: Conflict[];
  resolveConflict: (
    fileId: string,
    resolution: ConflictResolution
  ) => Promise<void>;
}
```

## 🎨 组件

### MonacoCodeEditor

专业的代码编辑器，支持协同编辑和光标显示

### CollaborationPresence

显示当前在线用户和他们的光标位置

### DiffViewer

文件差异对比视图

### UserAIPanel

用户 AI 面板

### CodeDetailPanel

代码详情面板

### CollabViewSwitcher

协同视图切换器

### TerminalPanel

终端面板

### ProjectFileManager

项目管理器

### ProjectTemplateSelector

项目模板选择器

### SandboxPreview

沙盒预览

### GlobalSearchPalette

全局搜索面板

### DraggablePanelLayout

可拖动面板布局

### EditorTabBar

编辑器标签栏

## 🎯 最佳实践

### 1. 处理离线编辑

```tsx
useEffect(() => {
  // 监听网络状态变化
  const handleOnline = () => {
    // 重连后自动同步
    forceSync();
  };
  window.addEventListener('online', handleOnline);
  return () => window.removeEventListener('online', handleOnline);
}, []);
```

### 2. 冲突解决策略

```tsx
const resolveConflict = async (fileId: string) => {
  // 显示冲突解决 UI
  const resolution = await showConflictResolutionDialog(fileId);
  // 应用解决方案
  await useFileSync.resolveConflict(fileId, resolution);
};
```

### 3. 优化性能

```tsx
// 使用防抖减少操作频率
const debouncedOperation = useMemo(
  () => debounce(handleOperation, 100),
  [handleOperation]
);
```

## 📚 类型定义

### CollaborationParticipant

```typescript
interface CollaborationParticipant {
  id: string;
  name: string;
  cursorColor: string;
  cursorPosition?: CursorPosition;
  selectionRange?: SelectionRange;
  isOnline: boolean;
  lastSeen: Date;
}
```

### TextOperation

```typescript
interface TextOperation {
  type: 'insert' | 'delete' | 'retain';
  position: number;
  content?: string;
  length?: number;
  timestamp: number;
  userId: string;
  version: number;
}
```

## 🤝 贡献

欢迎贡献！请查看 [贡献指南](../../CONTRIBUTING.md)。

## 📄 许可证

MIT License - 详见 [LICENSE](../../LICENSE)

## 🔗 相关链接

- [YYC3 主页](https://github.com/YYC-Cube/yyc3-reusable-components)
- [CRDT 论文](https://hal.inria.fr/inria-00555588/)
- [OT 论文](https://doi.org/10.1145/168060.168064)
- [Monaco Editor](https://microsoft.github.io/monaco-editor/)

## 📞 支持

如有问题，请提交 [Issue](https://github.com/YYC-Cube/yyc3-reusable-components/issues)。

---

Made with ❤️ by YanYuCloudCube Team
