import { cva, type VariantProps } from 'class-variance-authority';

// @@V ato-1 begin
import { chartTone, type ChartTone } from '../../lib';
// @@V ato-1 end

/**
 * Sparkline — a small inline trend chart for card bottoms and table cells.
 * Derived from the original design `Sparkline` in
 * the original MetricTile screen (inline-styled SVG,
 * no CVA source): 1.5px line in the series color over a faint area fill.
 * Color rides on `currentColor` via the shared chart tone axis, so the
 * same palette drives every chart component.
 */
// @@T ato-1 begin
export const sparkline: (props?: ({ size?: 'sm' | 'md' | null | undefined } & import('class-variance-authority/types').ClassProp) | undefined) => string =
// @@T ato-1 end
  cva('block w-full', {
    variants: {
      size: {
      /** Table-cell scale. */
        sm: 'h-6',
        /** Card-bottom scale (original MetricTile renders at 36px). */
        md: 'h-9',
      },
    },
    defaultVariants: { size: 'md' },
  });

// @@V ato-1 begin
/**
 * The series color: the shared chart palette (`chartTone` in `src/lib`),
 * bound here so the component reads every class from its variants file.
 */
export const sparklineTone: (props?: ({ tone?: ChartTone | null | undefined } & import('class-variance-authority/types').ClassProp) | undefined) => string = chartTone;
// @@V ato-1 end

export type SparklineVariants = VariantProps<typeof sparkline>;
