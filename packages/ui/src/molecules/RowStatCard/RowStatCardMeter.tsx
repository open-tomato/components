// @@T mol-1 begin
import { forwardRef, type HTMLAttributes, type ForwardRefExoticComponent, type PropsWithoutRef, type RefAttributes } from 'react';
// @@T mol-1 end

import { cn } from '../../lib';

// @@V mol-1 begin
import {
  rowStatCardMeter,
  rowStatCardMeterFill,
  rowStatCardMeterLabels,
  rowStatCardMeterMarkerLabel,
  rowStatCardMeterTick,
  rowStatCardMeterTrack,
  type RowStatCardMeterFillVariants,
} from './RowStatCard.variants';
// @@V mol-1 end

const clampRatio = (ratio: number): number => Math.max(0, Math.min(1, ratio));

export interface RowStatCardMeterProps
  extends HTMLAttributes<HTMLDivElement>,
  RowStatCardMeterFillVariants {
  /** Fill ratio, 0–1 (clamped). */
  value: number;
  /** Start/end captions under the track (`May 1` / `May 31`). */
  startLabel?: string;
  /** End caption, right-aligned. */
  endLabel?: string;
  /**
   * Optional marker tick (forecast/goal): ratio position + legend. The
   * legend renders centered UNDER the tick — this fixes the original design's
   * misaligned forecast legend (it was centered in the caption row
   * regardless of the tick's position; the spec calls it out).
   */
  marker?: { ratio: number; label: string };
  /** Accessible description of the meter (falls back to a percentage). */
  label?: string;
}

/**
 * RowStatCardMeter — the row-2 graphical indicator for RowStatCard
 * (original design BudgetBar's track + forecast tick + caption row). Colocated:
 * story coverage lives on RowStatCard.
 */
// @@T mol-1 begin
export const RowStatCardMeter: ForwardRefExoticComponent<PropsWithoutRef<RowStatCardMeterProps> & RefAttributes<HTMLDivElement>> = forwardRef<HTMLDivElement, RowStatCardMeterProps>(
// @@T mol-1 end
  (
    { className, value, startLabel, endLabel, marker, tone, label, ...props },
    ref,
  ) => {
    const pct = clampRatio(value) * 100;
    const markerPct = marker != null
      ? clampRatio(marker.ratio) * 100
      : null;
    return (
      <div
        ref={ref}
        // @@V mol-1 begin
        className={cn(rowStatCardMeter(), className)}
        // @@V mol-1 end
        {...props}
      >
        <div
          role="meter"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pct)}
          aria-label={label ?? `${Math.round(pct)}% used`}
          className={rowStatCardMeterTrack()}
        >
          <div
            className={rowStatCardMeterFill({ tone })}
            // Fill fraction is genuinely dynamic (Progress precedent).
            style={{ width: `${pct}%` }}
          />
          {markerPct != null && (
            <div
              className={rowStatCardMeterTick()}
              style={{ left: `${markerPct}%` }}
            />
          )}
        </div>
        {(startLabel != null || endLabel != null || marker != null) && (
          <div className={rowStatCardMeterLabels()}>
            <span>{startLabel}</span>
            {marker != null && markerPct != null && (
              <span
                className={rowStatCardMeterMarkerLabel()}
                style={{ left: `${Math.max(8, Math.min(92, markerPct))}%` }}
              >
                {`↑ ${marker.label}`}
              </span>
            )}
            <span>{endLabel}</span>
          </div>
        )}
      </div>
    );
  },
);

RowStatCardMeter.displayName = 'RowStatCardMeter';
