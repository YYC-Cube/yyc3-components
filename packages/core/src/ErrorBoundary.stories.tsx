import type { Meta, StoryObj } from '@storybook/react';
import { ErrorBoundary } from './ErrorBoundary';

const meta: Meta<typeof ErrorBoundary> = {
  title: 'Core/ErrorBoundary',
  component: ErrorBoundary,
  tags: ['autodocs'],
  argTypes: {
    fallback: {
      description: '错误发生时显示的fallback UI',
      control: 'text',
    },
    onError: {
      description: '错误回调函数',
      action: 'error',
    },
  },
};

export default meta;
type Story = StoryObj<typeof ErrorBoundary>;

export const Default: Story = {
  args: {
    fallback: <div style={{ padding: '20px', background: '#fee' }}>出错了！</div>,
    children: <div>正常内容</div>,
  },
};

export const WithError: Story = {
  args: {
    fallback: <div style={{ padding: '20px', background: '#fee' }}>出错了！</div>,
    children: (
      <BuggyComponent />
    ),
  },
};

function BuggyComponent() {
  throw new Error('这是一个测试错误');
}
