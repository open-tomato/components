import type { Meta, StoryObj } from '@storybook/react-vite';

import { Pagination } from './Pagination';

const meta: Meta<typeof Pagination> = {
  title: 'Molecules/Pagination',
  component: Pagination,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: { count: 6, index: 2 },
};

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
