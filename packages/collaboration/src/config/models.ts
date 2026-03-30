export interface UIModelInfo {
  id: string;
  name: string;
  provider: string;
  description: string;
  contextLength: number;
  supportsStreaming: boolean;
  supportsVision: boolean;
  color: string;
  isAvailable: boolean;
}

export const MODEL_CATALOG: Record<string, UIModelInfo> = {
  'gpt-4o': {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'openai',
    description: 'OpenAI GPT-4o multimodal model',
    contextLength: 128000,
    supportsStreaming: true,
    supportsVision: true,
    color: '#10a37f',
    isAvailable: true,
  },
  'claude-3.5-sonnet': {
    id: 'claude-3.5-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: 'anthropic',
    description: 'Anthropic Claude 3.5 Sonnet',
    contextLength: 200000,
    supportsStreaming: true,
    supportsVision: true,
    color: '#d97757',
    isAvailable: true,
  },
  'llama-3.1-70b': {
    id: 'llama-3.1-70b',
    name: 'Llama 3.1 70B',
    provider: 'ollama',
    description: 'Meta Llama 3.1 70B via Ollama',
    contextLength: 128000,
    supportsStreaming: true,
    supportsVision: false,
    color: '#f59e0b',
    isAvailable: true,
  },
};

export const DEFAULT_MODEL = 'gpt-4o';
