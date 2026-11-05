import type { ClassProp } from 'class-variance-authority/types';

import { cva } from 'class-variance-authority';

// @@S tpl-1 begin
/** The Item cell's lead: the item name before its ` · ` suffix. */
// @@S tpl-1 end
export const sessionName: (props?: ClassProp) => string = cva('font-semibold');

// @@S tpl-1 begin
/** The Item cell's mono ` · suffix` after the name. */
// @@S tpl-1 end
export const sessionSuffix: (props?: ClassProp) => string = cva('font-mono text-xs text-fg3');

/** The Goal cell's text. */
export const sessionGoal: (props?: ClassProp) => string = cva('text-fg2');

/** The Model cell's mono id. */
export const sessionModel: (props?: ClassProp) => string = cva('font-mono text-[12.5px] text-fg2');

// @@S tpl-1 begin
/** The Usage cell: mono, and dimmed when the item used none. */
// @@S tpl-1 end
export const sessionTokens: (
  props?: {
    empty?: boolean | null | undefined;
  } & ClassProp,
) => string = cva('font-mono', {
  variants: {
    empty: {
      false: '',
      true: 'text-fg3',
    },
  },
  defaultVariants: { empty: false },
});

/** The Updated cell's mono `Nm ago`. */
export const sessionUpdated: (props?: ClassProp) => string = cva(
  'font-mono text-[12.5px] text-fg3',
);
