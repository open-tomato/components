import type { Meta, StoryObj } from '@storybook/react-vite';

import { Badge } from '../../atoms/Badge';
import { IconTile } from '../../atoms/IconTile';
import { Monogram } from '../../atoms/Monogram';
import { StrokeIcon } from '../../lib/icons';

import { OptionCard } from './OptionCard';

/** One selectable card for both pickers — context choice and 2FA method. */
const meta: Meta<typeof OptionCard> = {
  title: 'Molecules/OptionCard',
  component: OptionCard,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [(Story) => <div className="w-[440px]"><Story /></div>],
};

export default meta;
type Story = StoryObj<typeof meta>;

/** Context picker row — centered, Monogram leading, role badge. */
export const Context: Story = {
  args: {
    selected: true,
    leading: <Monogram name="open-garden" />,
    title: 'open-garden',
    meta: <Badge tone="neutral">member</Badge>,
    description: 'Primary context · invited by sam · 12 members',
  },
};

export const Unselected: Story = {
  args: {
    selected: false,
    leading: <Monogram name="seed-bank" tone="gold" />,
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
