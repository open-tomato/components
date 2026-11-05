import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Grid — grid layout for a set of children (agent grid, metric row, tools
 * gallery). Pair with GridItem for explicit placement.
 *
 * The auto column tracks minmax(180px,1fr).
 */
// @@T ato-2 begin
export const grid:
(props?: ({ cols?: 'auto' | '1' | '2' | '3' | '4' | null; gap?: 'sm' | 'md' | 'lg' | null } & import('class-variance-authority/types').ClassProp) | undefined) => string = cva('grid', {
// @@T ato-2 end
  variants: {
    cols: {
      '1': 'grid-cols-1',
      '2': 'grid-cols-2',
      '3': 'grid-cols-3',
      '4': 'grid-cols-4',
      auto: 'grid-cols-[repeat(auto-fill,minmax(180px,1fr))]',
    },
    gap: {
      sm: 'gap-3',
      md: 'gap-4',
      lg: 'gap-6',
    },
  },
  defaultVariants: {
    cols: 'auto',
    gap: 'md',
  },
});

export type GridVariants = VariantProps<typeof grid>;
