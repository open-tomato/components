import type { Meta, StoryObj } from '@storybook/react-vite';

import { Monogram } from './Monogram';

/** Identity block — initials on a brand fill, squarer than Avatar. */
const meta: Meta<typeof Monogram> = {
  title: 'Atoms/Monogram',
  component: Monogram,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Accent: Story = { args: { name: 'open-garden' } };

export const Primary: Story = { args: { name: 'market-garden', tone: 'primary' } };

export const Gold: Story = { args: { name: 'seed-bank', tone: 'gold' } };

/** The 44px block with the wider radius. */
export const Large: Story = { args: { name: 'default', size: 'lg' } };
