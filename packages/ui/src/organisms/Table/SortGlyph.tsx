import type { ReactElement } from 'react';

import { StrokeIcon } from '../../lib/icons';

import { sortGlyphActive, sortGlyphHint } from './Table.variants';

export interface SortGlyphProps {
  sortable?: boolean;
  active: boolean;
  dir: 'asc' | 'desc';
}

/**
 * The header sort affordance: a faint chevron hint that brightens on header
 * hover (via the th's group/head), swapping to an accent arrow when active.
 */
export const SortGlyph: {
  (props: SortGlyphProps): ReactElement | null;
  displayName?: string;
} = ({ sortable, active, dir }: SortGlyphProps): ReactElement | null => {
  if (!sortable) return null;
  if (!active)
    return (
      <span
        className={sortGlyphHint()}
      >
        <StrokeIcon name="chevronDown" size={13} />
      </span>
    );
  return (
    <span
      className={sortGlyphActive()}
    >
      <StrokeIcon name={dir === 'asc'
        ? 'arrowUp'
        : 'arrowDown'} size={13} />
    </span>
  );
};

SortGlyph.displayName = 'SortGlyph';
