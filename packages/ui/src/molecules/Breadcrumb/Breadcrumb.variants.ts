import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Breadcrumb — "where am I": a controlled current index over a path.
 * One of the four selection-index chromes (`value + onChange + items`).

 */
// @@T mol-2 begin
export const breadcrumbItem: (props?: ({state?: 'current' | 'past' | 'upcoming' | null | undefined;} & import('class-variance-authority/types').ClassProp) | undefined) => string = cva(
// @@T mol-2 end

  'px-2 py-1 rounded-sm text-[13.5px] font-body',
  {
    variants: {
      state: {
        current: 'font-bold text-fg1',
        past: 'font-medium text-fg2',
        upcoming: 'font-medium text-fg3',
      },
    },
    defaultVariants: { state: 'upcoming' },
  },
);

export type BreadcrumbItemVariants = VariantProps<typeof breadcrumbItem>;
