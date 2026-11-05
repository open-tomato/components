import type { Meta, StoryObj } from '@storybook/react-vite';
import type { JSX } from 'react';

import { Button } from '../Button';

import { EmptyState } from './EmptyState';

// @@S ato-1 begin
const ArtPlaceholder = (): JSX.Element => (
  <svg width={30} height={30} viewBox="0 0 64 64" aria-hidden>
    <circle cx="32" cy="32" r="20" className="fill-primary" />
  </svg>
);
// @@S ato-1 end

// @@T ato-1 begin
const meta: Meta<typeof EmptyState> = {
// @@T ato-1 end
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
    // @@S ato-1 begin
    illustration: <ArtPlaceholder />,
    // @@S ato-1 end
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
// @@T ato-1 begin
type Story = StoryObj<typeof EmptyState>;
// @@T ato-1 end

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
