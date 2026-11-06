import type { ClassProp } from 'class-variance-authority/types';

import { cva, type VariantProps } from 'class-variance-authority';

import { chartTone, type ChartTone } from '../../lib';

/* ── UsageBar (colocated bar indicator, reused by 03c cell content) ── */

export const usageBarTrack: (props?: { size?: 'md' | 'sm' | null; track?: boolean | null } & ClassProp) => string = cva('relative w-full overflow-hidden', {
  variants: {
    size: {
      /** Simple-row stroke. */
      md: 'h-2.5 rounded-[5px]',
      /** Multi-row stroke (mini cells). */
      sm: 'h-[5px] rounded-[3px]',
    },
    /** Gray background — the progress variant's required track. */
    track: {
      false: 'bg-transparent',
      true: 'bg-surface-sunk',
    },
  },
  defaultVariants: { size: 'md', track: false },
});

export const usageBarFill: (props?: ClassProp) => string = cva(
  'absolute inset-y-0 left-0 rounded-[inherit] bg-current',
);

/**
 * Overflow treatment (>100% progress — not in the original design, spec
 * asks for one): the track re-scales so the whole bar represents the
 * VALUE; the solid danger fill runs up to the goal tick, the overflow
 * region past the tick renders the same danger at reduced opacity, and
 * a contrast tick marks where 100% sits.
 */
export const usageBarOverflowFill: (props?: ClassProp) => string = cva(
  'absolute inset-y-0 right-0 rounded-r-[inherit] bg-current opacity-40',
);

export const usageBarGoalTick: (props?: ClassProp) => string = cva(
  'absolute inset-y-0 w-0.5 -translate-x-1/2 bg-surface-1',
);

/**
 * The bar's series color: the shared chart palette (`chartTone` in
 * `src/lib`), bound here so the component reads every class from its
 * variants file.
 */
export const usageBarTone: (props?: ({ tone?: ChartTone | null | undefined } & ClassProp) | undefined) => string = chartTone;

export type UsageBarTrackVariants = VariantProps<typeof usageBarTrack>;
