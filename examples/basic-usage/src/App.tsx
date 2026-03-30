import React, { useState } from 'react';
import { ErrorBoundary, GlassCard, FadeIn } from '@yyc3/core';
import { formatDate, getRelativeTime, uuid } from '@yyc3/utils';
import {
  useToggle,
  useLocalStorage,
  useDebounce,
  useWindowSize,
} from '@yyc3/hooks';

function DemoContent() {
  const [isDark, toggleDark] = useToggle(false);
  const [inputValue, setInputValue] = useState('');
  const [count, setCount] = useLocalStorage('demo-count', 0);
  const debouncedValue = useDebounce(inputValue, 500);
  const { width, height } = useWindowSize();

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <FadeIn>
        <h1 style={{ marginBottom: '30px', fontSize: '2.5em' }}>
          YYC3 Reusable Components
        </h1>

        <GlassCard
          style={{
            marginBottom: '20px',
            padding: '20px',
          }}
        >
          <h2>🎉 欢迎使用 YYC3 Reusable Components!</h2>
          <p style={{ marginTop: '10px', lineHeight: '1.6' }}>
            这是一个完整的React组件库，包含52个组件、7个自定义Hooks和28个工具函数。
          </p>
        </GlassCard>

        <GlassCard
          style={{
            marginBottom: '20px',
            padding: '20px',
          }}
        >
          <h3>🔧 工具函数示例</h3>
          <ul style={{ marginTop: '15px', lineHeight: '2' }}>
            <li>当前时间: {formatDate(new Date())}</li>
            <li>相对时间: {getRelativeTime(new Date())}</li>
            <li>生成的UUID: {uuid().substring(0, 8)}...</li>
          </ul>
        </GlassCard>

        <GlassCard
          style={{
            marginBottom: '20px',
            padding: '20px',
          }}
        >
          <h3>🎣 Hooks 示例</h3>
          <div style={{ marginTop: '15px' }}>
            <p>
              <strong>useToggle:</strong>{' '}
              <button
                onClick={() => toggleDark()}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  background: isDark ? '#333' : '#007AFF',
                  color: isDark ? '#fff' : '#fff',
                }}
              >
                {isDark ? '🌙 暗色模式' : '☀️ 亮色模式'}
              </button>
            </p>
            <p style={{ marginTop: '10px' }}>
              <strong>useLocalStorage:</strong> 计数器:{' '}
              <button
                onClick={() => setCount((c) => c + 1)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  background: '#007AFF',
                  color: '#fff',
                  marginLeft: '10px',
                }}
              >
                {count}
              </button>
            </p>
            <p style={{ marginTop: '10px' }}>
              <strong>useDebounce:</strong>{' '}
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="输入内容测试防抖..."
                style={{
                  padding: '8px',
                  borderRadius: '6px',
                  border: '1px solid #ccc',
                  width: '300px',
                }}
              />
              <span style={{ marginLeft: '10px', color: '#666' }}>
                {debouncedValue && `防抖结果: ${debouncedValue}`}
              </span>
            </p>
            <p style={{ marginTop: '10px' }}>
              <strong>useWindowSize:</strong> 窗口尺寸: {width} x {height}px
            </p>
          </div>
        </GlassCard>

        <GlassCard
          style={{
            marginBottom: '20px',
            padding: '20px',
          }}
        >
          <h3>📦 包列表</h3>
          <ul style={{ marginTop: '15px', lineHeight: '2' }}>
            <li>@yyc3/ui - 48个UI组件</li>
            <li>@yyc3/utils - 28个工具函数</li>
            <li>@yyc3/types - 50+个类型定义</li>
            <li>@yyc3/core - 4个核心组件</li>
            <li>@yyc3/hooks - 7个自定义Hooks</li>
            <li>@yyc3/error-handling - 错误处理系统</li>
            <li>@yyc3/i18n - 国际化系统</li>
            <li>@yyc3/storage - 存储系统</li>
          </ul>
        </GlassCard>
      </FadeIn>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary
      fallback={
        <div
          style={{
            padding: '20px',
            background: '#fee',
            color: '#c00',
            borderRadius: '8px',
            margin: '20px',
          }}
        >
          <h2>出错了！</h2>
          <p>组件渲染时发生了错误。</p>
        </div>
      }
    >
      <DemoContent />
    </ErrorBoundary>
  );
}
