import type { Meta, StoryObj } from '@storybook/react';
import { FadeIn } from './FadeIn';

const meta: Meta<typeof FadeIn> = {
  title: 'Core/FadeIn',
  component: FadeIn,
  tags: ['autodocs'],
  argTypes: {
    children: {
      description: '要动画的子元素',
      control: 'text',
    },
    duration: {
      description: '动画持续时间（毫秒）',
      control: 'number',
    },
    delay: {
      description: '动画延迟（毫秒）',
      control: 'number',
    },
  },
};

export default meta;
type Story = StoryObj<typeof FadeIn>;

export const Default: Story = {
  args: {
    children: <div style={{ padding: '20px', background: '#007AFF', color: '#fff', borderRadius: '8px' }}>
      淡入动画
    </div>,
  },
};

export const WithDelay: Story = {
  args: {
    children: <div style={{ padding: '20px', background: '#28a745', color: '#fff', borderRadius: '8px' }}>
      延迟1秒后淡入
    </div>,
    delay: 1000,
  },
};

export const SlowAnimation: Story = {
  args: {
    children: <div style={{ padding: '20px', background: '#dc3545', color: '#fff', borderRadius: '8px' }}>
      慢速淡入（2秒）
    </div>,
    duration: 2000,
  },
};

export const MultipleItems: Story = {
  args: {
    children: (
      <div style={{ display: 'flex', gap: '10px' }}>
        <div style={{ padding: '20px', background: '#007AFF', color: '#fff', borderRadius: '8px' }}>
          项目 1
        </div>
        <FadeIn delay={200}>
          <div style={{ padding: '20px', background: '#28a745', color: '#fff', borderRadius: '8px' }}>
            项目 2
          </div>
        </FadeIn>
        <FadeIn delay={400}>
          <div style={{ padding: '20px', background: '#dc3545', color: '#fff', borderRadius: '8px' }}>
            项目 3
          </div>
        </FadeIn>
      </div>
    ),
  },
};
