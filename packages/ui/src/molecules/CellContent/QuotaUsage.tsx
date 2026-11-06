import { forwardRef, type HTMLAttributes, type ForwardRefExoticComponent, type PropsWithoutRef, type RefAttributes } from 'react';

import { cn, formatNumber } from '../../lib';

import {
  quotaProgress,
  quotaProgressTone,
  quotaUsage,
  quotaUsageQuota,
} from './CellContent.variants';
import { UsageBar } from './UsageBar';

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
export const QuotaUsage: ForwardRefExoticComponent<PropsWithoutRef<QuotaUsageProps> & RefAttributes<HTMLSpanElement>> = forwardRef<HTMLSpanElement, QuotaUsageProps>(({ className, used, quota, locale, ...props }, ref) => (
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
export const QuotaProgress: ForwardRefExoticComponent<PropsWithoutRef<QuotaProgressProps> & RefAttributes<HTMLDivElement>> = forwardRef<HTMLDivElement, QuotaProgressProps>(
  ({ className, used, quota, locale, label, ...props }, ref) => {
    const ratio = quota > 0
      ? used / quota
      : used > 0
        ? Number.POSITIVE_INFINITY
        : 0;
    return (
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
    );
  },
);

QuotaProgress.displayName = 'QuotaProgress';
