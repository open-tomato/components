import { cva, type VariantProps } from 'class-variance-authority';

/**
 * EmptyState — the "nothing here yet" surface. Variants set scale and
 * alignment; the illustration and action slots are optional.

 */
export const emptyState: (props?: ({ size?: 'sm' | 'md' | 'lg' | null | undefined; align?: 'start' | 'center' | null | undefined } & import('class-variance-authority/types').ClassProp) | undefined) => string = cva('flex flex-col w-full', {
  variants: {
    size: {
      sm: 'py-6 gap-2',
      md: 'py-10 gap-3',
      lg: 'py-16 gap-4',
    },
    align: {
      center: 'items-center text-center',
      start: 'items-start text-left',
    },
  },
  defaultVariants: {
    size: 'md',
    align: 'center',
  },
});

/** The illustration slot's puck: a primary-tinted circle. */
export const emptyStateMark: (props?: import('class-variance-authority/types').ClassProp | undefined) => string = cva('flex size-[52px] items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--primary)_12%,var(--surface-1))]');

/** The title line. */
export const emptyStateTitle: (props?: import('class-variance-authority/types').ClassProp | undefined) => string = cva('font-display text-[17px] font-bold text-fg1');

/** The optional description under the title. */
export const emptyStateDescription: (props?: import('class-variance-authority/types').ClassProp | undefined) => string = cva('max-w-[240px] text-[13px] leading-normal text-fg2');

/** The optional action slot's wrapper. */
export const emptyStateAction: (props?: import('class-variance-authority/types').ClassProp | undefined) => string = cva('mt-1');

export type EmptyStateVariants = VariantProps<typeof emptyState>;
