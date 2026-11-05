import type { Meta, StoryObj } from '@storybook/react-vite';

import { useState } from 'react';

import {
  AvatarSelector,
} from './AvatarSelector';
import { type AvatarSelectorTone } from './FormKit.variants';

// @@S org-1 begin
/**
 * Big avatar preview + initials input + color-swatch grid. Controlled: the
 * parent owns initials and tone.
 */
// @@S org-1 end
// @@T org-1 begin
const meta: Meta<typeof AvatarSelector> = {
// @@T org-1 end
  title: 'Organisms/AvatarSelector',
  component: AvatarSelector,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
// @@T org-1 begin
};
// @@T org-1 end

export default meta;
type Story = StoryObj<typeof meta>;

const Demo = ({ maxLength = 2 as 1 | 2, start = 'R' }) => {
  const [initials, setInitials] = useState(start);
  const [tone, setTone] = useState<AvatarSelectorTone>('primary');
  return (
    <AvatarSelector
      initials={initials}
      onInitialsChange={setInitials}
      tone={tone}
      onToneChange={setTone}
      maxLength={maxLength}
    />
  );
};

// @@S org-1 begin
/**
 * Spec: preview + input (2 chars max here) + 3-column swatch grid — the
 * palette's 6 colors, selected swatch ringed. Input uppercases.
 */
// @@S org-1 end
export const Default: Story = {
  args: { initials: 'R', tone: 'primary' },
  render: () => <Demo />,
};

// @@S org-1 begin
/** Single-character mode. */
// @@S org-1 end
export const SingleCharacter: Story = {
  args: { initials: 'A', tone: 'primary', maxLength: 1 },
  render: () => <Demo maxLength={1} start="A" />,
};

// @@S org-1 begin
/** Empty initials fall back to the "?" placeholder. */
// @@S org-1 end
export const EmptyFallback: Story = {
  args: { initials: '', tone: 'primary' },
  render: () => <Demo start="" />,
};
