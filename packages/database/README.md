# @yyc3/database

YYC3 数据库管理库 - 完整的数据库连接和查询管理功能。

## ✨ 特性

- 🔗 数据库连接管理（连接、断开、池管理）
- 🔍 查询执行（SQL 查询、参数化查询）
- 📊 数据表管理（创建、修改、删除）
- 💾 事务管理（开始、提交、回滚）
- ⚙️ 配置管理（连接字符串、超时、池配置）

## 💡 使用示例

```tsx
import { useDatabase } from '@yyc3/database';

function DatabaseManager() {
  const {
    isConnected,
    executeQuery,
    beginTransaction,
    commitTransaction,
    rollbackTransaction,
  } = useDatabase();

  return (
    <div>
      <h1>Database Manager</h1>
      <p>Status: {isConnected ? 'Connected' : 'Disconnected'}</p>
    </div>
  );
}
```

## 📄 许可证

MIT License

---

Made with ❤️ by YanYuCloudCube Team
