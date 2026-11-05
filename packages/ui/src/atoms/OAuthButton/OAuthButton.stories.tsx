import type { Meta, StoryObj } from '@storybook/react-vite';

import { OAuthButton } from './OAuthButton';

/** Provider sign-in rows — surface button, provider glyph, hover sink. */
// @@T ato-2 begin
const meta: Meta<typeof OAuthButton> = {
// @@T ato-2 end
  title: 'Atoms/OAuthButton',
  component: OAuthButton,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [(Story) => <div className="w-80"><Story /></div>],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Google: Story = { args: { provider: 'google' } };

export const GitHub: Story = { args: { provider: 'github' } };
