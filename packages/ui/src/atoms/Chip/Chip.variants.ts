// @@T ato-3 begin
import type { ClassProp } from 'class-variance-authority/types';
// @@T ato-3 end

import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Chip — a removable token: an active filter, an invited teammate. The only
 * leaf atom with an affordance (remove).
 *
 * Always accent-tinted; the padding tightens on the remove side to
 * optically balance the round button.
 */
// @@T ato-3 begin
export const chip: (
  props?: {
    removable?: boolean | null | undefined;
  } & ClassProp,
) => string = cva(
// @@T ato-3 end

  'inline-flex items-center gap-[7px] rounded-full border bg-accent-soft border-accent-tint text-fg1 text-[12.5px] font-semibold',
  {
    variants: {
      removable: {
        false: 'py-[5px] px-3',
        true: 'py-1 pl-[11px] pr-1.5',
      },
    },
    defaultVariants: {
      removable: false,
    },
  },
);

// @@V ato-3 begin
/** The leading icon slot (accent-colored). */
export const chipIcon: (props?: ClassProp | undefined) => string = cva('text-accent shrink-0');

/** The round remove affordance on the trailing side. */
export const chipRemove: (props?: ClassProp | undefined) => string = cva('size-[17px] justify-center border-none bg-[color-mix(in_oklab,var(--accent)_22%,transparent)] text-accent');
// @@V ato-3 end

export type ChipVariants = VariantProps<typeof chip>;
