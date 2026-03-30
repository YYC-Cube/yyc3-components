# @yyc3/chat

> YYC3 Chat React Components & Hooks
> YYC3 可复用组件库 - 聊天组件和 Hooks

完整的中英文文档 | English and Chinese documentation

---

## 特性 / Features

- ✅ **聊天持久化** - localStorage 自动保存和加载 / Chat persistence
- ✅ **频道管理** - 创建、删除、更新频道 / Channel management
- ✅ **数据导入导出** - JSON 格式 / Data import/export
- ✅ **自动清理** - 存储空间和过期数据 / Auto cleanup
- ✅ **打字指示器** - 视觉反馈组件 / Typing indicator
- ✅ **TypeScript** - 完整类型支持 / Full TypeScript support

---

## 安装 / Installation

```bash
pnpm add @yyc3/chat
```

---

## 快速开始 / Quick Start

```tsx
import { useChatPersistence, useChannelManager, TypingIndicator } from '@yyc3/chat';

function ChatApp() {
  const { chats, setChats, exportData, importData } = useChatPersistence('main');
  const { channels, activeChannelId, createChannel, setActiveChannelId } = useChannelManager();

  const handleSendMessage = (text: string) => {
    const newMessage = {
      id: `msg_${Date.now()}`,
      text,
      isUser: true,
      timestamp: new Date()
    };
    
    setChats(prev => [...prev, {
      id: `chat_${Date.now()}`,
      title: text.slice(0, 30),
      messages: [newMessage],
      createdAt: new Date(),
      updatedAt: new Date(),
      channelId: activeChannelId
    }]);
  };

  return (
    <div>
      {/* 频道切换 */}
      <div>
        {channels.map(channel => (
          <button 
            key={channel.id}
            onClick={() => setActiveChannelId(channel.id)}
            style={{ background: channel.id === activeChannelId ? '#ddd' : 'transparent' }}
          >
            {channel.name}
          </button>
        ))}
        <button onClick={() => createChannel('New Channel')}>+ New Channel</button>
      </div>

      {/* 聊天消息 */}
      <div>
        {chats.map(chat => (
          <div key={chat.id}>
            <p><strong>{chat.title}</strong></p>
            {chat.messages.map(msg => (
              <p key={msg.id}>
                {msg.isUser ? 'User: ' : 'AI: '}{msg.text}
              </p>
            ))}
          </div>
        ))}
      </div>

      {/* 打字指示器 */}
      <TypingIndicator />

      {/* 导入导出 */}
      <div>
        <button onClick={exportData}>Export Data</button>
        <button onClick={() => {
          const input = document.createElement('input');
          input.type = 'file';
          input.accept = '.json';
          input.onchange = (e) => {
            const file = e.target.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = (e) => {
                const success = importData(e.target?.result as string);
                if (success) alert('Import successful!');
              };
              reader.readAsText(file);
            }
          };
          input.click();
        }}>Import Data</button>
      </div>
    </div>
  );
}
```

---

## API / API

### useChatPersistence

聊天数据持久化 Hook。

#### 参数 / Parameters

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| channelId | `string` | - | 频道 ID |
| initialChats | `Chat[]` | `[]` | 初始聊天列表 |

#### 返回值 / Returns

```typescript
interface UseChatPersistenceReturn {
  chats: Chat[];
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>;
  loading: boolean;
  exportData: () => void;
  importData: (jsonString: string) => boolean;
}
```

---

### useChannelManager

频道管理 Hook。

#### 返回值 / Returns

```typescript
interface UseChannelManagerReturn {
  channels: Channel[];
  activeChannelId: string;
  setActiveChannelId: (id: string) => void;
  createChannel: (name: string, options?: { isEncrypted?: boolean, preset?: string }) => string;
  deleteChannel: (id: string) => void;
  updateChannelName: (id: string, name: string) => void;
}
```

---

### TypingIndicator

打字指示器组件。

```tsx
<TypingIndicator />
```

---

## 数据结构 / Data Structures

### Chat

```typescript
interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  isStarred?: boolean;
  channelId?: string;
}
```

### Message

```typescript
interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  isStreaming?: boolean;
}
```

### Channel

```typescript
interface Channel {
  id: string;
  name: string;
  createdAt: Date;
  isEncrypted?: boolean;
  preset?: string;
}
```

---

## 频道管理 / Channel Management

### 创建频道

```tsx
const { createChannel } = useChannelManager();

const handleCreateChannel = () => {
  const channelId = createChannel('New Channel', {
    isEncrypted: false,
    preset: 'General'
  });
  console.log('Created channel:', channelId);
};
```

### 删除频道

```tsx
const { deleteChannel } = useChannelManager();

const handleDeleteChannel = (channelId: string) => {
  deleteChannel(channelId);
};
```

### 更新频道名称

```tsx
const { updateChannelName } = useChannelManager();

const handleRenameChannel = (channelId: string, newName: string) => {
  updateChannelName(channelId, newName);
};
```

---

## 数据导入导出 / Data Import/Export

### 导出数据

```tsx
const { exportData } = useChatPersistence();

<button onClick={exportData}>Export Data</button>
```

导出的数据格式：

```json
{
  "channelId": "main",
  "timestamp": "2026-03-26T00:00:00.000Z",
  "chats": [...]
}
```

### 导入数据

```tsx
const { importData } = useChatPersistence();

const handleImport = (file: File) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    const success = importData(e.target?.result as string);
    if (success) {
      alert('Import successful!');
    } else {
      alert('Import failed: Invalid data format');
    }
  };
  reader.readAsText(file);
};
```

---

## 最佳实践 / Best Practices

### 1. 自动保存

```tsx
const [message, setMessage] = useState('');

const handleSend = () => {
  if (!message.trim()) return;
  
  setChats(prev => {
    const newChats = [...prev];
    const lastChat = newChats[newChats.length - 1];
    if (lastChat) {
      lastChat.messages.push({
        id: `msg_${Date.now()}`,
        text: message,
        isUser: true,
        timestamp: new Date()
      });
    }
    return newChats;
  });
  
  setMessage('');
};
```

### 2. 频道切换

```tsx
const { activeChannelId, setActiveChannelId } = useChannelManager();

return (
  <div>
    {channels.map(channel => (
      <button
        key={channel.id}
        onClick={() => setActiveChannelId(channel.id)}
        className={channel.id === activeChannelId ? 'active' : ''}
      >
        {channel.name}
      </button>
    ))}
  </div>
);
```

### 3. 数据备份

```tsx
useEffect(() => {
  // 每 5 分钟自动备份
  const interval = setInterval(() => {
    exportData();
  }, 5 * 60 * 1000);
  
  return () => clearInterval(interval);
}, [exportData]);
```

---

## 故障排除 / Troubleshooting

### 数据未保存

1. 检查 localStorage 是否可用
2. 检查存储空间是否已满（最大 5MB）
3. 检查浏览器是否支持 localStorage

### 导入失败

1. 检查 JSON 格式是否正确
2. 检查数据结构是否符合预期
3. 查看控制台错误信息

### 频道无法删除

主频道（ID 为 'main'）无法删除，这是保护机制。

---

## 许可证 / License

MIT License

---

<div align="center">

> 「***YanYuCloudCube***」
> 「***<admin@0379.email>***」
> 「***Words Initiate Quadrants, Language Serves as Core for Future***」
> 「***All things converge in cloud pivot; Deep stacks ignite a new era of intelligence***」

</div>
