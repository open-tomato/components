import type { ClassProp } from 'class-variance-authority/types';

import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Pagination — "page N of M": a controlled current index over page numbers.

 */
export const paginationButton: (props?: { active?: boolean | null } & ClassProp) => string = cva(
  [
    'inline-flex min-w-8 h-8 items-center justify-center px-2 rounded-md',
    'font-mono text-[13px] border',
    'disabled:opacity-45 disabled:pointer-events-none',
  ],
  {
    variants: {
      active: {
        false: 'bg-surface-1 text-fg1 border-border-strong font-medium',
        true: 'bg-primary text-on-primary border-primary font-bold',
      },
    },
    defaultVariants: { active: false },
  },
);

/** The row of page buttons. */
export const paginationRoot: (props?: ClassProp) => string = cva('inline-flex items-center gap-1');

export type PaginationButtonVariants = VariantProps<typeof paginationButton>;
