// @@T org-2 begin
import type { ReactElement } from 'react';
// @@T org-2 end

import { StrokeIcon } from '../../lib/icons';

// @@V org-2 begin
import { sortGlyphActive, sortGlyphHint } from './Table.variants';
// @@V org-2 end

export interface SortGlyphProps {
  sortable?: boolean;
  active: boolean;
  dir: 'asc' | 'desc';
}

/**
 * The header sort affordance: a faint chevron hint that brightens on header
 * hover (via the th's group/head), swapping to an accent arrow when active.
 */
// @@T org-2 begin
export const SortGlyph: {
  (props: SortGlyphProps): ReactElement | null;
  displayName?: string;
} = ({ sortable, active, dir }: SortGlyphProps): ReactElement | null => {
// @@T org-2 end
  if (!sortable) return null;
  if (!active)
    return (
      <span
        // @@V org-2 begin
        className={sortGlyphHint()}
        // @@V org-2 end
      >
        <StrokeIcon name="chevronDown" size={13} />
      </span>
    );
  return (
    <span
      // @@V org-2 begin
      className={sortGlyphActive()}
      // @@V org-2 end
    >
      <StrokeIcon name={dir === 'asc'
        ? 'arrowUp'
        : 'arrowDown'} size={13} />
    </span>
  );
};

SortGlyph.displayName = 'SortGlyph';
