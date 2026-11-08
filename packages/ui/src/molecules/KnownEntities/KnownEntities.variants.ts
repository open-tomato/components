import type { ClassProp } from 'class-variance-authority/types';

import { cva, type VariantProps } from 'class-variance-authority';

import { chartTone, type ChartTone } from '../../lib';

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

/** title layout — avatar|icon left, double line right. */
export const entityTitle: (props?: ClassProp) => string = cva('flex min-w-0 items-center gap-2.5');

export const entityTitleName: (props?: ClassProp) => string = cva(
  'truncate text-[13.5px] font-semibold leading-tight text-fg1',
);

/**
 * The rounded glyph tile of the cell and title layouts
 * (`color-mix(in oklab, accent 14%, transparent)` behind the glyph,
 * tinted from the entity accent via currentColor).
 */
export const entityTile: (props?: { size?: 'sm' | 'md' | null | undefined } & ClassProp) => string = cva(

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

export const entityCell: (props?: ClassProp) => string = cva('flex min-w-0 items-center gap-2'); // inline rows

export const entityCellStack: (props?: ClassProp) => string = cva('flex min-w-0 flex-col gap-[3px]');

/**
 * inline and stack layouts — the title beside the leading mark: the
 * semibold name face, or the small mono face for handles and model names.
 */
export const entityInlineName: (
  props?: { mono?: boolean | null | undefined } & ClassProp,
) => string = cva('truncate', {
  variants: {
    mono: {
      false: 'text-sm font-semibold leading-tight text-fg1',
      true: 'font-mono text-xs text-fg2',
    },
  },
  defaultVariants: { mono: false },
});

/** The greyed mono meta line (second line of the cell and title layouts). */
export const entityMeta: (props?: ClassProp) => string = cva(

  [
    'flex min-w-0 items-center gap-1.5',
    'font-mono text-[11px] leading-tight text-fg3',
  ],
);

/** model-footer — inherits the footer's color wholesale (no accent). */
export const modelFooter: (props?: ClassProp) => string = cva(
  'inline-flex min-w-0 items-center gap-1.5 text-current',
);

export const modelFooterName: (props?: ClassProp) => string = cva('truncate font-mono text-[11px]');

/**
 * The entity accent: the shared chart palette (`chartTone` in `src/lib`),
 * bound here so the components read every class from their variants file.
 */
export const entityTone: (props?: ({ tone?: ChartTone | null | undefined } & ClassProp) | undefined) => string = chartTone;

/** title layout — the name over a column that also holds a companion. */
export const toolTitleStack: (props?: ClassProp | undefined) => string = cva('flex min-w-0 flex-col gap-1');

export type EntityTileVariants = VariantProps<typeof entityTile>;

/** The activity lifecycle vocabulary for a leading status mark. */
export type ActivityStatus = 'running' | 'waiting' | 'done' | 'failed' | 'idle';

export const ACTIVITY_STATUS_TONE: {
  readonly running: 'ok';
  readonly waiting: 'warn';
  readonly done: 'info';
  readonly failed: 'err';
  readonly idle: 'disabled';
} = {
  running: 'ok',
  waiting: 'warn',
  done: 'info',
  failed: 'err',
  idle: 'disabled',
} as const;
