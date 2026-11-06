import { cva, type VariantProps } from 'class-variance-authority';

/**
 * PasswordStrength — five segments filling danger → gold → success with
 * a mono label (auth screens). Empty segments keep cream-300 in both
 * themes.
 */
export const passwordStrengthSegment:
(props?: ({ fill?: 'empty' | 'danger' | 'gold' | 'success' | null } & import('class-variance-authority/types').ClassProp) | undefined) => string = cva(
  'h-1 flex-1 rounded-[2px] transition-colors',
  {
    variants: {
      fill: {
        empty: 'bg-cream-300',
        danger: 'bg-danger',
        gold: 'bg-gold-500',
        success: 'bg-success',
      },
    },
    defaultVariants: { fill: 'empty' },
  },
);

export type PasswordStrengthSegmentVariants = VariantProps<
  typeof passwordStrengthSegment
>;

/** The meter row: segments plus the label. */
export const passwordStrength: (props?: import('class-variance-authority/types').ClassProp | undefined) => string = cva('flex items-center gap-1.5');

/** The mono score label after the segments. */
export const passwordStrengthLabel: (props?: import('class-variance-authority/types').ClassProp | undefined) => string = cva('min-w-10 font-mono text-[11px] text-fg3');
