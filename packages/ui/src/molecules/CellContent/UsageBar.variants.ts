// @@T mol-1 begin
import type { ClassProp } from 'class-variance-authority/types';

// @@T mol-1 end
import { cva, type VariantProps } from 'class-variance-authority';

/* ── UsageBar (colocated bar indicator, reused by 03c cell content) ── */

// @@T mol-1 begin
export const usageBarTrack: (props?: { size?: 'md' | 'sm' | null; track?: boolean | null } & ClassProp) => string = cva('relative w-full overflow-hidden', {
// @@T mol-1 end
  variants: {
    size: {
      /** Original ToolBars stroke (simple rows). */
      md: 'h-2.5 rounded-[5px]',
      /** Original AgentRanking stroke (multi rows, mini cells). */
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

// @@T mol-1 begin
export const usageBarFill: (props?: ClassProp) => string = cva(
// @@T mol-1 end
  'absolute inset-y-0 left-0 rounded-[inherit] bg-current',
);

/**
 * Overflow treatment (>100% progress — not in the original design, spec
 * asks for one): the track re-scales so the whole bar represents the
 * VALUE; the solid danger fill runs up to the goal tick, the overflow
 * region past the tick renders the same danger at reduced opacity, and
 * a contrast tick marks where 100% sits.
 */
// @@T mol-1 begin
export const usageBarOverflowFill: (props?: ClassProp) => string = cva(
// @@T mol-1 end
  'absolute inset-y-0 right-0 rounded-r-[inherit] bg-current opacity-40',
);

// @@T mol-1 begin
export const usageBarGoalTick: (props?: ClassProp) => string = cva(
// @@T mol-1 end
  'absolute inset-y-0 w-0.5 -translate-x-1/2 bg-surface-1',
);

export type UsageBarTrackVariants = VariantProps<typeof usageBarTrack>;
