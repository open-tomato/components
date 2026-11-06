import { forwardRef, type HTMLAttributes, type ForwardRefExoticComponent, type PropsWithoutRef, type RefAttributes } from 'react';

// Deep imports, not the Formatted barrel — see CellValue.tsx (the built
// storybook's lazy-init chunking can drop barrel member inits).
import { FormattedCurrency } from '../../atoms/Formatted/FormattedCurrency';
import { FormattedDuration } from '../../atoms/Formatted/FormattedDuration';
import { FormattedRelativeTime } from '../../atoms/Formatted/FormattedRelativeTime';
import { cn, type DateInput } from '../../lib';

import { amountOverTime, amountOverTimeMeta } from './CellContent.variants';

export interface AmountOverTimeProps extends HTMLAttributes<HTMLDivElement> {
  /** Monetary amount. */
  amount: number;
  /** ISO 4217 code (defaults to USD). */
  currency?: string;
  /** Elapsed run time, in seconds. */
  seconds: number;
  /** When the run happened (drives the relative-time part). */
  date: DateInput;
  /**
   * Reference "now" for the relative ladder. Stories and tests MUST pass
   * a fixed date to stay deterministic.
   */
  now?: DateInput;
  locale?: string;
}

/**
 * AmountOverTime — FormattedCurrency over a smaller greyed
 * `FormattedDuration · FormattedRelativeTime` line (spec:
 * "CellContent → amount-over-time"; typical use: an amount·time column —
 * `$0.42` over `7m 17s · 12:04`). The spec prose separates the two with
 * `-`; the design renders a middot, and the middot wins as the DS-wide
 * separator (same treatment as the entity-cell meta line).
 */
export const AmountOverTime: ForwardRefExoticComponent<PropsWithoutRef<AmountOverTimeProps> & RefAttributes<HTMLDivElement>> = forwardRef<HTMLDivElement, AmountOverTimeProps>(
  (
    { className, amount, currency = 'usd', seconds, date, now, locale, ...props },
    ref,
  ) => (
    <div ref={ref} className={cn(amountOverTime(), className)} {...props}>
      <FormattedCurrency
        value={amount}
        currency={currency}
        locale={locale}
        size="sm"
      />
      <span className={amountOverTimeMeta()}>
        <FormattedDuration seconds={seconds} />
        {' · '}
        <FormattedRelativeTime date={date} now={now} locale={locale} />
      </span>
    </div>
  ),
);

AmountOverTime.displayName = 'AmountOverTime';
