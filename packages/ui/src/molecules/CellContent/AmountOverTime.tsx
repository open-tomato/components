// @@T mol-1 begin
import { forwardRef, type HTMLAttributes, type ForwardRefExoticComponent, type PropsWithoutRef, type RefAttributes } from 'react';
// @@T mol-1 end

// Deep imports, not the Formatted barrel — see CellValue.tsx (the built
// storybook's lazy-init chunking can drop barrel member inits).
import { FormattedCurrency } from '../../atoms/Formatted/FormattedCurrency';
import { FormattedDuration } from '../../atoms/Formatted/FormattedDuration';
import { FormattedRelativeTime } from '../../atoms/Formatted/FormattedRelativeTime';
import { cn, type DateInput } from '../../lib';

// @@S mol-1 begin
import { amountOverTime, amountOverTimeMeta } from './CellContent.variants';
// @@S mol-1 end

// @@S mol-1 begin
export interface AmountOverTimeProps extends HTMLAttributes<HTMLDivElement> {
  /** Monetary amount. */
  amount: number;
  // @@S mol-1 end
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

// @@S mol-1 begin
/**
 * AmountOverTime — FormattedCurrency over a smaller greyed
 * `FormattedDuration · FormattedRelativeTime` line (spec:
 * "CellContent → amount-over-time"; typical use: an amount·time column —
 * `$0.42` over `7m 17s · 12:04`). The spec prose separates the two with
 * `-`; the design renders a middot, and the middot wins as the DS-wide
 * separator (same treatment as the entity-cell meta line).
 */
// @@S mol-1 end
// @@T mol-1 begin
// @@S mol-1 begin
export const AmountOverTime: ForwardRefExoticComponent<PropsWithoutRef<AmountOverTimeProps> & RefAttributes<HTMLDivElement>> = forwardRef<HTMLDivElement, AmountOverTimeProps>(
// @@S mol-1 end
// @@T mol-1 end
  (
    // @@S mol-1 begin
    { className, amount, currency = 'usd', seconds, date, now, locale, ...props },
    // @@S mol-1 end
    ref,
  ) => (
    // @@S mol-1 begin
    <div ref={ref} className={cn(amountOverTime(), className)} {...props}>
      <FormattedCurrency
        value={amount}
        // @@S mol-1 end
        currency={currency}
        locale={locale}
        size="sm"
      />
      {/* @@S mol-1 begin */}
      <span className={amountOverTimeMeta()}>
        {/* @@S mol-1 end */}
        <FormattedDuration seconds={seconds} />
        {' · '}
        <FormattedRelativeTime date={date} now={now} locale={locale} />
      </span>
    </div>
  ),
);

// @@S mol-1 begin
AmountOverTime.displayName = 'AmountOverTime';
// @@S mol-1 end
