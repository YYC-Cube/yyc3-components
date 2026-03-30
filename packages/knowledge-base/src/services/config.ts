export const kb = {
  enabled: true,
  vectorDb: 'memory',
  embedding: {
    provider: 'ollama',
    model: 'nomic-embed-text',
    ollamaModel: 'nomic-embed-text',
    dimensions: 0,
    defaultDimensions: {
      ollama: 768,
      openai: 1536,
    },
  },
  rag: {
    chunkSize: 512,
    chunkOverlap: 64,
    topK: 5,
    similarityThreshold: 0.7,
  },
  autoIndex: {
    enabled: false,
    interval: 60000,
  },
  docSources: [] as string[],
};

export const llm = {
  ollama: {
    baseUrl: 'http://localhost:11434',
  },
  openai: {
    baseUrl: 'https://api.openai.com/v1',
    apiKey: '',
  },
};
