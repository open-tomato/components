// @@T tpl-1 begin
import type { JSX, ReactNode } from 'react';
// @@T tpl-1 end

import { cn } from '../lib';
// @@V tpl-1 begin

import {
  cardFiller,
  contentTile,
  gridTile,
  ph,
  phShape,
  shellFiller,
  shellFillerHeader,
} from './fixtures.variants';
// @@V tpl-1 end

/**
 * Story-only demo fillers (the `Ph` placeholder pill and the demo tiles
 * for Content/Grid). Never exported from
 * the library barrel and never imported by components — stories only.
 *
 * Classes are static strings so the workbench Tailwind build can see them.
 */

/** The `Ph` placeholder pill. Size/color via className overrides. */
// @@T tpl-1 begin
export const Ph = ({ className }: { className?: string }): JSX.Element => (
// @@T tpl-1 end
  <span
    // @@V tpl-1 begin
    className={cn(ph(), className)}
    // @@V tpl-1 end
  />
);

/** The header row + text rows rendered inside Shell demos. */
// @@T tpl-1 begin
export const ShellFiller = (): JSX.Element => (
// @@T tpl-1 end
  // @@V tpl-1 begin
  <span className={shellFiller()}>
    <span className={shellFillerHeader()}>
      <Ph className={phShape({ shape: 'logo' })} />
      <Ph className={phShape({ shape: 'title' })} />
    </span>
    <Ph className={phShape({ shape: 'line' })} />
    <Ph className={phShape({ shape: 'lineShort' })} />
    <Ph className={phShape({ shape: 'lineLong' })} />
  </span>
  // @@V tpl-1 end
);

/** The text-block rows rendered inside Card demos. */
// @@T tpl-1 begin
export const CardFiller = (): JSX.Element => (
// @@T tpl-1 end
  // @@V tpl-1 begin
  <span className={cardFiller()}>
    <Ph className={phShape({ shape: 'heading' })} />
    <Ph className={phShape({ shape: 'body' })} />
    <Ph className={phShape({ shape: 'bodyLong' })} />
  </span>
  // @@V tpl-1 end
);

/** The tinted `item N` tiles from the Content demo. */
// @@V tpl-1 begin
const TILE_TONES = ['primary', 'accent', 'gold'] as const;
// @@V tpl-1 end

export const ContentTiles = ({ count = 3 }: { count?: number }): ReactNode => Array.from({ length: count }, (_, i) => (
  <span
    key={i}
    // @@V tpl-1 begin
    className={cn(contentTile({ tone: TILE_TONES[i % TILE_TONES.length] }))}
    // @@V tpl-1 end
  >
    item {i + 1}
  </span>
));

/** The numbered neutral tiles from the Grid demo. */
export const GridTiles = ({ count = 6 }: { count?: number }): ReactNode => Array.from({ length: count }, (_, i) => (
  <span
    key={i}
    // @@V tpl-1 begin
    className={gridTile()}
    // @@V tpl-1 end
  >
    {i + 1}
  </span>
));
