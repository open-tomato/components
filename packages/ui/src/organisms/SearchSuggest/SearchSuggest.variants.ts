// @@V org-1 begin
import type { ClassProp } from 'class-variance-authority/types';
// @@V org-1 end

import { cva } from 'class-variance-authority';

// @@S mol-3 begin
/**
 * SearchSuggest — a ⌘K search box with an anchored suggestion list.
 *
 * A suggestion's `kind` is a key into the `EntityKinds` map the implementor
 * supplies; the puck and the pill take their accent from the kind's tone
 * (the shared chart palette, painted through `currentColor`).
 */
// @@S mol-3 end
// @@T org-1 begin
export const searchSuggestBox: (props?: ({ open?: boolean | null | undefined } & import('class-variance-authority/types').ClassProp) | undefined) => string = cva(
// @@T org-1 end
  [
    'flex items-center gap-2 rounded-md border px-3 py-1.5',
    'transition-colors',
  ],
  {
    variants: {
      open: {
        false: 'border-border-soft bg-surface-sunk',
        true: [
          'border-border-focus bg-surface-2',
          'shadow-[0_0_0_3px_color-mix(in_oklab,var(--border-focus)_22%,transparent)]',
        ],
      },
    },
    defaultVariants: { open: false },
  },
);

/** The anchored suggestion panel. */
// @@T org-1 begin
export const searchSuggestPanel: (props?: import('class-variance-authority/types').ClassProp) => string = cva([
// @@T org-1 end
  'absolute inset-x-0 top-[calc(100%+6px)] z-popover overflow-hidden',
  'rounded-lg border border-border-soft bg-surface-2 shadow-lg',
]);

// @@S org-1 begin
/** A suggestion row; active marks the hovered or keyboard-selected row. */
// @@S org-1 end
// @@T org-1 begin
export const searchSuggestRow: (props?: ({ active?: boolean | null | undefined } & import('class-variance-authority/types').ClassProp) | undefined) => string = cva(
// @@T org-1 end
  [
    'flex w-full cursor-pointer items-center gap-3 px-3 py-[9px]',
    'border-none text-left text-fg1',
  ],
  {
    variants: {
      active: {
        false: 'bg-transparent',
        true: 'bg-surface-sunk',
      },
    },
    defaultVariants: { active: false },
  },
);

// @@S mol-3 begin
/** The 28px leading puck; its accent comes from the kind's tone (currentColor). */
export const searchSuggestPuck: (props?: ClassProp | undefined) => string = cva([
  'flex size-7 shrink-0 items-center justify-center rounded-sm',
  'bg-[color-mix(in_oklab,currentColor_14%,transparent)]',
]);

/** The trailing kind pill — same accent as the puck, mono uppercase. */
export const searchSuggestKindPill: (props?: ClassProp | undefined) => string = cva([
  'rounded-full px-[7px] py-0.5 font-mono text-[10px] font-semibold',
  'uppercase tracking-[0.08em]',
  'bg-[color-mix(in_oklab,currentColor_14%,transparent)]',
]);
// @@S mol-3 end

// @@V org-1 begin
/* ── Ad-hoc classes moved in by stream V ────────── */

/** The root wrapper — anchors the suggestion panel. */
export const searchSuggestRoot: (props?: ClassProp | undefined) => string = cva('relative w-[340px]');

// @@S org-1 begin
/** The leading search icon. */
// @@S org-1 end
export const searchSuggestLens: (props?: ClassProp | undefined) => string = cva('shrink-0 text-fg3');

/** The combobox input inside the box. */
export const searchSuggestInput: (props?: ClassProp | undefined) => string = cva('min-w-0 flex-1 border-none bg-transparent font-body text-[13px] text-fg1 outline-none placeholder:text-fg3');

/** The panel header: match count + keyboard hints. */
export const searchSuggestHeader: (props?: ClassProp | undefined) => string = cva('flex justify-between px-3 pb-1.5 pt-2 font-mono text-[10px] uppercase tracking-[0.08em] text-fg3');

/** The no-match message. */
export const searchSuggestEmpty: (props?: ClassProp | undefined) => string = cva('px-3.5 py-4 text-[13px] text-fg3');

/** A row's text column. */
export const searchSuggestText: (props?: ClassProp | undefined) => string = cva('min-w-0 flex-1');

/** A row's label. */
export const searchSuggestLabel: (props?: ClassProp | undefined) => string = cva('block truncate text-[13px] font-semibold');

/** A row's mono context line. */
export const searchSuggestSub: (props?: ClassProp | undefined) => string = cva('block font-mono text-[11px] text-fg3');

/** The panel footer holding the search-all row. */
export const searchSuggestFooter: (props?: ClassProp | undefined) => string = cva('border-t border-border-soft p-1.5');

/** The explicit search-all row. */
export const searchSuggestAll: (props?: ClassProp | undefined) => string = cva('flex w-full cursor-pointer items-center gap-2.5 rounded-md border-none bg-transparent px-2.5 py-2 text-left text-[13px] font-medium text-accent hover:bg-surface-sunk');

/** The search-all row's query label. */
export const searchSuggestAllLabel: (props?: ClassProp | undefined) => string = cva('min-w-0 flex-1 truncate');
// @@V org-1 end
