# @yyc3/crdt

YYC3 CRDT 库 - 无冲突复制数据类型，用于分布式系统。

## ✨ 特性

- 🔄 CRDT 数据结构（LWW-Element-Set, RGA, G-Counter, PN-Counter）
- 🔧 CRDT 同步引擎（服务端仲裁）
- ⚡ 操作转换（Operational Transformation）
- 📊 版本向量管理（Version Vector）
- 🎯 冲突检测与解决（Last-Writer-Wins, Merge）

## 💡 使用示例

```ts
import { CRDTEngine } from '@yyc3/crdt';

const engine = new CRDTEngine();
const doc = engine.createDocument('my-doc');
```

## 📄 许可证

MIT License

---

Made with ❤️ by YanYuCloudCube Team
