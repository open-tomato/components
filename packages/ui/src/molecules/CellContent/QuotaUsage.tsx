// @@T mol-1 begin
import { forwardRef, type HTMLAttributes, type ForwardRefExoticComponent, type PropsWithoutRef, type RefAttributes } from 'react';
// @@T mol-1 end

import { cn, formatNumber } from '../../lib';

// @@S mol-1 begin
import {
  quotaProgress,
  quotaProgressTone,
  quotaUsage,
  quotaUsageQuota,
} from './CellContent.variants';
// @@S mol-1 end
import { UsageBar } from './UsageBar';

// @@S mol-1 begin
export interface QuotaUsageProps
  extends HTMLAttributes<HTMLSpanElement> {
  /** Amount used — rendered bold, as the FULL number. */
  used: number;
  /** Quota — rendered greyed, human readable (`50k`). */
  quota: number;
  locale?: string;
}

/**
 * QuotaUsage — `8,240 / 50k`: bold full-number used over a greyed
 * human-readable quota (spec: "CellContent → quota-usage"; typical use: a
 * usage column in a table of items).
 */
// @@S mol-1 end
// @@T mol-1 begin
// @@S mol-1 begin
export const QuotaUsage: ForwardRefExoticComponent<PropsWithoutRef<QuotaUsageProps> & RefAttributes<HTMLSpanElement>> = forwardRef<HTMLSpanElement, QuotaUsageProps>(({ className, used, quota, locale, ...props }, ref) => (
// @@S mol-1 end
// @@T mol-1 end
  <span
    ref={ref}
    className={cn(quotaUsage(), className)}
    {...props}
  >
    {formatNumber(used, { short: false, locale })}
    <span className={quotaUsageQuota()}>
      {' / '}
      {formatNumber(quota, { short: true, locale })}
    </span>
  </span>
));

// @@S mol-1 begin
QuotaUsage.displayName = 'QuotaUsage';

export interface QuotaProgressProps extends QuotaUsageProps {
  /** Accessible description of the bar; defaults to `used of quota`. */
  label?: string;
}

/**
 * QuotaProgress — QuotaUsage over a mini progress bar whose tone
 * walks green → yellow → red with usage (spec: the component spec
 * "CellContent → quota-progress"). A table that colors the bar by item
 * STATUS instead (running green, failed red, else accent) diverges from
 * this; the spec keys the color to usage thresholds — the spec wins.
 */
// @@S mol-1 end
// @@T mol-1 begin
// @@S mol-1 begin
export const QuotaProgress: ForwardRefExoticComponent<PropsWithoutRef<QuotaProgressProps> & RefAttributes<HTMLDivElement>> = forwardRef<HTMLDivElement, QuotaProgressProps>(
// @@S mol-1 end
// @@T mol-1 end
  ({ className, used, quota, locale, label, ...props }, ref) => {
    const ratio = quota > 0
      ? used / quota
      : used > 0
        ? Number.POSITIVE_INFINITY
        : 0;
    return (
      // @@S mol-1 begin
      <div ref={ref} className={cn(quotaProgress(), className)} {...props}>
        <QuotaUsage used={used} quota={quota} locale={locale} />
        <UsageBar
          ratio={ratio}
          tone={quotaProgressTone(ratio)}
          size="sm"
          track
          label={label ?? `${used} of ${quota}`}
        />
      </div>
      // @@S mol-1 end
    );
  },
);

// @@S mol-1 begin
QuotaProgress.displayName = 'QuotaProgress';
// @@S mol-1 end
