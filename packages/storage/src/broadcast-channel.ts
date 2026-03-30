/**
 * broadcast-channel.ts
 * ===================
 * YYC3 BroadcastChannel 工具
 *
 * 功能：
 * - 跨标签页通信
 * - 跨窗口通信
 * - 类型安全
 * - 自动清理
 */

// ============================================================
// 类型定义
// ============================================================

export interface ChannelConfig<T> {
  /** 频道名称 */
  name: string;
  /** 消息处理器 */
  onMessage?: (data: T) => void;
  /** 是否自动清理 */
  autoCleanup?: boolean;
}

// ============================================================
// BroadcastChannel 封装类
// ============================================================

export class BroadcastChannelManager<T = unknown> {
  private channel: BroadcastChannel | null = null;
  private config: ChannelConfig<T>;
  private closed = false;

  constructor(config: ChannelConfig<T>) {
    this.config = {
      autoCleanup: true,
      ...config,
    };
  }

  /**
   * 打开频道
   */
  open(): void {
    if (this.closed) {
      throw new Error("Channel has been closed");
    }

    if (this.channel) {
      return; // 已经打开
    }

    try {
      this.channel = new BroadcastChannel(this.config.name);

      // 监听消息
      if (this.config.onMessage) {
        this.channel.onmessage = (event) => {
          this.config.onMessage!(event.data as T);
        };
      }
    } catch (error) {
      console.error("Failed to open BroadcastChannel:", error);
      // 降级到localStorage
      this.useLocalStorageFallback();
    }
  }

  /**
   * 发送消息
   */
  send(data: T): void {
    if (this.closed) {
      throw new Error("Channel has been closed");
    }

    if (this.channel) {
      this.channel.postMessage(data);
    } else {
      // 使用localStorage发送
      this.sendViaLocalStorage(data);
    }
  }

  /**
   * 关闭频道
   */
  close(): void {
    if (this.closed) {
      return;
    }

    this.closed = true;

    if (this.channel) {
      this.channel.close();
      this.channel = null;
    }

    // 清理localStorage监听
    if (this.config.autoCleanup) {
      this.cleanupLocalStorageFallback();
    }
  }

  /**
   * 使用localStorage作为fallback
   */
  private localStorageKey = `broadcast_${this.config.name}`;
  private storageListener: ((event: StorageEvent) => void) | null = null;

  private useLocalStorageFallback(): void {
    if (this.config.onMessage) {
      this.storageListener = (event) => {
        if (event.key === this.localStorageKey) {
          try {
            const data = JSON.parse(event.newValue || "");
            this.config.onMessage!(data as T);
          } catch (error) {
            console.error("Failed to parse localStorage message:", error);
          }
        }
      };

      window.addEventListener("storage", this.storageListener);
    }
  }

  private sendViaLocalStorage(data: T): void {
    try {
      localStorage.setItem(this.localStorageKey, JSON.stringify(data));
      // 立即触发事件（同一页面）
      setTimeout(() => {
        localStorage.removeItem(this.localStorageKey);
      }, 0);
    } catch (error) {
      console.error("Failed to send via localStorage:", error);
    }
  }

  private cleanupLocalStorageFallback(): void {
    if (this.storageListener) {
      window.removeEventListener("storage", this.storageListener);
      this.storageListener = null;
    }

    try {
      localStorage.removeItem(this.localStorageKey);
    } catch (error) {
      // 静默失败
    }
  }
}

// ============================================================
// 快捷函数
// ============================================================

/**
 * 创建BroadcastChannel实例
 */
export function createBroadcastChannel<T = unknown>(
  name: string,
  onMessage?: (data: T) => void
): BroadcastChannelManager<T> {
  const channel = new BroadcastChannelManager<T>({ name, onMessage });
  channel.open();
  return channel;
}

/**
 * 发送一次性消息（不保持频道打开）
 */
export async function sendMessage<T = unknown>(
  name: string,
  data: T
): Promise<void> {
  const channel = new BroadcastChannelManager<T>({ name });
  channel.send(data);
  channel.close();
}

/**
 * 监听一次性消息
 */
export function onMessage<T = unknown>(
  name: string,
  handler: (data: T) => void,
  timeout?: number
): () => void {
  const channel = new BroadcastChannelManager<T>({
    name,
    onMessage: (data) => {
      handler(data);
      channel.close();
    },
  });

  channel.open();

  // 设置超时
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  if (timeout) {
    timeoutId = setTimeout(() => {
      channel.close();
    }, timeout);
  }

  // 返回清理函数
  return () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    channel.close();
  };
}
