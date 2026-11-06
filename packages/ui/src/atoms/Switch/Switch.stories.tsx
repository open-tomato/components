import type { Meta, StoryObj } from '@storybook/react-vite';

import { Switch } from './Switch';

const meta: Meta<typeof Switch> = {
  title: 'Atoms/Switch',
  component: Switch,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md'] },
    tone: { control: 'select', options: ['accent', 'primary'] },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/** Defaults: md accent, off. */
export const Default: Story = {
  args: { 'aria-label': 'Enable feature' },
};

export const Checked: Story = {
  args: { checked: true, 'aria-label': 'Enable feature' },
};

export const PrimaryTone: Story = {
  args: { checked: true, tone: 'primary', 'aria-label': 'Enable feature' },
};

export const SmallSize: Story = {
  args: { size: 'sm', checked: true, 'aria-label': 'Enable feature' },
};

export const Disabled: Story = {
  args: { disabled: true, 'aria-label': 'Enable feature' },
};

export const CheckedDisabled: Story = {
  args: { checked: true, disabled: true, 'aria-label': 'Enable feature' },
};
