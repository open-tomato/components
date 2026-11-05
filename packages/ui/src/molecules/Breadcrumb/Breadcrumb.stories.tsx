import type { Meta, StoryObj } from '@storybook/react-vite';

import { Breadcrumb } from './Breadcrumb';

const PATH = [
  { key: 'ws', label: 'ripe-tomatoes' },
  // @@S mol-2 begin
  { key: 'ag', label: 'Projects' },
  // @@S mol-2 end
  { key: 'bot', label: 'refactor-bot' },
  // @@S mol-2 begin
  { key: 's', label: 'Item #4128' },
  // @@S mol-2 end
];

// @@T mol-2 begin
const meta: Meta<typeof Breadcrumb> = {
// @@T mol-2 end
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
