import { cva, type VariantProps } from 'class-variance-authority';

/**
 * EmptyState — the "nothing here yet" surface, and the one place the mascot
 * appears in-app. Variants set scale and alignment; the action slot is
 * optional.

 */
// @@T ato-1 begin
export const emptyState: (props?: ({ size?: 'sm' | 'md' | 'lg' | null | undefined; align?: 'start' | 'center' | null | undefined } & import('class-variance-authority/types').ClassProp) | undefined) => string = cva('flex flex-col w-full', {
// @@T ato-1 end
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

// @@V ato-1 begin
/** The mascot's puck: a primary-tinted circle. */
export const emptyStateMark: (props?: import('class-variance-authority/types').ClassProp | undefined) => string = cva('flex size-[52px] items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--primary)_12%,var(--surface-1))]');

/** The title line. */
export const emptyStateTitle: (props?: import('class-variance-authority/types').ClassProp | undefined) => string = cva('font-display text-[17px] font-bold text-fg1');

/** The optional description under the title. */
export const emptyStateDescription: (props?: import('class-variance-authority/types').ClassProp | undefined) => string = cva('max-w-[240px] text-[13px] leading-normal text-fg2');

/** The optional action slot's wrapper. */
export const emptyStateAction: (props?: import('class-variance-authority/types').ClassProp | undefined) => string = cva('mt-1');
// @@V ato-1 end

export type EmptyStateVariants = VariantProps<typeof emptyState>;
