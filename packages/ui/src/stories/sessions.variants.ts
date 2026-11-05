import type { ClassProp } from 'class-variance-authority/types';

import { cva } from 'class-variance-authority';

/** The Session cell's lead: the session name before its ` · ` suffix. */
export const sessionName: (props?: ClassProp) => string = cva('font-semibold');

/** The Session cell's mono ` · suffix` after the name. */
export const sessionSuffix: (props?: ClassProp) => string = cva('font-mono text-xs text-fg3');

/** The Goal cell's text. */
export const sessionGoal: (props?: ClassProp) => string = cva('text-fg2');

/** The Model cell's mono id. */
export const sessionModel: (props?: ClassProp) => string = cva('font-mono text-[12.5px] text-fg2');

/** The Tokens cell: mono, and dimmed when the session spent none. */
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
