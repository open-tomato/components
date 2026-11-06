import type { JSX, ReactNode } from 'react';

import { cn } from '../lib';

import {
  cardFiller,
  contentTile,
  gridTile,
  ph,
  phShape,
  shellFiller,
  shellFillerHeader,
} from './fixtures.variants';

/**
 * Story-only demo fillers (the `Ph` placeholder pill and the demo tiles
 * for Content/Grid). Never exported from
 * the library barrel and never imported by components — stories only.
 *
 * Classes are static strings so the workbench Tailwind build can see them.
 */

/** The `Ph` placeholder pill. Size/color via className overrides. */
export const Ph = ({ className }: { className?: string }): JSX.Element => (
  <span
    className={cn(ph(), className)}
  />
);

/** The header row + text rows rendered inside Shell demos. */
export const ShellFiller = (): JSX.Element => (
  <span className={shellFiller()}>
    <span className={shellFillerHeader()}>
      <Ph className={phShape({ shape: 'logo' })} />
      <Ph className={phShape({ shape: 'title' })} />
    </span>
    <Ph className={phShape({ shape: 'line' })} />
    <Ph className={phShape({ shape: 'lineShort' })} />
    <Ph className={phShape({ shape: 'lineLong' })} />
  </span>
);

/** The text-block rows rendered inside Card demos. */
export const CardFiller = (): JSX.Element => (
  <span className={cardFiller()}>
    <Ph className={phShape({ shape: 'heading' })} />
    <Ph className={phShape({ shape: 'body' })} />
    <Ph className={phShape({ shape: 'bodyLong' })} />
  </span>
);

/** The tinted `item N` tiles from the Content demo. */
const TILE_TONES = ['primary', 'accent', 'gold'] as const;

export const ContentTiles = ({ count = 3 }: { count?: number }): ReactNode => Array.from({ length: count }, (_, i) => (
  <span
    key={i}
    className={cn(contentTile({ tone: TILE_TONES[i % TILE_TONES.length] }))}
  >
    item {i + 1}
  </span>
));

/** The numbered neutral tiles from the Grid demo. */
export const GridTiles = ({ count = 6 }: { count?: number }): ReactNode => Array.from({ length: count }, (_, i) => (
  <span
    key={i}
    className={gridTile()}
  >
    {i + 1}
  </span>
));
