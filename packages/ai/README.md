# @yyc3/ai

> YYC3 AI React Hooks
> YYC3 可复用组件库 - AI React Hooks

完整的中英文文档 | English and Chinese documentation

---

## 特性 / Features

- ✅ **流式响应** - 支持 SSE 流式输出 / Streaming response with SSE
- ✅ **多提供商** - OpenAI, Anthropic, Ollama, Zhipu, Qwen, DeepSeek / Multi-provider support
- ✅ **配置管理** - localStorage 持久化，支持版本迁移 / Config management with persistence
- ✅ **自动降级** - 网络失败时使用模拟响应 / Auto fallback with simulated response
- ✅ **TypeScript** - 完整类型支持 / Full TypeScript support

---

## 安装 / Installation

```bash
pnpm add @yyc3/ai
```

---

## 快速开始 / Quick Start

```tsx
import { useAI } from '@yyc3/ai';

function ChatComponent() {
  const { chat, isStreaming, config, saveConfig } = useAI();

  const handleSend = async (message: string) => {
    const messages = [
      { role: 'user' as const, content: message }
    ];
    
    await chat(messages, (chunk) => {
      console.log('Streaming:', chunk);
    });
  };

  return (
    <div>
      <button 
        onClick={() => handleSend('Hello AI!')} 
        disabled={isStreaming}
      >
        {isStreaming ? 'Thinking...' : 'Send'}
      </button>
    </div>
  );
}
```

---

## API / API

### useAI

AI 对话 Hook。

#### 返回值 / Returns

```typescript
interface UseAIReturn {
  chat: (messages: AIMessage[], onChunk: AIStreamCallback) => Promise<void>;
  isStreaming: boolean;
  config: AIConfig;
  saveConfig: (newConfig: AIConfig) => void;
  loading: boolean;
}
```

---

## 支持的提供商 / Supported Providers

```typescript
type AIProvider = 
  | 'openai'        // OpenAI
  | 'anthropic'     // Anthropic (Claude)
  | 'ollama'        // Ollama (Local LLM)
  | 'zhipu'         // Zhipu AI (GLM)
  | 'qwen'          // Alibaba Qwen
  | 'deepseek'      // DeepSeek
  | 'custom';       // Custom Provider
```

---

## 配置示例 / Configuration Examples

### OpenAI

```tsx
const { saveConfig } = useAI();

saveConfig({
  provider: 'openai',
  apiKey: 'sk-...',
  baseUrl: 'https://api.openai.com/v1',
  model: 'gpt-4',
  temperature: 0.7,
  maxTokens: 2000,
  version: 1
});
```

### Ollama (Local)

```tsx
saveConfig({
  provider: 'ollama',
  apiKey: 'ollama',
  baseUrl: 'http://localhost:11434/v1',
  model: 'llama3',
  temperature: 0.7,
  version: 1
});
```

### Zhipu AI

```tsx
saveConfig({
  provider: 'zhipu',
  apiKey: 'your-api-key',
  baseUrl: 'https://open.bigmodel.cn/api/paas/v4',
  model: 'glm-4',
  temperature: 0.7,
  version: 1
});
```

---

## 最佳实践 / Best Practices

### 1. 流式输出显示

```tsx
const [streamContent, setStreamContent] = useState('');

const handleSend = async (message: string) => {
  setStreamContent('');
  
  await chat(
    [{ role: 'user', content: message }],
    (chunk) => {
      setStreamContent(prev => prev + chunk);
    }
  );
};

return (
  <div>
    <div className="streaming-output">{streamContent}</div>
  </div>
);
```

### 2. 配置持久化

```tsx
useEffect(() => {
  // 配置会自动保存到 localStorage
  // Config is automatically saved to localStorage
  console.log('Current config:', config);
}, [config]);
```

### 3. 错误处理

```tsx
const handleSend = async (message: string) => {
  try {
    await chat(
      [{ role: 'user', content: message }],
      (chunk) => {
        console.log(chunk);
      }
    );
  } catch (error) {
    console.error('AI Error:', error);
    // 显示错误提示 / Show error notification
  }
};
```

---

## 故障排除 / Troubleshooting

### 连接失败 / Connection Failed

1. 检查 API Key 是否正确
2. 检查 Base URL 是否可访问
3. 检查网络连接

### 流式输出卡住 / Streaming Stuck

1. 检查网络连接
2. 尝试降低 `temperature` 值
3. 检查服务器日志

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
