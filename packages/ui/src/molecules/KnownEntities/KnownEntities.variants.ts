// @@T mol-3 begin
import type { ClassProp } from 'class-variance-authority/types';
// @@T mol-3 end

import { cva, type VariantProps } from 'class-variance-authority';

// @@V mol-3 begin
import { chartTone, type ChartTone } from '../../lib';
// @@V mol-3 end

// @@S mol-3 begin
/**
 * Known entities — one display template (`Entity`) for the entities that
 * recur across tables, cards and menus (spec: "Known Entities").
 *
 * The `layout` (`inline`, `cell`, `title`) picks the shape and a `kind`
 * picks the glyph, accent and default texts from the `EntityKinds` map the
 * implementor supplies. The registry in `src/organisms/Table/cellTypes.tsx`
 * maps `entity-{layout}` names to renderers so a self-describing table can
 * infer the component from a column's `type` string.
 *
 * Entity accents ride the shared chart palette (`chartTone` paints
 * `currentColor`; tiles tint from it with a color-mix), so entity colors
 * stay theme-aware and consistent with the charts.
 */
// @@S mol-3 end

// @@S mol-3 begin
/** title layout — avatar|icon left, double line right. */
// @@S mol-3 end
// @@T mol-3 begin
export const entityTitle: (props?: ClassProp) => string = cva('flex min-w-0 items-center gap-2.5');
// @@T mol-3 end

// @@T mol-3 begin
export const entityTitleName: (props?: ClassProp) => string = cva(
// @@T mol-3 end
  'truncate text-[13.5px] font-semibold leading-tight text-fg1',
);

// @@S mol-3 begin
/**
 * The rounded glyph tile of the cell and title layouts
 * (`color-mix(in oklab, accent 14%, transparent)` behind the glyph,
 * tinted from the entity accent via currentColor).
 */
// @@S mol-3 end
// @@T mol-3 begin
export const entityTile: (props?: { size?: 'sm' | 'md' | null | undefined } & ClassProp) => string = cva(
// @@T mol-3 end

  [
    'flex shrink-0 items-center justify-center',
    'bg-[color-mix(in_oklab,currentColor_14%,transparent)]',
  ],
  {
    variants: {
      size: {
        sm: 'size-6 rounded-sm',
        md: 'size-8 rounded-md',
      },
    },
    defaultVariants: { size: 'sm' },
  },
);

// @@T mol-3 begin
export const entityCell: (props?: ClassProp) => string = cva('flex min-w-0 items-center gap-2'); // inline rows
// @@T mol-3 end

// @@T mol-3 begin
export const entityCellStack: (props?: ClassProp) => string = cva('flex min-w-0 flex-col gap-[3px]');
// @@T mol-3 end

// @@S mol-3 begin
/** inline layout — the semibold name beside the leading mark. */
// @@S mol-3 end
// @@T mol-3 begin
export const entityInlineName: (props?: ClassProp) => string = cva(
// @@T mol-3 end
  'truncate text-sm font-semibold leading-tight text-fg1',
);

// @@S mol-3 begin
/** The greyed mono meta line (second line of the cell and title layouts). */
// @@S mol-3 end
// @@T mol-3 begin
export const entityMeta: (props?: ClassProp) => string = cva(
// @@T mol-3 end

  [
    'flex min-w-0 items-center gap-1.5',
    'font-mono text-[11px] leading-tight text-fg3',
  ],
);

/** model-footer — inherits the footer's color wholesale (no accent). */
// @@T mol-3 begin
export const modelFooter: (props?: ClassProp) => string = cva(
// @@T mol-3 end
  'inline-flex min-w-0 items-center gap-1.5 text-current',
);

// @@T mol-3 begin
export const modelFooterName: (props?: ClassProp) => string = cva('truncate font-mono text-[11px]');
// @@T mol-3 end

// @@V mol-3 begin
/**
 * The entity accent: the shared chart palette (`chartTone` in `src/lib`),
 * bound here so the components read every class from their variants file.
 */
export const entityTone: (props?: ({ tone?: ChartTone | null | undefined } & ClassProp) | undefined) => string = chartTone;

// @@S mol-3 begin
/** title layout — the name over a column that also holds a companion. */
// @@S mol-3 end
export const toolTitleStack: (props?: ClassProp | undefined) => string = cva('flex min-w-0 flex-col gap-1');
// @@V mol-3 end

export type EntityTileVariants = VariantProps<typeof entityTile>;

// @@S mol-3 begin
/** The activity lifecycle vocabulary for a leading status mark. */
export type ActivityStatus = 'running' | 'waiting' | 'done' | 'failed' | 'idle';
// @@S mol-3 end

// @@T mol-3 begin
// @@S mol-3 begin
export const ACTIVITY_STATUS_TONE: {
// @@S mol-3 end
  readonly running: 'ok';
  readonly waiting: 'warn';
  readonly done: 'info';
  readonly failed: 'err';
  readonly idle: 'disabled';
} = {
// @@T mol-3 end
  running: 'ok',
  waiting: 'warn',
  done: 'info',
  failed: 'err',
  idle: 'disabled',
} as const;
