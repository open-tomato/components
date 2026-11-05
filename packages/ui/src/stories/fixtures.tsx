// @@T tpl-1 begin
import type { JSX, ReactNode } from 'react';
// @@T tpl-1 end

import { cn } from '../lib';

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
    className={cn(
      'block h-[12px] rounded-full bg-border-strong opacity-50',
      className,
    )}
  />
);

/** The header row + text rows rendered inside Shell demos. */
// @@T tpl-1 begin
export const ShellFiller = (): JSX.Element => (
// @@T tpl-1 end
  <span className="flex flex-col gap-3.5">
    <span className="flex items-center gap-2.5">
      <Ph className="w-[26px] h-[26px] rounded-[8px] bg-primary opacity-90" />
      <Ph className="w-[120px] h-[14px] bg-fg2" />
    </span>
    <Ph className="w-full h-[10px]" />
    <Ph className="w-[78%] h-[10px]" />
    <Ph className="w-[90%] h-[10px]" />
  </span>
);

/** The text-block rows rendered inside Card demos. */
// @@T tpl-1 begin
export const CardFiller = (): JSX.Element => (
// @@T tpl-1 end
  <span className="flex flex-col gap-2">
    <Ph className="w-[70%] h-[12px] bg-fg2" />
    <Ph className="w-full h-[9px]" />
    <Ph className="w-[85%] h-[9px]" />
  </span>
);

/** The tinted `item N` tiles from the Content demo. */
const TILE_TONES = [
  'bg-[color-mix(in_oklab,var(--primary)_16%,var(--surface-1))] border-[color-mix(in_oklab,var(--primary)_40%,transparent)] text-primary',
  'bg-[color-mix(in_oklab,var(--accent)_16%,var(--surface-1))] border-[color-mix(in_oklab,var(--accent)_40%,transparent)] text-accent',
  'bg-[color-mix(in_oklab,var(--gold-500)_16%,var(--surface-1))] border-[color-mix(in_oklab,var(--gold-500)_40%,transparent)] text-gold-500',
] as const;

export const ContentTiles = ({ count = 3 }: { count?: number }): ReactNode => Array.from({ length: count }, (_, i) => (
  <span
    key={i}
    className={cn(
      'border rounded-md px-4 py-3 font-mono font-semibold text-[13px] whitespace-nowrap',
      TILE_TONES[i % TILE_TONES.length],
    )}
  >
    item {i + 1}
  </span>
));

/** The numbered neutral tiles from the Grid demo. */
export const GridTiles = ({ count = 6 }: { count?: number }): ReactNode => Array.from({ length: count }, (_, i) => (
  <span
    key={i}
    className="h-[56px] rounded-md bg-surface-1 border border-border-soft flex items-center justify-center text-fg3 font-mono text-xs"
  >
    {i + 1}
  </span>
));
