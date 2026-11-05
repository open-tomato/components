import type { Meta, StoryObj } from '@storybook/react-vite';

import { Toast } from './Toast';

// @@T mol-2 begin
const meta: Meta<typeof Toast> = {
// @@T mol-2 end
  title: 'Molecules/Toast',
  component: Toast,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    tone: {
      control: 'select',
      options: ['success', 'warning', 'danger', 'info', 'neutral'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/** Defaults: success on dark chrome, dismissible. */
export const Default: Story = {
  // @@S mol-2 begin
  args: { children: 'Item created', onClose: () => {} },
  // @@S mol-2 end
};

export const Warning: Story = {
  args: { tone: 'warning', children: 'Approaching token limit', onClose: () => {} },
};

export const Danger: Story = {
  args: { tone: 'danger', children: 'Failed to connect', onClose: () => {} },
};

export const Info: Story = {
  // @@S mol-2 begin
  args: { tone: 'info', children: 'Item queued' },
  // @@S mol-2 end
};
