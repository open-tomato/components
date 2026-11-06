import { cva, type VariantProps } from 'class-variance-authority';

/**
 * IconButton — a 32px ghost square holding a single glyph. The hover
 * sink mirrors the active fill (hover is the designed affordance).
 */
export const iconButton: (props?: ({ active?: boolean | null | undefined } & import('class-variance-authority/types').ClassProp) | undefined) => string = cva(
  [
    'inline-flex size-8 cursor-pointer items-center justify-center',
    'rounded-md border-none text-fg1 transition-colors',
  ],
  {
    variants: {
      active: {
        false: 'bg-transparent hover:bg-surface-sunk',
        true: 'bg-surface-sunk',
      },
    },
    defaultVariants: { active: false },
  },
);

export type IconButtonVariants = VariantProps<typeof iconButton>;
