import type { Meta, StoryObj } from '@storybook/react-vite';

import { expect } from 'storybook/test';

import { passwordStrength } from '../../lib';

import { PasswordStrength } from './PasswordStrength';

/** Five segments, danger → gold → success, with the mono verdict label. */
// @@T ato-2 begin
const meta: Meta<typeof PasswordStrength> = {
// @@T ato-2 end
  title: 'Atoms/PasswordStrength',
  component: PasswordStrength,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [(Story) => <div className="w-72"><Story /></div>],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = { args: { score: 0, label: 'empty' } };

export const Weak: Story = { args: { score: 1, label: 'weak' } };

export const Good: Story = { args: { score: 3, label: 'good' } };

export const Great: Story = { args: { score: 5, label: 'great' } };

/** The scoring util's contract. */
export const Scoring: Story = {
  args: { score: 5, label: 'great' },
  play: async () => {
    await expect(passwordStrength('')).toEqual({ score: 0, label: 'empty' });
    await expect(passwordStrength('short1')).toEqual({ score: 1, label: 'weak' });
    // @@S ato-2 begin
    await expect(passwordStrength('gardenwalker')).toEqual({ score: 2, label: 'okay' });
    await expect(passwordStrength('GardenPath12')).toEqual({ score: 4, label: 'strong' });
    await expect(passwordStrength('Garden-Path-42')).toEqual({ score: 5, label: 'great' });
    // @@S ato-2 end
  },
};
