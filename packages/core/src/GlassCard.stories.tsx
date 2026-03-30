import type { Meta, StoryObj } from '@storybook/react';
import { GlassCard } from './GlassCard';

const meta: Meta<typeof GlassCard> = {
  title: 'Core/GlassCard',
  component: GlassCard,
  tags: ['autodocs'],
  argTypes: {
    children: {
      description: '卡片内容',
      control: 'text',
    },
    className: {
      description: '自定义类名',
      control: 'text',
    },
    style: {
      description: '自定义样式',
      control: 'object',
    },
  },
};

export default meta;
type Story = StoryObj<typeof GlassCard>;

export const Default: Story = {
  args: {
    children: '这是一个玻璃态卡片',
  },
};

export const WithContent: Story = {
  args: {
    children: (
      <div style={{ padding: '20px' }}>
        <h3>玻璃态卡片</h3>
        <p>这是一个美观的毛玻璃效果卡片组件。</p>
      </div>
    ),
    style: {
      padding: '20px',
      borderRadius: '12px',
      maxWidth: '400px',
    },
  },
};

export const DarkBackground: Story = {
  args: {
    children: (
      <div style={{ padding: '20px', color: '#fff' }}>
        <h3>深色背景</h3>
        <p>在深色背景上的效果。</p>
      </div>
    ),
    style: {
      padding: '30px',
      borderRadius: '16px',
      maxWidth: '400px',
      background: '#333',
    },
  },
  parameters: {
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#333' },
        { name: 'light', value: '#f5f5f5' },
      ],
    },
  },
};
