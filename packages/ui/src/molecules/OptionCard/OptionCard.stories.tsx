import type { Meta, StoryObj } from '@storybook/react-vite';

import { Badge } from '../../atoms/Badge';
import { IconTile } from '../../atoms/IconTile';
// @@S ato-2 begin
import { Monogram } from '../../atoms/Monogram';
// @@S ato-2 end
import { StrokeIcon } from '../../lib/icons';

import { OptionCard } from './OptionCard';

// @@S mol-3 begin
/** One selectable card for both pickers — group choice and 2FA method. */
// @@S mol-3 end
// @@T mol-3 begin
const meta: Meta<typeof OptionCard> = {
// @@T mol-3 end
  title: 'Molecules/OptionCard',
  component: OptionCard,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [(Story) => <div className="w-[440px]"><Story /></div>],
};

export default meta;
type Story = StoryObj<typeof meta>;

// @@S mol-3 begin
/** Group picker row — centered, Monogram leading, role badge. */
// @@S mol-3 end
export const Workspace: Story = {
  args: {
    selected: true,
    // @@S ato-2 begin
    leading: <Monogram name="open-garden" />,
    // @@S ato-2 end
    title: 'open-garden',
    meta: <Badge tone="neutral">member</Badge>,
    // @@S mol-3 begin
    description: 'Main group · invited by sam · 12 members',
    // @@S mol-3 end
  },
};

export const Unselected: Story = {
  args: {
    selected: false,
    // @@S ato-2 begin
    leading: <Monogram name="seed-bank" tone="gold" />,
    // @@S ato-2 end
    title: 'seed-bank',
    meta: <Badge tone="neutral">viewer</Badge>,
    description: 'Experiments · invited by kai · 3 members',
  },
};

/** 2FA method row — top-aligned, IconTile leading, recommended badge. */
export const Method: Story = {
  args: {
    selected: true,
    align: 'start',
    leading: <IconTile icon={<StrokeIcon name="shield" size={17} />} />,
    title: 'Authenticator app',
    meta: <Badge tone="accent">recommended</Badge>,
    description:
      'Scan a QR with Authy, 1Password, Google Authenticator — anything that does TOTP.',
  },
};
