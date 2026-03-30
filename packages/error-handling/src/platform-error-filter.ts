/**
 * platform-error-filter.ts
 * ========================
 * 平台错误过滤工具
 *
 * 功能：
 * - 统一判定平台特定错误（如Figma iframe）
 * - 提供可配置的过滤规则
 * - 支持自定义错误来源
 */

/**
 * 过滤规则配置
 */
export interface FilterRule {
  /** 错误名称匹配模式（支持部分匹配） */
  namePattern?: string | string[];
  /** 错误消息匹配模式（支持部分匹配） */
  messagePattern?: string | string[];
  /** 来源文件/URL匹配模式（支持部分匹配） */
  sourcePattern?: string | string[];
  /** 堆栈匹配模式（支持部分匹配） */
  stackPattern?: string | string[];
}

/**
 * 错误上下文
 */
export interface ErrorContext {
  /** 错误名称或类型 */
  name: string;
  /** 错误消息 */
  message: string;
  /** 来源文件名或URL */
  source?: string;
  /** 错误堆栈 */
  stack?: string;
}

/**
 * 平台错误过滤器类
 */
export class PlatformErrorFilter {
  private rules: FilterRule[];

  constructor(rules: FilterRule[] = []) {
    this.rules = rules;
  }

  /**
   * 添加过滤规则
   */
  addRule(rule: FilterRule): void {
    this.rules.push(rule);
  }

  /**
   * 清除所有规则
   */
  clearRules(): void {
    this.rules = [];
  }

  /**
   * 判断是否应该过滤（忽略）该错误
   */
  shouldFilter(context: ErrorContext): boolean {
    return this.rules.some((rule) => this.matchRule(rule, context));
  }

  /**
   * 检查错误是否匹配规则
   */
  private matchRule(rule: FilterRule, ctx: ErrorContext): boolean {
    const { name, message, source, stack } = ctx;

    // 检查名称
    if (rule.namePattern) {
      const patterns = Array.isArray(rule.namePattern)
        ? rule.namePattern
        : [rule.namePattern];
      if (patterns.some((p) => name.toLowerCase().includes(p.toLowerCase()))) {
        return true;
      }
    }

    // 检查消息
    if (rule.messagePattern) {
      const patterns = Array.isArray(rule.messagePattern)
        ? rule.messagePattern
        : [rule.messagePattern];
      if (patterns.some((p) => message.toLowerCase().includes(p.toLowerCase()))) {
        return true;
      }
    }

    // 检查来源
    if (rule.sourcePattern && source) {
      const patterns = Array.isArray(rule.sourcePattern)
        ? rule.sourcePattern
        : [rule.sourcePattern];
      if (patterns.some((p) => source.toLowerCase().includes(p.toLowerCase()))) {
        return true;
      }
    }

    // 检查堆栈
    if (rule.stackPattern && stack) {
      const patterns = Array.isArray(rule.stackPattern)
        ? rule.stackPattern
        : [rule.stackPattern];
      if (patterns.some((p) => stack.toLowerCase().includes(p.toLowerCase()))) {
        return true;
      }
    }

    return false;
  }
}

/**
 * 创建Figma平台错误过滤器
 */
export function createFigmaErrorFilter(): PlatformErrorFilter {
  const filter = new PlatformErrorFilter([
    {
      namePattern: ["iframe", "abort", "iframemessage"],
      messagePattern: ["message aborted", "message port", "iframe"],
    },
    {
      sourcePattern: ["figma.com", "webpack-artifacts", "figma_app"],
    },
  ]);

  return filter;
}

/**
 * 快捷函数：判断是否为平台错误
 */
export function isPlatformError(
  name: string,
  message: string,
  source?: string,
  stack?: string
): boolean {
  const ctx: ErrorContext = { name, message, source, stack };

  // 默认使用Figma过滤器
  const filter = createFigmaErrorFilter();
  return filter.shouldFilter(ctx);
}
