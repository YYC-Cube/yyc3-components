# @yyc3/supabase

YYC3 Supabase 同步库 - 完整的 Supabase 数据同步功能。

## ✨ 特性

- 🔗 Supabase 连接管理（认证、配置）
- 🔄 数据同步（自动同步、手动同步）
- 📡 实时订阅（数据变更监听）
- ⚙️ 配置管理（项目 URL、密钥管理）
- ❌ 错误处理（自动重试、错误日志）

## 💡 使用示例

```tsx
import { useSupabaseSync } from '@yyc3/supabase';

function SupabaseSync() {
  const { syncStatus, isSyncing, syncData, lastSyncTime } = useSupabaseSync();

  return (
    <div>
      <h1>Supabase Sync</h1>
      <p>Status: {syncStatus}</p>
      <p>Last Sync: {lastSyncTime}</p>
    </div>
  );
}
```

## 📄 许可证

MIT License

---

Made with ❤️ by YanYuCloudCube Team
