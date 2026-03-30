# @yyc3/workflow-engine

YYC3 工作流引擎 - 完整的工作流编排和自动化。

## ✨ 特性

- 🔄 工作流引擎（工作流定义、执行、暂停、恢复）
- 📋 工作流步骤（顺序、并行、条件、循环）
- 🎯 工作流变量（上下文、输入输出）
- 📊 工作流事件（开始、完成、失败、超时）
- 📝 工作流历史（执行历史、日志）
- 🔀 工作流编排（子工作流、依赖关系）

## 💡 使用示例

```ts
import { WorkflowEngine } from '@yyc3/workflow-engine';

const engine = new WorkflowEngine();
const workflow = engine.createWorkflow({
  name: 'CI/CD Pipeline',
  steps: [
    { name: 'Build', action: 'build' },
    { name: 'Test', action: 'test' },
    { name: 'Deploy', action: 'deploy' }
  ]
});
```

## 📄 许可证

MIT License

---

Made with ❤️ by YanYuCloudCube Team
