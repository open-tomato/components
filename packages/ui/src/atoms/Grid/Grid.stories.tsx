import type { Meta, StoryObj } from '@storybook/react-vite';

import { GridTiles } from '../../stories/fixtures';

import { Grid } from './Grid';

const meta: Meta<typeof Grid> = {
  title: 'Atoms/Grid',
  component: Grid,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    cols: { control: 'select', options: ['1', '2', '3', '4', 'auto'] },
    gap: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
  args: { children: <GridTiles /> },
};

export default meta;
type Story = StoryObj<typeof Grid>;

/** Defaults: auto-fill columns (min 180px), md gap. */
export const Default: Story = {};

export const Cols2: Story = {
  args: { cols: '2' },
};

export const Cols3: Story = {
  args: { cols: '3' },
};

export const Cols4: Story = {
  args: { cols: '4' },
};

export const GapSm: Story = {
  args: { cols: '3', gap: 'sm' },
};

export const GapLg: Story = {
  args: { cols: '3', gap: 'lg' },
};
