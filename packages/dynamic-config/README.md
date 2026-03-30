# @yyc3/dynamic-config

YYC3 动态配置库 - 运行时配置管理和热重载。

## ✨ 特性

- ⚙️ 动态配置管理（运行时修改配置）
- 🔥 配置热重载（无需重启应用）
- 📝 配置版本控制（配置历史、回滚）
- ✔️ 配置验证（Schema validation）
- 💾 配置持久化（localStorage、IndexedDB）
- 📡 配置订阅（配置变化通知）

## 💡 使用示例

```tsx
import { useDynamicConfig } from '@yyc3/dynamic-config';

function Settings() {
  const { config, updateConfig } = useDynamicConfig();
  // ...
}
```

## 📄 许可证

MIT License

---

Made with ❤️ by YanYuCloudCube Team
