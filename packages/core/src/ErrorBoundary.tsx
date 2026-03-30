/**
 * ErrorBoundary.tsx
 * ==================
 * YYC3 错误边界组件
 *
 * 功能：
 * - 捕获子组件树中的 JavaScript 错误
 * - 显示优雅的降级 UI
 * - 错误日志自动记录
 * - 支持重试、回到首页、查看错误详情
 * - 分级错误展示（页面级 / 模块级 / 组件级）
 */

import React, { Component, type ErrorInfo, type ReactNode } from "react";
import type { AppError, ErrorBoundaryLevel } from "@yyc3/types";
import {
  AlertTriangle,
  Bug,
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  Home,
  RefreshCw,
} from "lucide-react";

// ============================================================
// Types
// ============================================================

interface ErrorBoundaryProps {
  children: ReactNode;
  /** 错误边界级别，影响降级 UI 的大小和样式 */
  level?: ErrorBoundaryLevel;
  /** 自定义降级 UI */
  fallback?: ReactNode | ((error: Error, reset: () => void) => ReactNode);
  /** 错误来源标识 */
  source?: string;
  /** 错误回调 */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  /** 错误处理函数（可选，用于记录错误） */
  onCaptureError?: (error: Error, options?: { source?: string }) => AppError | void;
  /** 自定义错误生成器（可选） */
  generateErrorId?: () => string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  appError: AppError | null;
  showDetail: boolean;
  copied: boolean;
}

// ============================================================
// Component
// ============================================================

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      appError: null,
      showDetail: false,
      copied: false,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> | null {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // 记录错误
    let appError: AppError | null = null;

    if (this.props.onCaptureError) {
      appError = this.props.onCaptureError(error, {
        source: this.props.source || "ErrorBoundary",
      }) || null;
    } else {
      // 默认错误记录
      const generateId = this.props.generateErrorId || (() => `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
      appError = {
        id: generateId(),
        message: error.message,
        category: "runtime",
        severity: "critical",
        timestamp: Date.now(),
        stack: error.stack,
        resolved: false,
        source: this.props.source || "ErrorBoundary",
      };
    }

    this.setState({ errorInfo, appError });

    // 调用外部回调
    this.props.onError?.(error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      appError: null,
      showDetail: false,
    });
  };

  handleGoHome = (): void => {
    window.location.href = "/";
  };

  handleCopyError = (): void => {
    const { error, errorInfo, appError } = this.state;
    const report = [
      `=== YYC3 错误报告 ===`,
      `时间: ${new Date().toISOString()}`,
      `错误ID: ${appError?.id || "N/A"}`,
      `分类: ${appError?.category || "RUNTIME"}`,
      `消息: ${error?.message || "未知错误"}`,
      ``,
      `=== 堆栈跟踪 ===`,
      error?.stack || "无堆栈信息",
      ``,
      `=== 组件堆栈 ===`,
      errorInfo?.componentStack || "无组件堆栈",
    ].join("\n");

    navigator.clipboard.writeText(report).then(() => {
      this.setState({ copied: true });
      setTimeout(() => this.setState({ copied: false }), 2000);
    });
  };

  render(): ReactNode {
    const { hasError, error, errorInfo, showDetail, copied } = this.state;
    const { children, level = "page", fallback } = this.props;

    if (!hasError) {
      return children;
    }

    // 自定义 fallback
    if (fallback) {
      if (typeof fallback === "function") {
        return fallback(error!, this.handleReset);
      }
      return fallback;
    }

    // Widget 级别 - 最小化错误展示
    if (level === "component") {
      return (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
          <span className="text-red-600 dark:text-red-400 truncate text-xs">
            组件加载失败
          </span>
          <button
            onClick={this.handleReset}
            className="ml-auto p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-red-500 dark:text-red-500" />
          </button>
        </div>
      );
    }

    // Module 级别 - 中等错误展示
    if (level === "module") {
      return (
        <div className="rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-lg bg-red-100 dark:bg-red-900/30">
              <Bug className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h3 className="text-gray-900 dark:text-gray-100 text-sm font-medium">模块加载异常</h3>
              <p className="text-red-600 dark:text-red-400 text-xs">
                {error?.message || "发生未知错误"}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={this.handleReset}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors text-xs"
            >
              <RefreshCw className="w-4 h-4" />
              重新加载
            </button>
            <button
              onClick={this.handleCopyError}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors text-xs"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? "已复制" : "复制错误"}
            </button>
          </div>
        </div>
      );
    }

    // Page 级别 - 完整错误展示
    return (
      <div className="h-full w-full flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-900">
        <div className="w-full max-w-lg rounded-xl bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800">
                <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h2 className="text-gray-900 dark:text-gray-100 text-lg font-medium mb-1">
                  系统异常
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-xs">
                  捕获到一个运行时错误
                </p>
              </div>
            </div>
          </div>

          {/* Error Message */}
          <div className="p-6">
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 mb-4">
              <p className="text-red-600 dark:text-red-400 font-mono text-sm break-all">
                {error?.message || "未知错误"}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2 mb-4">
              <button
                onClick={this.handleReset}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors text-xs"
              >
                <RefreshCw className="w-4 h-4" />
                重新加载
              </button>
              <button
                onClick={this.handleGoHome}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors text-xs"
              >
                <Home className="w-4 h-4" />
                返回首页
              </button>
              <button
                onClick={this.handleCopyError}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors text-xs"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? "已复制" : "复制报告"}
              </button>
            </div>

            {/* Expandable Detail */}
            <button
              onClick={() => this.setState({ showDetail: !showDetail })}
              className="flex items-center gap-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 transition-colors text-xs"
            >
              {showDetail ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              {showDetail ? "收起" : "展开"}错误详情
            </button>

            {showDetail && (
              <div className="mt-3 p-3 rounded-xl bg-gray-900 dark:bg-black border border-gray-200 dark:border-gray-800 max-h-60 overflow-auto">
                <p className="text-gray-400 dark:text-gray-500 mb-2 text-xs">
                  堆栈跟踪:
                </p>
                <pre className="text-red-500 dark:text-red-400 font-mono whitespace-pre-wrap break-all text-xs">
                  {error?.stack || "无堆栈信息"}
                </pre>
                {errorInfo?.componentStack && (
                  <>
                    <p className="text-gray-400 dark:text-gray-500 mb-2 mt-4 text-xs">
                      组件堆栈:
                    </p>
                    <pre className="text-gray-300 dark:text-gray-400 font-mono whitespace-pre-wrap break-all text-xs">
                      {errorInfo.componentStack}
                    </pre>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <span className="text-gray-400 dark:text-gray-500 text-xs">
              YYC3 ErrorBoundary v1.0
            </span>
            <span className="text-gray-400 dark:text-gray-500 text-xs">
              {new Date().toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    );
  }
}
