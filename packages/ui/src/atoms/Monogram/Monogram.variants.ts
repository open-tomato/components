import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Monogram — an identity block: initials on a brand fill, squarer than
 * Avatar (auth screens + topbar). Font size tracks a 0.42 × box ratio; lg
 * carries a 10px radius.
 */
export const monogram:
(props?: ({ tone?: 'accent' | 'primary' | 'gold' | null; size?: 'sm' | 'md' | 'lg' | null } & import('class-variance-authority/types').ClassProp) | undefined) => string = cva(
  'inline-flex shrink-0 items-center justify-center font-display font-bold text-on-accent',
  {
    variants: {
      tone: {
        accent: 'bg-accent',
        primary: 'bg-primary',
        gold: 'bg-gold-500',
      },
      size: {
        sm: 'size-6 rounded-[6px] text-[10px]',
        md: 'size-9 rounded-[6px] text-[15px]',
        lg: 'size-11 rounded-[10px] text-[18px]',
      },
    },
    defaultVariants: { tone: 'accent', size: 'md' },
  },
);

export type MonogramVariants = VariantProps<typeof monogram>;
