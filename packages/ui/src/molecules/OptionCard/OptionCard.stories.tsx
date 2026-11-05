import type { Meta, StoryObj } from '@storybook/react-vite';

import { Badge } from '../../atoms/Badge';
import { IconTile } from '../../atoms/IconTile';
// @@S ato-2 begin
import { Monogram } from '../../atoms/Monogram';
// @@S ato-2 end
import { StrokeIcon } from '../../lib/icons';

import { OptionCard } from './OptionCard';

/** One selectable card for both auth pickers — workspace choice and 2FA method. */
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

// @@S ato-2 begin
/** Workspace picker row — centered, Monogram leading, role badge. */
// @@S ato-2 end
export const Workspace: Story = {
  args: {
    selected: true,
    // @@S ato-2 begin
    leading: <Monogram name="open-garden" />,
    // @@S ato-2 end
    title: 'open-garden',
    meta: <Badge tone="neutral">member</Badge>,
    description: 'Main workspace · invited by sam · 12 members',
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
