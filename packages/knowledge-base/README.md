# @yyc3/knowledge-base

YYC3 知识库 - 完整的知识管理和语义搜索。

## ✨ 特性

- 📚 知识库引擎（文档存储、索引、搜索）
- 🔗 知识图谱（实体、关系、属性）
- 🔄 知识同步引擎（增量同步、冲突解决）
- 🔍 知识查询（语义搜索、关系查询）
- 📤 知识导入导出（JSON、CSV、Markdown）
- 📝 知识版本控制（文档历史、版本对比）

## 💡 使用示例

```ts
import { KnowledgeBase } from '@yyc3/knowledge-base';

const kb = new KnowledgeBase();
await kb.addDocument({
  title: 'React Best Practices',
  content: '...',
  tags: ['react', 'best-practices']
});
```

## 📄 许可证

MIT License

---

Made with ❤️ by YanYuCloudCube Team
