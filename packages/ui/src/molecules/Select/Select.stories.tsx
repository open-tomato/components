import type { Meta, StoryObj } from '@storybook/react-vite';

import { useState } from 'react';

import { Select, type SelectProps } from './Select';

const MODEL_OPTIONS = [
  { value: 'haiku-4', label: 'haiku-4' },
  { value: 'sonnet-4.5', label: 'sonnet-4.5' },
  { value: 'opus-4', label: 'opus-4' },
];

const DENSITY_OPTIONS = [
  { value: 'comfortable', label: 'Comfortable' },
  { value: 'compact', label: 'Compact' },
];

// @@T mol-1 begin
const meta: Meta<typeof Select> = {
// @@T mol-1 end
  title: 'Molecules/Select',
  component: Select,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md'] },
  },
  decorators: [
    (Story) => (
      <div className="flex h-[220px] w-[320px] justify-center pt-4">
        <Story />
      </div>
    ),
  ],
// @@T mol-1 begin
};
// @@T mol-1 end

export default meta;
type Story = StoryObj<typeof meta>;

const ControlledSelect = (args: SelectProps) => {
  const [value, setValue] = useState(args.value);
  return <Select {...args} value={value} onChange={setValue} />;
};

/** The form kit's model picker (closed trigger state). */
export const Default: Story = {
  args: {
    value: 'sonnet-4.5',
    options: MODEL_OPTIONS,
    onChange: () => {},
    width: 180,
    ariaLabel: 'Default model',
  },
  render: (args) => <ControlledSelect {...args} />,
};

/** sm — the toolbar's inline density picker height. */
export const Small: Story = {
  ...Default,
  args: {
    ...Default.args,
    size: 'sm',
    value: 'comfortable',
    options: DENSITY_OPTIONS,
    width: 170,
    ariaLabel: 'Row density',
  },
};
