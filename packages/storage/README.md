# @yyc3/storage

YYC3可复用组件库 - 存储系统

## 📦 概述

`@yyc3/storage` 提供了一套完整的存储解决方案，包括IndexedDB和BroadcastChannel工具。

## 🎯 特性

- ✅ **IndexedDB封装** - 简单的IndexedDB操作接口
- ✅ **自动初始化** - 数据库自动初始化和版本管理
- ✅ **BroadcastChannel** - 跨标签页/窗口通信
- ✅ **localStorage fallback** - 降级机制
- ✅ **TypeScript支持** - 完整类型定义
- ✅ **零依赖** - 纯TypeScript实现

## 📋 核心功能

### 1. IndexedDB - IndexedDB封装

提供简单易用的IndexedDB操作接口。

**功能**:

- 自动初始化数据库
- 支持自定义存储定义
- 完整的CRUD操作
- 错误处理

**使用示例**:

```ts
import { IndexedDB, createIndexedDB, SimpleIndexedDB } from '@yyc3/storage';

// 方式1: 使用完整配置
const db = createIndexedDB({
  name: 'myDatabase',
  version: 1,
  stores: [
    { name: 'users', keyPath: 'id' },
    { name: 'posts', keyPath: 'id', autoIncrement: true },
  ],
});

// 添加数据
await db.put('users', { id: '1', name: 'John' });

// 获取数据
const user = await db.get('users', '1');
console.log(user);

// 获取所有数据
const users = await db.getAll('users');
console.log(users);

// 删除数据
await db.delete('users', '1');

// 清空存储
await db.clear('users');

// 方式2: 使用简化配置
const simpleDB = new SimpleIndexedDB('myDB', ['users', 'posts'], 1);
await simpleDB.put('users', { id: '2', name: 'Jane' });
```

### 2. BroadcastChannel - 跨标签页通信

提供跨标签页和跨窗口的通信能力。

**功能**:

- 跨标签页通信
- 跨窗口通信
- 自动降级到localStorage
- 自动清理

**使用示例**:

```ts
import {
  BroadcastChannelManager,
  createBroadcastChannel,
  sendMessage,
  onMessage,
} from '@yyc3/storage';

// 方式1: 使用管理器
const channel = new BroadcastChannelManager<string>({
  name: 'myChannel',
  onMessage: (data) => {
    console.log('收到消息:', data);
  },
});

channel.open();
channel.send('Hello from tab 1');

// 方式2: 使用快捷创建函数
const quickChannel = createBroadcastChannel('quickChannel', (data) => {
  console.log('收到消息:', data);
});

// 方式3: 发送一次性消息
await sendMessage('notification', {
  type: 'info',
  message: '更新完成',
});

// 方式4: 监听一次性消息
const cleanup = onMessage(
  'response',
  (data) => {
    console.log('收到响应:', data);
  },
  5000
); // 5秒超时

// 清理
cleanup();
```

## 📦 安装

```bash
npm install @yyc3/storage
# 或
yarn add @yyc3/storage
# 或
pnpm add @yyc3/storage
```

## 🚀 快速开始

### IndexedDB基础使用

```ts
import { createIndexedDB } from '@yyc3/storage';

// 创建数据库
const db = createIndexedDB({
  name: 'appDatabase',
  version: 1,
  stores: [
    { name: 'settings', keyPath: 'key' },
    { name: 'cache', keyPath: 'id' },
  ],
});

// 使用
async function saveSetting(key: string, value: unknown) {
  await db.put('settings', { key, value });
}

async function getSetting(key: string) {
  const record = await db.get('settings', key);
  return record?.value;
}

async function clearCache() {
  await db.clear('cache');
}
```

### BroadcastChannel跨标签页通信

```ts
import { createBroadcastChannel } from '@yyc3/storage';

// 在标签页1发送
const sender = createBroadcastChannel('tabSync');
sender.open();

function broadcastUpdate() {
  sender.send({
    type: 'dataUpdated',
    timestamp: Date.now(),
  });
}

// 在标签页2接收
const receiver = createBroadcastChannel('tabSync', (data) => {
  if (data.type === 'dataUpdated') {
    console.log('数据已更新，刷新...');
    // 刷新数据
    refreshData();
  }
});
receiver.open();
```

### 跨组件通信

