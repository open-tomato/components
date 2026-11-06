import type { Meta, StoryObj } from '@storybook/react-vite';

import { ArtPlaceholder } from '../../stories/fixtures';
import { Button } from '../Button';

import { EmptyState } from './EmptyState';

const meta: Meta<typeof EmptyState> = {
  title: 'Atoms/EmptyState',
  component: EmptyState,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    align: { control: 'select', options: ['center', 'start'] },
  },
  args: {
    title: 'Nothing here yet',
    illustration: <ArtPlaceholder />,
    description: 'Add an item and it will show up in this list.',
  },
  decorators: [
    (Story) => (
      <div className="w-[280px]">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

/** Defaults: md, centered, no action. */
export const Default: Story = {};

export const WithAction: Story = {
  args: {
    action: <Button size="sm">New item</Button>,
  },
};

export const Small: Story = {
  args: { size: 'sm' },
};

export const Large: Story = {
  args: { size: 'lg' },
};

export const AlignStart: Story = {
  args: { align: 'start' },
};
