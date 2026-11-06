import { forwardRef, type HTMLAttributes, type ReactNode, type ForwardRefExoticComponent, type PropsWithoutRef, type RefAttributes } from 'react';

import { cn } from '../../lib';

import {
  rowStatCard,
  rowStatCardHeader,
  rowStatCardStatLabel,
  rowStatCardStats,
  rowStatCardStatValue,
  rowStatCardSubtitle,
  rowStatCardTitle,
  type RowStatCardStatValueVariants,
} from './RowStatCard.variants';

export interface RowStat {
  /** Ministat label, on top (mono, uppercase). */
  title: string;
  /** Ministat value, below. Formatted by the caller. */
  value: ReactNode;
  /**
   * Value accent. `trend` derives it automatically (positive → success,
   * negative → danger); an explicit tone always wins.
   */
  tone?: RowStatCardStatValueVariants['tone'];
  /** Ratio trend that auto-accents the value when `tone` is absent. */
  trend?: number;
}

export interface RowStatCardProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Row 1 left: title (display font). */
  title: string;
  /** Row 1 left: small greyed subtitle. */
  subtitle?: ReactNode;
  /** Row 1 right: the "invisible columns" of ministats. */
  stats?: RowStat[];
  /** Row 1 far right: optional action (for example an adjust button). */
  action?: ReactNode;
  /**
   * Row 2: optional contextual text, link, or graphical indicator —
   * pair with the colocated `RowStatCardMeter` for the budget meter.
   */
  footer?: ReactNode;
}

const statTone = (
  stat: RowStat,
): RowStatCardStatValueVariants['tone'] => {
  if (stat.tone != null) return stat.tone;
  if (stat.trend == null || stat.trend === 0) return 'neutral';
  return stat.trend > 0
    ? 'success'
    : 'danger';
};

/**
 * RowStatCard — full-width card with title/subtitle left and borderless
 * ministat columns right, plus an optional second row (text, link, or
 * indicator); contract: "RowStatCard".
 *
 * Interpretation decisions:
 * - `action` slot: a button can sit beside the readouts;
 *   the spec's row-1 contract is title + ministats, so the button is an
 *   explicit optional slot rather than a ministat.
 * - automatic accent: a ministat's `trend` colors its value
 *   (up → success, down → danger); explicit `tone` overrides.
 */
export const RowStatCard: ForwardRefExoticComponent<PropsWithoutRef<RowStatCardProps> & RefAttributes<HTMLDivElement>> = forwardRef<HTMLDivElement, RowStatCardProps>(
  ({ className, title, subtitle, stats, action, footer, ...props }, ref) => (
    <div ref={ref} className={cn(rowStatCard(), className)} {...props}>
      <div
        className={rowStatCardHeader()}
      >
        <div>
          <div className={rowStatCardTitle()}>{title}</div>
          {subtitle != null && (
            <div className={rowStatCardSubtitle()}>{subtitle}</div>
          )}
        </div>
        {(stats != null || action != null) && (
          <div
            className={rowStatCardStats()}
          >
            {stats?.map((stat) => (
              <div key={stat.title}>
                <div className={rowStatCardStatLabel()}>{stat.title}</div>
                <div
                  className={rowStatCardStatValue({ tone: statTone(stat) })}
                >
                  {stat.value}
                </div>
              </div>
            ))}
            {action}
          </div>
        )}
      </div>
      {footer}
    </div>
  ),
);

RowStatCard.displayName = 'RowStatCard';
