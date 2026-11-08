import type { ClassProp } from 'class-variance-authority/types';

import { cva, type VariantProps } from 'class-variance-authority';

/**
 * The switcher's trigger: the active option as a pill.
 * Fixed/max width (truncating), and the component carries no top-bar-scope
 * dependency — it may later live in the sidebar.
 */
export const contextSwitcherTrigger: (props?: ClassProp) => string = cva([
  'flex max-w-[240px] cursor-pointer items-center gap-2.5',
  'rounded-md border border-border-soft bg-surface-sunk px-2.5 py-1.5',
  'font-body text-[13px] text-fg1 transition-colors hover:bg-surface-2',
]);

/** A recent-option row (the menu's top section). */
export const contextRow: (
  props?: {
    active?: boolean | null | undefined;
  } & ClassProp,
) => string = cva(
  [
    'flex w-full cursor-pointer select-none items-center gap-2.5',
    'rounded-md px-2.5 py-2 text-left outline-none',
    'data-[highlighted]:bg-surface-sunk',
  ],
  {
    variants: {
      active: {
        false: '',
        true: 'bg-surface-sunk',
      },
    },
    defaultVariants: { active: false },
  },
);

export type ContextRowVariants = VariantProps<typeof contextRow>;

/** The trigger's active option name, truncating inside the pill. */
export const contextSwitcherName: (props?: ClassProp) => string = cva(
  'min-w-0 truncate font-semibold',
);

/** The trigger's trailing chevron. */
export const contextSwitcherChevron: (props?: ClassProp) => string = cva('shrink-0 text-fg3');

/** The open menu's fixed width. */
export const contextSwitcherMenu: (props?: ClassProp) => string = cva('w-[300px]');

/** The check mark trailing the active recent row. */
export const contextRowCheck: (props?: ClassProp) => string = cva('shrink-0 text-accent');

/** A recent row's body: the mark beside the name and meta line. */
export const contextRowBody: (props?: ClassProp) => string = cva(
  'flex min-w-0 items-center gap-2.5',
);

/** A recent row's text column. */
export const contextRowText: (props?: ClassProp) => string = cva('min-w-0');

/** A recent row's option name. */
export const contextRowName: (props?: ClassProp) => string = cva(
  'block truncate text-[13px] font-semibold',
);

/** A recent row's mono meta line under the name. */
export const contextRowMeta: (props?: ClassProp) => string = cva(
  'block font-mono text-[11px] font-normal text-fg3',
);

/** The "see all" row's trailing mono total. */
export const contextSwitcherTotal: (props?: ClassProp) => string = cva(
  'font-mono text-[11px] text-fg3',
);
