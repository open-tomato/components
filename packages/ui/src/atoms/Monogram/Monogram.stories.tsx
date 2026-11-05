import type { Meta, StoryObj } from '@storybook/react-vite';

import { Monogram } from './Monogram';

/** Identity block — initials on a brand fill, squarer than Avatar. */
// @@T ato-2 begin
// @@S ato-2 begin
const meta: Meta<typeof Monogram> = {
// @@S ato-2 end
// @@T ato-2 end
  title: 'Atoms/Monogram',
  component: Monogram,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Accent: Story = { args: { name: 'open-garden' } };

// @@S ato-2 begin
export const Primary: Story = { args: { name: 'market-garden', tone: 'primary' } };
// @@S ato-2 end

export const Gold: Story = { args: { name: 'seed-bank', tone: 'gold' } };

// @@S ato-2 begin
/** The 44px block with the wider radius. */
// @@S ato-2 end
export const Large: Story = { args: { name: 'default', size: 'lg' } };
