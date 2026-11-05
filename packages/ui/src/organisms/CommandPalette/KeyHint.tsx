import type { ReactNode } from 'react';

import { paletteKbd } from './CommandPalette.variants';

export interface KeyHintProps {
  k: ReactNode;
  label: ReactNode;
}

/** A footer key legend entry: a kbd chip + what it does. */
// @@T org-2 begin
export const KeyHint: { (p: KeyHintProps): import('react').JSX.Element; displayName: string } = (({ k, label }: KeyHintProps) => (
  <span className="inline-flex items-center gap-1.5">
    <kbd className={paletteKbd({ size: 'sm', surface: 'raised' })}>{k}</kbd>
    {label}
  </span>
)) as { (p: KeyHintProps): import('react').JSX.Element; displayName: string };
// @@T org-2 end

KeyHint.displayName = 'KeyHint';
