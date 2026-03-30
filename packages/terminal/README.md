# @yyc3/terminal

> YYC3 Terminal React Hooks
> YYC3 可复用组件库 - 终端 React Hooks

完整的中英文文档 | English and Chinese documentation

---

## 特性 / Features

- ✅ **会话管理** - 创建、关闭、查询终端会话 / Session management
- ✅ **命令执行** - 异步执行命令，支持超时 / Command execution
- ✅ **命令历史** - 历史记录和清理 / Command history
- ✅ **快捷命令** - 自定义快捷方式 / Shortcuts
- ✅ **统计信息** - 会话数、命令数、成功率 / Statistics
- ✅ **多 Shell** - bash, zsh, sh, powershell, cmd, fish / Multi-shell support

---

## 安装 / Installation

```bash
pnpm add @yyc3/terminal
```

---

## 快速开始 / Quick Start

```tsx
import { useTerminal } from '@yyc3/terminal';

function TerminalComponent() {
  const { sessions, createSession, executeCommand, isExecuting, lastResult } = useTerminal();

  const handleCreateSession = () => {
    const session = createSession('My Session', {
      shell: 'bash',
      cwd: '/home/user',
      enableColors: true
    });
    console.log('Created:', session);
  };

  const handleExecuteCommand = async () => {
    const result = await executeCommand('session-id', 'ls -la');
    console.log('Result:', result);
  };

  return (
    <div>
      <button onClick={handleCreateSession}>Create Session</button>
      <button onClick={handleExecuteCommand} disabled={isExecuting}>
        {isExecuting ? 'Executing...' : 'Execute Command'}
      </button>
      {lastResult && <pre>{lastResult.stdout}</pre>}
    </div>
  );
}
```

---

## 许可证 / License

MIT License
