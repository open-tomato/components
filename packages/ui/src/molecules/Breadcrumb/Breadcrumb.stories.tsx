import type { Meta, StoryObj } from '@storybook/react-vite';

import { Breadcrumb } from './Breadcrumb';

const PATH = [
  { key: 'ws', label: 'ripe-tomatoes' },
  { key: 'ag', label: 'Projects' },
  { key: 'bot', label: 'refactor-bot' },
  { key: 's', label: 'Item #4128' },
];

const meta: Meta<typeof Breadcrumb> = {
  title: 'Molecules/Breadcrumb',
  component: Breadcrumb,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: { items: PATH, index: 3 },
};

export default meta;
type Story = StoryObj<typeof meta>;

/** Current = last segment — the usual "where am I" shape. */
export const Default: Story = {};

/** Mid-path current: later segments render as upcoming. */
export const MidPath: Story = {
  args: { index: 1 },
};
