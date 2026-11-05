import type { Meta, StoryObj } from '@storybook/react-vite';

import { StrokeIcon } from '../../lib/icons';

import { IconButton } from './IconButton';

/** 32px ghost square with one glyph — copy/download affordances. */
// @@T ato-1 begin
const meta: Meta<typeof IconButton> = {
// @@T ato-1 end
  title: 'Atoms/IconButton',
  component: IconButton,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};

export default meta;
// @@T ato-1 begin
type Story = StoryObj<typeof IconButton>;
// @@T ato-1 end

export const Default: Story = {
  args: { icon: <StrokeIcon name="copy" size={18} />, label: 'Copy secret' },
};

export const Active: Story = {
  args: { icon: <StrokeIcon name="download" size={18} />, label: 'Download', active: true },
};
