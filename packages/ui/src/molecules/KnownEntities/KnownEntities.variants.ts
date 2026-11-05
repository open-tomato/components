// @@T mol-3 begin
import type { ClassProp } from 'class-variance-authority/types';
// @@T mol-3 end

import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Known entities — contract-typed display templates for the domain
 * entities that recur across tables, cards and menus (spec:
 * "Known Entities"; rendered references: the
 * Sessions/Tasks table rows in the original Sessions/Tasks screens).
 *
 * Each `{entity}-{variant}` name ships as a component with a typed data
 * contract, and the registry in `src/organisms/Table/cellTypes.tsx` maps
 * the same names to renderers so a self-describing table can infer the
 * component from a column's `type` string.
 *
 * Entity accents ride the shared chart palette (`chartTone` paints
 * `currentColor`; tiles tint from it with a color-mix), so entity colors
 * stay theme-aware and consistent with the charts.
 */

/** agent-title / tool-title — avatar|icon left, double line right. */
// @@T mol-3 begin
export const entityTitle: (props?: ClassProp) => string = cva('flex min-w-0 items-center gap-2.5');
// @@T mol-3 end

// @@T mol-3 begin
export const entityTitleName: (props?: ClassProp) => string = cva(
// @@T mol-3 end
  'truncate text-[13.5px] font-semibold leading-tight text-fg1',
);

// @@T mol-3 begin
export const entityTitleSub: (props?: ClassProp) => string = cva(
// @@T mol-3 end
  'truncate font-mono text-[11px] leading-tight text-fg3',
);

/**
 * agent-cell tile — the 24px rounded glyph tile from the original Sessions
 * table (`color-mix(in oklab, agentColor 14%, transparent)` behind the
 * bot glyph, tinted from the entity accent via currentColor).
 */
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

/** session-inline — status dot + semibold name. */
// @@T mol-3 begin
export const sessionInlineName: (props?: ClassProp) => string = cva(
// @@T mol-3 end
  'truncate text-sm font-semibold leading-tight text-fg1',
);

/** The greyed mono meta line (session-cell bottom, task-cell tags). */
// @@T mol-3 begin
export const entityMeta: (props?: ClassProp) => string = cva(
// @@T mol-3 end

  [
    'flex min-w-0 items-center gap-1.5',
    'font-mono text-[11px] leading-tight text-fg3',
  ],
);

/** model-cell — small accent decoration + mono model name. */
// @@T mol-3 begin
export const modelCellName: (props?: ClassProp) => string = cva('truncate font-mono text-xs text-fg2');
// @@T mol-3 end

/** model-footer — inherits the footer's color wholesale (no accent). */
// @@T mol-3 begin
export const modelFooter: (props?: ClassProp) => string = cva(
// @@T mol-3 end
  'inline-flex min-w-0 items-center gap-1.5 text-current',
);

// @@T mol-3 begin
export const modelFooterName: (props?: ClassProp) => string = cva('truncate font-mono text-[11px]');
// @@T mol-3 end

/** branch-inline — git-branch glyph + mono branch name. */
// @@T mol-3 begin
export const branchInline: (props?: ClassProp) => string = cva(
// @@T mol-3 end
  'inline-flex min-w-0 items-center gap-1 font-mono text-[11px] text-fg3',
);

/** user-inline — small avatar + mono handle. */
// @@T mol-3 begin
export const userInline: (props?: ClassProp) => string = cva('inline-flex min-w-0 items-center gap-1.5');
// @@T mol-3 end

// @@T mol-3 begin
export const userInlineHandle: (props?: ClassProp) => string = cva('truncate font-mono text-xs text-fg2');
// @@T mol-3 end

/** task-cell — title over inline text tags. */
// @@T mol-3 begin
export const taskCellTitle: (props?: ClassProp) => string = cva(
// @@T mol-3 end
  'truncate text-sm font-medium leading-tight text-fg1',
);

export type EntityTileVariants = VariantProps<typeof entityTile>;

/** The session lifecycle vocabulary shared by session-inline/-cell. */
export type SessionStatus = 'running' | 'waiting' | 'done' | 'failed' | 'idle';

// @@T mol-3 begin
export const SESSION_STATUS_TONE: {
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
