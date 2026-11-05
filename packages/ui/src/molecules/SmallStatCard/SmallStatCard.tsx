import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

import { TrendIndicator } from '../../atoms';
import { cn, formatNumber } from '../../lib';

import {
  smallStatCard,
  smallStatCardFooter,
  // @@V mol-3 begin
  smallStatCardHeader,
  // @@V mol-3 end
  smallStatCardNumber,
  smallStatCardSuffix,
  smallStatCardTitle,
  smallStatCardValue,
  type SmallStatCardVariants,
} from './SmallStatCard.variants';

export interface SmallStatCardProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'title'>,
  SmallStatCardVariants {
  /** Top-line title, left (mono, uppercase). */
  title: string;
  /**
   * Top-line right slot, trend flavour: ratio for a TrendIndicator with
   * value (`0.12` → `+12%`). Wins over `decoration` when both are given.
   */
  trend?: number;
  /** Top-line right slot, decoration flavour: icon / avatar / label. */
  decoration?: ReactNode;
  /**
   * The stat. Numbers are formatted human-readable (`1.2M`); pass a node
   * (e.g. `<FormattedCurrency>`) to take over formatting.
   */
  value: number | ReactNode;
  // @@S mol-3 begin
  /** Unit suffix — small, greyed, right of the value (`units`, `runs`). */
  // @@S mol-3 end
  unit?: string;
  /** Renders the suffix as `/ goal` (current / goal), before any unit. */
  goal?: number;
  /** Compact notation for numeric value/goal (default true). */
  short?: boolean;
  locale?: string;
  /**
   * Optional bottom line: contextual text, a link, or a graphical
   * indicator (Progress / Sparkline). Bottom-anchored so tiles align.
   */
  footer?: ReactNode;
}

// @@S mol-3 begin
/**
 * SmallStatCard — at-a-glance stat tile (hero rows of overview pages).
 * Design source: original design `MetricTile` (the original usage screen); contract:
 * "SmallStatCard".
 *
 * Interpretation decisions (spec leaves open):
 * - `trend` wins over `decoration` when both are passed — the spec offers
 *   the top-right slot to one of them, and the trend is the datum.
 * - Numeric values format via the shared human-readable formatter; any
 *   ReactNode value renders verbatim for currency/custom cases.
 */
// @@S mol-3 end
// @@T mol-3 begin
export const SmallStatCard: import('react').ForwardRefExoticComponent<
  SmallStatCardProps & import('react').RefAttributes<HTMLDivElement>
> = forwardRef<HTMLDivElement, SmallStatCardProps>(
// @@T mol-3 end
  (
    {
      className,
      title,
      trend,
      decoration,
      value,
      unit,
      goal,
      short = true,
      locale,
      footer,
      size,
      ...props
    },
    ref,
  ) => {
    const suffix = [
      goal != null
        ? `/ ${formatNumber(goal, { short, locale })}`
        : null,
      unit,
    ]
      .filter(Boolean)
      .join(' ');
    return (
      <div
        ref={ref}
        className={cn(smallStatCard({ size }), className)}
        {...props}
      >
        {/* @@V mol-3 begin */}
        <div className={smallStatCardHeader()}>
          {/* @@V mol-3 end */}
          <span className={smallStatCardTitle()}>{title}</span>
          {trend != null
            ? <TrendIndicator trend={trend} showValue locale={locale} />
            : decoration}
        </div>
        <div className={smallStatCardValue()}>
          <span className={smallStatCardNumber({ size })}>
            {typeof value === 'number'
              ? formatNumber(value, { short, locale })
              : value}
          </span>
          {suffix !== '' && (
            <span className={smallStatCardSuffix()}>{suffix}</span>
          )}
        </div>
        {footer != null && (
          <div className={smallStatCardFooter()}>{footer}</div>
        )}
      </div>
    );
  },
);

SmallStatCard.displayName = 'SmallStatCard';
