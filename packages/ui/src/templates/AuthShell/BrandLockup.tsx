// @@T tpl-1 begin
import type { FC } from 'react';
// @@T tpl-1 end

import { TomatoMark } from '../../internal/TomatoMark';

/** Mark + wordmark, linking out of the auth flow. Wordmark colors are theme-aware tokens. */
// @@T tpl-1 begin
export const BrandLockup: FC<{ href?: string }> = ({ href = '#' }: { href?: string }) => (
// @@T tpl-1 end
  <a href={href} className="mb-6 inline-flex items-center gap-2.5 text-inherit !no-underline">
    <TomatoMark size={28} />
    <span className="font-display text-[19px] font-extrabold tracking-[-0.02em]">
      <span className="text-wordmark-open">open</span>{' '}
      <span className="text-wordmark-tomato">tomato</span>
    </span>
  </a>
);

BrandLockup.displayName = 'BrandLockup';
