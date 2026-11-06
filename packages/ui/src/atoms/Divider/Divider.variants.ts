import type { ClassProp } from 'class-variance-authority/types';

import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Divider — a horizontal rule, optionally interrupted by a mono label
 * ("or with email"). Used by the auth screens.
 */
export const divider: (props?: ClassProp) => string = cva(
  'flex w-full items-center gap-3',
);

export const dividerRule: (props?: ClassProp) => string = cva(
  'h-px flex-1 bg-border-soft',
);

export const dividerLabel: (props?: ClassProp) => string = cva(

  'font-mono text-[10px] uppercase tracking-[0.1em] text-fg3',
);

/** The plain rule, rendered when no label is given. */
export const dividerPlain: (props?: ClassProp) => string = cva(
  'h-px w-full bg-border-soft',
);

export type DividerVariants = VariantProps<typeof divider>;
