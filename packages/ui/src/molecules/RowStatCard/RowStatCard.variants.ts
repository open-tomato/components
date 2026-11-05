// @@T mol-1 begin
import type { ClassProp } from 'class-variance-authority/types';

// @@T mol-1 end
import { cva, type VariantProps } from 'class-variance-authority';

/**
 * RowStatCard — full-width single-row stat card. Design source: original design
 * `BudgetBar` + `BudgetReadout` in
 * the original Usage screen (inline styles, no CVA
 * source); contract: "RowStatCard".
 *
 * Spec deltas vs the original design (specs win):
 * - the forecast legend is re-aligned under its tick (see
 *   `RowStatCardMeter`) — the spec calls the original version misaligned;
 * - the meter track uses the theme's surface-sunk instead of the original
 *   literal cream-300 so dark mode stays coherent.
 */
// @@T mol-1 begin
export const rowStatCard: (props?: ClassProp) => string = cva(
// @@T mol-1 end
  'flex flex-col gap-3 rounded-lg border border-border-soft bg-surface-1 p-[18px]',
);

// @@T mol-1 begin
export const rowStatCardTitle: (props?: ClassProp) => string = cva(
// @@T mol-1 end
  'font-display text-base font-bold text-fg1',
);

// @@T mol-1 begin
export const rowStatCardSubtitle: (props?: ClassProp) => string = cva('mt-0.5 text-[13px] text-fg3');
// @@T mol-1 end

/** One "invisible column" ministat: label on top, value below. */
// @@T mol-1 begin
export const rowStatCardStatLabel: (props?: ClassProp) => string = cva(
// @@T mol-1 end
  'font-mono text-[10px] uppercase tracking-[0.1em] text-fg3',
);

// @@T mol-1 begin
export const rowStatCardStatValue: (props?: { tone?: 'neutral' | 'muted' | 'success' | 'danger' | 'warning' | null } & ClassProp) => string = cva(
// @@T mol-1 end
  'mt-0.5 font-mono text-base font-bold',
  {
    variants: {
      tone: {
        neutral: 'text-fg1',
        muted: 'text-fg3',
        success: 'text-success',
        danger: 'text-danger',
        warning: 'text-gold-500',
      },
    },
    defaultVariants: { tone: 'neutral' },
  },
);

// @@V mol-1 begin
/** Row 1: the title block left, the ministats (and action) right. */
export const rowStatCardHeader: (props?: ClassProp) => string = cva(
  'flex flex-wrap items-center justify-between gap-4',
);

/** The ministat columns plus the optional action, in one row. */
export const rowStatCardStats: (props?: ClassProp) => string = cva('flex items-center gap-4');
// @@V mol-1 end

/* ── RowStatCardMeter (colocated indicator for row 2) ─────────────── */

// @@V mol-1 begin
/** The meter root: track above, caption row below. */
export const rowStatCardMeter: (props?: ClassProp) => string = cva('flex flex-col gap-1.5');
// @@V mol-1 end

// @@T mol-1 begin
export const rowStatCardMeterTrack: (props?: ClassProp) => string = cva(
// @@T mol-1 end
  'relative h-3 overflow-hidden rounded-md bg-surface-sunk',
);

/** Fill tone thresholds belong to the caller; the tone axis is the mechanism. */
// @@T mol-1 begin
export const rowStatCardMeterFill: (props?: { tone?: 'accent' | 'warning' | 'danger' | null } & ClassProp) => string = cva('h-full', {
// @@T mol-1 end
  variants: {
    tone: {
      accent: 'bg-accent',
      warning: 'bg-gold-500',
      danger: 'bg-danger',
    },
  },
  defaultVariants: { tone: 'accent' },
});

/** The marker tick — overhangs the track like the original forecast tick. */
// @@T mol-1 begin
export const rowStatCardMeterTick: (props?: ClassProp) => string = cva(
// @@T mol-1 end
  'absolute -bottom-0.5 -top-0.5 w-0.5 -translate-x-1/2 bg-fg2 opacity-45',
);

// @@T mol-1 begin
export const rowStatCardMeterLabels: (props?: ClassProp) => string = cva(
// @@T mol-1 end
  'relative flex justify-between font-mono text-[10px] text-fg3',
);

/** Marker legend, centered under its tick (the original design centered it in the row — misaligned; spec calls it out). */
// @@T mol-1 begin
export const rowStatCardMeterMarkerLabel: (props?: ClassProp) => string = cva(
// @@T mol-1 end
  'absolute -translate-x-1/2 whitespace-nowrap text-fg2',
);

export type RowStatCardStatValueVariants = VariantProps<
  typeof rowStatCardStatValue
>;
export type RowStatCardMeterFillVariants = VariantProps<
  typeof rowStatCardMeterFill
>;
