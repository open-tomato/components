// @@T ato-3 begin
import type { ClassProp } from 'class-variance-authority/types';
// @@T ato-3 end

import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Shell — outermost layout + decoration for a page or section. No interaction.
 *
 * lg padding is p-10 (40px) by spec.
 */
// @@T ato-3 begin
export const shell: (
  props?: {
    padding?: 'none' | 'sm' | 'md' | 'lg' | null | undefined;
    tone?: 'bg' | 'surface' | 'sunk' | null | undefined;
    bordered?: boolean | null | undefined;
    rounded?: 'none' | 'lg' | 'xl' | null | undefined;
  } & ClassProp,
) => string = cva('flex flex-col w-full', {
// @@T ato-3 end
  variants: {
    padding: {
      none: 'p-0',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-10',
    },
    tone: {
      bg: 'bg-bg',
      surface: 'bg-surface-1',
      sunk: 'bg-surface-sunk',
    },
    bordered: {
      false: 'border-0',
      true: 'border border-border-soft',
    },
    rounded: {
      none: 'rounded-none',
      lg: 'rounded-lg',
      xl: 'rounded-xl',
    },
  },
  defaultVariants: {
    padding: 'lg',
    tone: 'bg',
    bordered: false,
    rounded: 'none',
  },
});

export type ShellVariants = VariantProps<typeof shell>;
