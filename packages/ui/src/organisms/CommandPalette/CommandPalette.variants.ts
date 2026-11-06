import { cva, type VariantProps } from 'class-variance-authority';

/**
 * CommandPalette — the synthesis chapter (the original command-palette demo). It
 * introduces NO new behavior: Overlay (portal/backdrop/Escape) + the Menu's
 * keyboard-navigable grouped list + the form kit's controlled search field.
 * ⌘K is just where the three meet.
 *
 * Reconciliation: the original demo runs its Overlay with trapFocus={false} to
 * dodge its hand-rolled trap; here Radix's modal mode traps and auto-focuses
 * the search input natively, so the default Overlay behavior stays on.
 */

/** The floating panel — top-anchored, not centered. */
export const palettePanel: (props?: import('class-variance-authority/types').ClassProp | undefined) => string = cva(
  [
    'flex max-h-[70vh] w-[min(560px,calc(100vw-40px))] flex-col self-start',
    'mt-[11vh] overflow-hidden rounded-xl bg-surface-1',
    'border border-border-soft shadow-lg',
  ],
);

/** A result row; active carries the sunk fill + primary inset bar. */
export const paletteItem: (props?: ({ active?: boolean | null | undefined } & import('class-variance-authority/types').ClassProp) | undefined) => string = cva(
  [
    'flex w-full cursor-pointer items-center gap-[11px] rounded-md',
    'border-none px-[11px] py-[9px] text-left',
  ],
  {
    variants: {
      active: {
        false: 'bg-transparent shadow-none',
        true: 'bg-surface-sunk shadow-[inset_2px_0_0_var(--primary)]',
      },
    },
    defaultVariants: { active: false },
  },
);

/** The row's leading icon puck. */
export const paletteItemIcon: (props?: ({ active?: boolean | null | undefined } & import('class-variance-authority/types').ClassProp) | undefined) => string = cva(
  'inline-flex size-[30px] shrink-0 items-center justify-center rounded-sm',
  {
    variants: {
      active: {
        false: 'bg-surface-sunk text-fg2',
        true: 'bg-[color-mix(in_oklab,var(--primary)_14%,var(--surface-1))] text-primary',
      },
    },
    defaultVariants: { active: false },
  },
);

/** The mono kbd chip (esc hint, shortcut hints, footer keys). */
export const paletteKbd: (props?: ({ size?: 'sm' | 'md' | null | undefined; surface?: 'sunk' | 'raised' | null | undefined } & import('class-variance-authority/types').ClassProp) | undefined) => string = cva(
  'rounded-md border border-border-soft font-mono text-fg3',
  {
    variants: {
      size: {
        sm: 'px-1.5 py-0.5 text-[11px]',
        md: 'px-[7px] py-[3px] text-[11px]',
      },
      surface: {
        sunk: 'bg-surface-sunk',
        raised: 'bg-surface-1 text-fg2',
      },
    },
    defaultVariants: { size: 'md', surface: 'sunk' },
  },
);

/** The Overlay root: the panel anchors to the top instead of centering. */
export const paletteOverlay: (props?: import('class-variance-authority/types').ClassProp | undefined) => string = cva('items-start');

/** The search row: icon, input and the esc hint. */
export const paletteSearchRow: (props?: import('class-variance-authority/types').ClassProp | undefined) => string = cva('flex shrink-0 items-center gap-[11px] border-b border-border-soft px-[18px] py-[15px]');

/** A muted, non-shrinking icon wrapper (the search glyph and the run marker). */
export const paletteIconSlot: (props?: import('class-variance-authority/types').ClassProp | undefined) => string = cva('shrink-0 text-fg3');

/** The bare search input. */
export const paletteSearchInput: (props?: import('class-variance-authority/types').ClassProp | undefined) => string = cva('flex-1 border-none bg-transparent font-body text-base text-fg1 outline-none placeholder:text-fg3');

/** The scrolling results list. */
export const paletteList: (props?: import('class-variance-authority/types').ClassProp | undefined) => string = cva('flex-1 overflow-y-auto p-[7px]');

/** The empty-state block shown when nothing matches. */
export const paletteEmpty: (props?: import('class-variance-authority/types').ClassProp | undefined) => string = cva('flex flex-col items-center gap-2 px-5 py-11 text-center');

/** The empty-state glyph wrapper. */
export const paletteEmptyIcon: (props?: import('class-variance-authority/types').ClassProp | undefined) => string = cva('text-fg3');

/** The empty-state headline. */
export const paletteEmptyTitle: (props?: import('class-variance-authority/types').ClassProp | undefined) => string = cva('text-sm font-semibold text-fg1');

/** The empty-state suggestion line. */
export const paletteEmptyHint: (props?: import('class-variance-authority/types').ClassProp | undefined) => string = cva('text-[12.5px] text-fg3');

/** A results group. */
export const paletteGroup: (props?: import('class-variance-authority/types').ClassProp | undefined) => string = cva('mb-1');

/** The mono group heading. */
export const paletteGroupLabel: (props?: import('class-variance-authority/types').ClassProp | undefined) => string = cva('px-2.5 pb-1 pt-[7px] font-mono text-[10.5px] uppercase tracking-[0.08em] text-fg3');

/** A result row's label. */
export const paletteItemLabel: (props?: import('class-variance-authority/types').ClassProp | undefined) => string = cva('min-w-0 flex-1 truncate text-sm font-medium text-fg1');

/** The footer key-hint bar. */
export const paletteFooter: (props?: import('class-variance-authority/types').ClassProp | undefined) => string = cva('flex shrink-0 items-center gap-4 border-t border-border-soft bg-surface-sunk px-4 py-[9px] text-[11.5px] text-fg3');

/** The footer result count, pushed to the right. */
export const paletteCount: (props?: import('class-variance-authority/types').ClassProp | undefined) => string = cva('ml-auto font-mono');

/** A footer key legend entry: the kbd chip plus its label. */
export const keyHint: (props?: import('class-variance-authority/types').ClassProp | undefined) => string = cva('inline-flex items-center gap-1.5');

export type PaletteItemVariants = VariantProps<typeof paletteItem>;
