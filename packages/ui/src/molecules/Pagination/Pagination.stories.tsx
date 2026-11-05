import type { Meta, StoryObj } from '@storybook/react-vite';

import { Pagination } from './Pagination';

// @@T mol-1 begin
const meta: Meta<typeof Pagination> = {
// @@T mol-1 end
  title: 'Molecules/Pagination',
  component: Pagination,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: { count: 6, index: 2 },
// @@T mol-1 begin
};
// @@T mol-1 end

export default meta;
type Story = StoryObj<typeof meta>;

/** Mid-range page: both arrows enabled. */
export const Default: Story = {};

/** First page: Previous disabled. */
export const FirstPage: Story = {
  args: { index: 0 },
};

/** Last page: Next disabled. */
export const LastPage: Story = {
  args: { index: 5 },
};
