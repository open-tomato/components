import type { Meta, StoryObj } from '@storybook/react-vite';

import { ContentTiles } from '../../stories/fixtures';

import { Content } from './Content';

// @@T ato-1 begin
const meta: Meta<typeof Content> = {
// @@T ato-1 end
  title: 'Atoms/Content',
  component: Content,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    direction: { control: 'select', options: ['col', 'row'] },
    gap: { control: 'select', options: ['none', 'sm', 'md', 'lg', 'xl'] },
    align: { control: 'select', options: ['start', 'center', 'end', 'stretch'] },
    justify: { control: 'select', options: ['start', 'center', 'between', 'end'] },
  },
  args: { children: <ContentTiles /> },
};

export default meta;
// @@T ato-1 begin
type Story = StoryObj<typeof Content>;
// @@T ato-1 end

/** Defaults: column, md gap, stretch. */
export const Default: Story = {};

export const Row: Story = {
  args: { direction: 'row' },
};

export const GapXl: Story = {
  args: { gap: 'xl' },
};

export const AlignCenter: Story = {
  args: { direction: 'row', align: 'center' },
};

export const JustifyBetween: Story = {
  args: { direction: 'row', justify: 'between' },
};

export const Wrapping: Story = {
  args: { direction: 'row', wrap: true, children: <ContentTiles count={9} /> },
};
