import type { ClassProp } from 'class-variance-authority/types';

import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Field — a labelled input. Owns the label, the control frame and the
 * helper/error line; the state variant drives the border and message colors,
 * never per-call overrides.

 */
export const field: (props?: { state?: 'default' | 'error' | 'success' | 'disabled' | null | undefined; size?: 'sm' | 'md' | null | undefined } & ClassProp) => string = cva(

  'w-full rounded-md bg-surface-1 border px-3 text-fg1 placeholder:text-fg3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf',
  {
    variants: {
      state: {
        default: 'border-border-strong',
        error: 'border-danger',
        success: 'border-success',
        disabled: 'opacity-60 pointer-events-none',
      },
      size: {
        sm: 'h-8 text-sm',
        md: 'h-10 text-sm',
      },
    },
    defaultVariants: {
      state: 'default',
      size: 'md',
    },
  },
);

/** The helper/error line under the control; color follows the state. */
export const fieldHelper: (props?: { state?: 'default' | 'error' | 'success' | 'disabled' | null | undefined } & ClassProp) => string =
  cva('text-[11.5px]', {
    variants: {
      state: {
        default: 'text-fg3',
        error: 'text-danger',
        success: 'text-success',
        disabled: 'text-fg3',
      },
    },
    defaultVariants: { state: 'default' },
  });

/** The outer column; dims the whole field when disabled. */
export const fieldRoot: (props?: { disabled?: boolean | null | undefined } & ClassProp) => string =
  cva('flex flex-col gap-1.5', {
    variants: {
      disabled: {
        true: 'opacity-60',
        false: '',
      },
    },
    defaultVariants: { disabled: false },
  });

/** The label above the control. */
export const fieldLabel: (props?: ClassProp) => string = cva(
  'text-[12.5px] font-semibold text-fg1',
);

/** The frame that positions the leading icon over the input. */
export const fieldControl: (props?: ClassProp) => string = cva(
  'relative flex items-center',
);

/** The leading icon slot inside the control. */
export const fieldIcon: (props?: ClassProp) => string = cva(
  'absolute left-[11px] text-fg3 pointer-events-none',
);

/** Left padding that clears the leading icon when one is present. */
export const fieldIconPad: (props?: { icon?: boolean | null | undefined } & ClassProp) => string =
  cva('', {
    variants: {
      icon: {
        true: 'pl-8',
        false: '',
      },
    },
    defaultVariants: { icon: false },
  });

export type FieldVariants = VariantProps<typeof field>;
