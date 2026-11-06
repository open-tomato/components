import type { ClassProp } from 'class-variance-authority/types';

import { cva, type VariantProps } from 'class-variance-authority';

/**
 * CodeInput — one cell per digit, auto-advance, backspace-to-previous
 * (auth + settings 2FA). Filled cells carry the accent border.
 */
export const codeInputCell: (props?: { filled?: boolean | null } & ClassProp) => string = cva(
  [
    'h-14 w-11 rounded-md border bg-surface-1 text-center',
    'font-mono text-[22px] font-semibold text-fg1',
    'outline-none transition-colors',
  ],
  {
    variants: {
      filled: {
        false: 'border-border-soft',
        true: 'border-accent',
      },
    },
    defaultVariants: { filled: false },
  },
);

/** The cell row: digits centred with a fixed gutter. */
export const codeInputGroup: (props?: ClassProp) => string = cva('flex justify-center gap-2');

export type CodeInputCellVariants = VariantProps<typeof codeInputCell>;
