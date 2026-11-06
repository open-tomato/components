import type { JSX } from 'react';

import { tomatoMark, tomatoMarkBody, tomatoMarkLeaf } from './TomatoMark.variants';
/**
 * The brand mark svg. Sanctioned in-app
 * appearances: EmptyState and the brand slot of the auth screens
 * (templates/AuthShell) — everywhere else stays mark-free.
 */
export const TomatoMark = ({ size = 30 }: { size?: number }): JSX.Element => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={tomatoMark()} aria-hidden>
    <path
      d="M32 6 C28 8 26 11 26 14 C23 12 20 13 19 15 C20 17 23 18 26 17 C25 20 27 22 30 22 L34 22 C37 22 39 20 38 17 C41 18 44 17 45 15 C44 13 41 12 38 14 C38 11 36 8 32 6 Z"
      className={tomatoMarkLeaf()}
    />
    <circle cx="32" cy="38" r="20" className={tomatoMarkBody()} />
  </svg>
);
