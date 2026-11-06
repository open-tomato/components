import type { ReactNode } from 'react';

import { keyHint, paletteKbd } from './CommandPalette.variants';

export interface KeyHintProps {
  k: ReactNode;
  label: ReactNode;
}

/** A footer key legend entry: a kbd chip + what it does. */
export const KeyHint: { (p: KeyHintProps): import('react').JSX.Element; displayName: string } = (({ k, label }: KeyHintProps) => (
  <span
    className={keyHint()}
  >
    <kbd className={paletteKbd({ size: 'sm', surface: 'raised' })}>{k}</kbd>
    {label}
  </span>
)) as { (p: KeyHintProps): import('react').JSX.Element; displayName: string };

KeyHint.displayName = 'KeyHint';
