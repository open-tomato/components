import { cva, type VariantProps } from 'class-variance-authority';

import { chartTone, type ChartTone } from '../../lib';

/**
 * Sparkline — a small inline trend chart for card bottoms and table cells.
 * Derived from the design source's `Sparkline` (inline-styled SVG,
 * no CVA source): 1.5px line in the series color over a faint area fill.
 * Color rides on `currentColor` via the shared chart tone axis, so the
 * same palette drives every chart component.
 */
export const sparkline: (props?: ({ size?: 'sm' | 'md' | null | undefined } & import('class-variance-authority/types').ClassProp) | undefined) => string =
  cva('block w-full', {
    variants: {
      size: {
      /** Table-cell scale. */
        sm: 'h-6',
        /** Card-bottom scale (the design source renders it at 36px). */
        md: 'h-9',
      },
    },
    defaultVariants: { size: 'md' },
  });

/**
 * The series color: the shared chart palette (`chartTone` in `src/lib`),
 * bound here so the component reads every class from its variants file.
 */
export const sparklineTone: (props?: ({ tone?: ChartTone | null | undefined } & import('class-variance-authority/types').ClassProp) | undefined) => string = chartTone;

export type SparklineVariants = VariantProps<typeof sparkline>;
