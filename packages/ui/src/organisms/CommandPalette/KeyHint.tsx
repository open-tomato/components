import type { ReactNode } from 'react';

// @@V org-2 begin
import { keyHint, paletteKbd } from './CommandPalette.variants';
// @@V org-2 end

export interface KeyHintProps {
  k: ReactNode;
  label: ReactNode;
}

/** A footer key legend entry: a kbd chip + what it does. */
// @@T org-2 begin
export const KeyHint: { (p: KeyHintProps): import('react').JSX.Element; displayName: string } = (({ k, label }: KeyHintProps) => (
  <span
    // @@V org-2 begin
    className={keyHint()}
    // @@V org-2 end
  >
    <kbd className={paletteKbd({ size: 'sm', surface: 'raised' })}>{k}</kbd>
    {label}
  </span>
)) as { (p: KeyHintProps): import('react').JSX.Element; displayName: string };
// @@T org-2 end

KeyHint.displayName = 'KeyHint';
