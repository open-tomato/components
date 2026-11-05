import type { ReactNode } from 'react';

import { Button } from '../../atoms/Button';
import { Icon } from '../../atoms/Icon';
import { cn } from '../../lib';

// @@V mol-2 begin
import {
  passkeyPrompt,
  passkeyPromptCopy,
  passkeyPromptDescription,
  passkeyPromptIndicator,
  passkeyPromptTitle,
} from './PasskeyPrompt.variants';
// @@V mol-2 end

export interface PasskeyPromptProps {
  title?: ReactNode;
  description?: ReactNode;
  /**
   * Renders the cancel affordance — the browser prompt can be abandoned
   * and the flow must offer a way back while WebAuthn is pending.
   */
  onCancel?: () => void;
  cancelLabel?: string;
  className?: string;
}

/**
 * PasskeyPrompt (the original Profile screen; decision D5): the
 * waiting state shown after "add passkey" while the BROWSER runs its
 * WebAuthn interaction — a pulsing key indicator, instruction copy, and
 * an optional cancel affordance. Fits the auth flow as a TwoFactorPage
 * step candidate between the method pick and the done splash (app
 * wiring is WS08 scope — this ships only the component).
 */
// @@T mol-2 begin
export const PasskeyPrompt: { (props: PasskeyPromptProps): import('react').JSX.Element; displayName?: string } = ({
// @@T mol-2 end
  title = 'We\'ll ask your browser to register a passkey',
  description = 'Your device picks the method — Touch ID, Face ID, Windows Hello, or your hardware key. Acme never sees the secret.',
  onCancel,
  cancelLabel = 'Cancel',
  className,
// @@T mol-2 begin
}: PasskeyPromptProps): import('react').JSX.Element => (
// @@T mol-2 end
  <div role="status" className={cn(passkeyPrompt(), className)}>
    <span className={passkeyPromptIndicator()} aria-hidden>
      <Icon name="key-round" size={30} />
    </span>
    {/* @@V mol-2 begin */}
    <div className={passkeyPromptCopy()}>
      <div className={passkeyPromptTitle()}>
        {title}
      </div>
      <div className={passkeyPromptDescription()}>{description}</div>
    </div>
    {/* @@V mol-2 end */}
    {onCancel != null && (
      <Button variant="ghost" size="sm" onClick={onCancel}>
        {cancelLabel}
      </Button>
    )}
  </div>
);

PasskeyPrompt.displayName = 'PasskeyPrompt';
