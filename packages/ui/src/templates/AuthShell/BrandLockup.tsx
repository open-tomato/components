// @@T tpl-1 begin
import type { FC } from 'react';
// @@T tpl-1 end

import { TomatoMark } from '../../internal/TomatoMark';

// @@V tpl-1 begin
import {
  brandLockup,
  brandLockupWordmark,
  brandLockupWordmarkOpen,
  brandLockupWordmarkTomato,
} from './AuthShell.variants';
// @@V tpl-1 end

/** Mark + wordmark, linking out of the auth flow. Wordmark colors are theme-aware tokens. */
// @@T tpl-1 begin
export const BrandLockup: FC<{ href?: string }> = ({ href = '#' }: { href?: string }) => (
// @@T tpl-1 end
  // @@V tpl-1 begin
  <a href={href} className={brandLockup()}>
    <TomatoMark size={28} />
    <span className={brandLockupWordmark()}>
      <span className={brandLockupWordmarkOpen()}>open</span>{' '}
      <span className={brandLockupWordmarkTomato()}>tomato</span>
    </span>
  </a>
  // @@V tpl-1 end
);

BrandLockup.displayName = 'BrandLockup';