```tsx
import { BroadcastChannelManager } from '@yyc3/storage';

function ComponentA() {
  const channel = useRef<BroadcastChannelManager<string> | null>(null);

  useEffect(() => {
    channel.current = new BroadcastChannelManager({
      name: 'componentEvents',
      onMessage: (data) => {
        console.log('收到事件:', data);
      },
    });
    channel.current.open();

    return () => {
      channel.current?.close();
    };
  }, []);

  const handleClick = () => {
    channel.current?.send('ButtonClicked');
  };

  return <button onClick={handleClick}>点击</button>;
}

function ComponentB() {
  useEffect(() => {
    const channel = new BroadcastChannelManager({
      name: 'componentEvents',
      onMessage: (data) => {
        if (data === 'ButtonClicked') {
          alert('按钮被点击了！');
        }
      },
    });
    channel.open();

    return () => {
      channel.close();
    };
  }, []);

  return <p>等待事件...</p>;
}
```

## 📊 API 参考

### IndexedDB

| 方法                     | 返回类型                  | 说明              |
| ------------------------ | ------------------------- | ----------------- |
| `constructor(config)`    | -                         | 创建IndexedDB实例 |
| `getDatabase()`          | `Promise<IDBDatabase>`    | 获取数据库实例    |
| `put(storeName, data)`   | `Promise<void>`           | 添加或更新数据    |
| `get(storeName, key)`    | `Promise<T \| undefined>` | 获取单条数据      |
| `getAll(storeName)`      | `Promise<T[]>`            | 获取所有数据      |
| `delete(storeName, key)` | `Promise<void>`           | 删除单条数据      |
| `clear(storeName)`       | `Promise<void>`           | 清空存储          |
| `close()`                | `void`                    | 关闭数据库        |

### BroadcastChannel

| 方法                  | 返回类型 | 说明                     |
| --------------------- | -------- | ------------------------ |
| `constructor(config)` | -        | 创建BroadcastChannel实例 |
| `open()`              | `void`   | 打开频道                 |
| `send(data)`          | `void`   | 发送消息                 |
| `close()`             | `void`   | 关闭频道                 |

## 🎨 使用场景

### 1. 离线数据缓存

```ts
import { createIndexedDB } from '@yyc3/storage';

const cacheDB = createIndexedDB({
  name: 'offlineCache',
  version: 1,
  stores: [{ name: 'apiCache', keyPath: 'url' }],
});

async function getCachedData<T>(url: string): Promise<T | null> {
  const record = await cacheDB.get('apiCache', url);
  return record?.data || null;
}

async function cacheData(
  url: string,
  data: unknown,
  ttl = 3600000
): Promise<void> {
  await cacheDB.put('apiCache', {
    url,
    data,
    timestamp: Date.now(),
    expiresAt: Date.now() + ttl,
  });
}

async function getWithCache<T>(
  url: string,
  fetcher: () => Promise<T>
): Promise<T> {
  // 先查缓存
  const cached = await getCachedData<T>(url);
  if (cached) {
    return cached;
  }

  // 获取新数据
  const data = await fetcher();
  await cacheData(url, data);
  return data;
}
```

### 2. 多标签页同步状态

```ts
import { createBroadcastChannel } from '@yyc3/storage';

const syncChannel = createBroadcastChannel('appSync', (message) => {
  switch (message.type) {
    case 'themeChanged':
      updateTheme(message.theme);
      break;
    case 'userLogout':
      redirectToLogin();
      break;
    case 'dataRefresh':
      refreshData();
      break;
  }
});

// 在标签页A更改主题
function changeTheme(theme: string) {
  setTheme(theme);
  syncChannel.send({
    type: 'themeChanged',
    theme,
  });
}
```

### 3. 实时通知

```ts
import { onMessage } from '@yyc3/storage';

// 在主应用发送通知
async function sendNotification(message: string) {
  const channel = new BroadcastChannelManager<string>({
    name: 'notifications',
  });
  channel.open();
  channel.send(message);
  channel.close();
}

// 在通知组件监听
function NotificationComponent() {
  useEffect(() => {
    const cleanup = onMessage('notifications', (message) => {
      showToast(message);
    });

    return cleanup;
  }, []);

  return <div>通知区域</div>;
}
```

## 🔧 开发

```bash
# 安装依赖
npm install

# 类型检查
npm run type-check

# 构建
npm run build

# 监听模式
npm run dev
```

## 📊 统计信息

- **代码量**: ~350行
- **类数量**: 2个 (IndexedDB, BroadcastChannelManager)
- **快捷函数**: 4个
- **TypeScript**: 100%覆盖

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 依赖

零依赖

## 📝 许可证

MIT
