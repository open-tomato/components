import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '../../atoms/Button';

import { AuthHeading } from './AuthHeading';
import { AuthShell } from './AuthShell';

// @@S tpl-1 begin
/**
 * The pre-authentication shell: tinted backdrop, brand slot, centred
 * card, footer line. Screens fill the card — see Pages/Auth/*.
 */
// @@S tpl-1 end
// @@T tpl-1 begin
const meta: Meta<typeof AuthShell> = {
// @@T tpl-1 end
  title: 'Templates/AuthShell',
  component: AuthShell,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

/** Default 440px card with eyebrow, heading and footer. */
export const Default: Story = {
  render: () => (
    <AuthShell
      // @@S tpl-1 begin
      brand={<a href="#home">Brand</a>}
      // @@S tpl-1 end
      eyebrow="welcome back"
      footer={
        <>
          New here? <a href="#create-account" className="font-semibold text-accent">Create an account</a>
        </>
      }
    >
      {/* @@S tpl-1 begin */}
      <AuthHeading title="Sign in" sub="Pick up where you left off." />
      {/* @@S tpl-1 end */}
      <Button variant="primary" block>Sign in</Button>
    </AuthShell>
  ),
};

/** The 520px card the 2FA flow uses. */
export const WideXl: Story = {
  render: () => (
    <AuthShell
      // @@S tpl-1 begin
      brand={<a href="#home">Brand</a>}
      // @@S tpl-1 end
      eyebrow="security · two-factor"
      width="xl"
    >
      <AuthHeading title="Add a second factor" sub="Pick at least one." />
    </AuthShell>
  ),
};
