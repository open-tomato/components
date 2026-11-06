import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Card — decoration for an item: surface, border, radius, shadow, plus an
 * optional header slot. No interaction; wrap in a Touchable to click it.

 */
export const card: (props?: ({ noShadow?: boolean | null | undefined; padding?: 'sm' | 'md' | 'lg' | null | undefined; density?: 'compact' | 'comfortable' | null | undefined; bordered?: boolean | null | undefined; rounded?: 'md' | 'lg' | 'xl' | null | undefined } & import('class-variance-authority/types').ClassProp) | undefined) => string = cva('flex flex-col bg-surface-1', {
  variants: {
    noShadow: {
      false: 'shadow-sm',
      true: 'shadow-none',
    },
    padding: {
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-5',
    },
    density: {
      comfortable: 'gap-3',
      compact: 'gap-2',
    },
    bordered: {
      false: 'border-0',
      true: 'border border-border-soft',
    },
    rounded: {
      md: 'rounded-md',
      lg: 'rounded-lg',
      xl: 'rounded-xl',
    },
  },
  defaultVariants: {
    noShadow: true,
    padding: 'md',
    density: 'comfortable',
    bordered: true,
    rounded: 'lg',
  },
});

/** The header slot's row + divider; density mirrors the card's gap rhythm. */
export const cardHeader: (props?: ({ density?: 'compact' | 'comfortable' | null | undefined } & import('class-variance-authority/types').ClassProp) | undefined) => string = cva(
  'flex items-center justify-between border-b border-border-soft',
  {
    variants: {
      density: {
        comfortable: 'pb-3',
        compact: 'pb-2',
      },
    },
    defaultVariants: { density: 'comfortable' },
  },
);

export type CardVariants = VariantProps<typeof card>;
