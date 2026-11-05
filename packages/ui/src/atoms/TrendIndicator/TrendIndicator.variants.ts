import { cva, type VariantProps } from 'class-variance-authority';

/**
 * TrendIndicator — up/down/flat trend glyph with optional percentage
 * (spec-driven). Type treatment mirrors the original design
 * MetricTile delta (mono, 11px, semibold, success/danger accents).
 */
// @@T ato-2 begin
export const trendIndicator:
(props?: { direction?: 'up' | 'down' | 'flat' | null } & import('class-variance-authority/types').ClassProp) => string = cva(
// @@T ato-2 end
  'inline-flex items-center gap-0.5 font-mono text-[11px] font-semibold',
  {
    variants: {
      direction: {
        up: 'text-success',
        down: 'text-danger',
        flat: 'text-fg3',
      },
    },
    defaultVariants: { direction: 'flat' },
  },
);

export type TrendIndicatorVariants = VariantProps<typeof trendIndicator>;
