/**
 * file: utils.ts
 * description: AI 工具函数 · 提供 AI 流式响应解析工具
 * author: YanYuCloudCube Team
 * version: v1.0.0
 * created: 2026-03-26
 * updated: 2026-03-26
 * status: active
 * tags: [ai],[utils],[stream]
 *
 * copyright: YanYuCloudCube Team
 * license: MIT
 *
 * brief: AI 流式响应解析工具
 *
 * details:
 * - createAIStreamParser: 创建流式响应解析器
 * - 支持 SSE (Server-Sent Events) 格式
 * - 异步生成器模式，便于逐步处理
 * - 自动处理 buffer 和解析错误
 * - 适用于 Fetch API 的 Response 对象
 *
 * dependencies: Fetch API, AsyncGenerator
 * exports: createAIStreamParser, StreamChunk
 * notes: 解析器会自动忽略无效的数据块和解析错误
 */

/**
 * 流式块 / Stream Chunk
 */
export interface StreamChunk {
  /** 内容 / Content */
  content: string;
  /** 是否结束 / Is done */
  done: boolean;
}

/**
 * 创建 AI 流式解析器 / Create AI stream parser
 *
 * @returns {(response: Response) => AsyncGenerator<StreamChunk>} 流式解析器 / Stream parser
 *
 * @example
 * ```ts
 * const parseStream = createAIStreamParser();
 *
 * for await (const chunk of parseStream(response)) {
 *   console.log(chunk.content);
 *   if (chunk.done) break;
 * }
 * ```
 */
export function createAIStreamParser() {
  return async function* (response: Response): AsyncGenerator<StreamChunk> {
    if (!response.body) {
      throw new Error('No response body');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        yield { content: '', done: true };
        break;
      }

      const chunk = decoder.decode(value, { stream: true });
      const lines = (buffer + chunk).split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('data: ')) {
          const dataStr = trimmed.slice(6);
          if (dataStr === '[DONE]') {
            yield { content: '', done: true };
            return;
          }

          try {
            const data = JSON.parse(dataStr);
            const content = data.choices?.[0]?.delta?.content || '';
            if (content) {
              yield { content, done: false };
            }
          } catch (e) {
            // 忽略解析错误 / Ignore parse errors
          }
        }
      }
    }
  };
}
