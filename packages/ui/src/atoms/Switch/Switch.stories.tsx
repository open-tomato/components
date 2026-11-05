import type { Meta, StoryObj } from '@storybook/react-vite';

import { Switch } from './Switch';

// @@T ato-2 begin
const meta: Meta<typeof Switch> = {
// @@T ato-2 end
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
  // @@S ato-2 begin
  args: { 'aria-label': 'Enable feature' },
  // @@S ato-2 end
};

export const Checked: Story = {
  // @@S ato-2 begin
  args: { checked: true, 'aria-label': 'Enable feature' },
  // @@S ato-2 end
};

export const PrimaryTone: Story = {
  // @@S ato-2 begin
  args: { checked: true, tone: 'primary', 'aria-label': 'Enable feature' },
  // @@S ato-2 end
};

export const SmallSize: Story = {
  // @@S ato-2 begin
  args: { size: 'sm', checked: true, 'aria-label': 'Enable feature' },
  // @@S ato-2 end
};

export const Disabled: Story = {
  // @@S ato-2 begin
  args: { disabled: true, 'aria-label': 'Enable feature' },
  // @@S ato-2 end
};

export const CheckedDisabled: Story = {
  // @@S ato-2 begin
  args: { checked: true, disabled: true, 'aria-label': 'Enable feature' },
  // @@S ato-2 end
};
