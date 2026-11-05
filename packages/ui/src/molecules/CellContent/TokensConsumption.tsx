// @@T mol-1 begin
import { forwardRef, type HTMLAttributes, type ForwardRefExoticComponent, type PropsWithoutRef, type RefAttributes } from 'react';
// @@T mol-1 end

import { cn, formatNumber } from '../../lib';

import {
  tokensConsumption,
  tokensConsumptionQuota,
  tokensProgress,
  tokensProgressTone,
} from './CellContent.variants';
import { UsageBar } from './UsageBar';

export interface TokensConsumptionProps
  extends HTMLAttributes<HTMLSpanElement> {
  /** Tokens used — rendered bold, as the FULL number. */
  used: number;
  /** Tokens quota — rendered greyed, human readable (`50k`). */
  quota: number;
  locale?: string;
}

/**
 * TokensConsumption — `8,240 / 50k`: bold full-number used over a greyed
 * human-readable quota (spec: "CellContent →
 * tokens-consumption"; rendered reference: the Sessions table tokens
 * column in the original Sessions screen).
 */
// @@T mol-1 begin
export const TokensConsumption: ForwardRefExoticComponent<PropsWithoutRef<TokensConsumptionProps> & RefAttributes<HTMLSpanElement>> = forwardRef<HTMLSpanElement, TokensConsumptionProps>(({ className, used, quota, locale, ...props }, ref) => (
// @@T mol-1 end
  <span
    ref={ref}
    className={cn(tokensConsumption(), className)}
    {...props}
  >
    {formatNumber(used, { short: false, locale })}
    <span className={tokensConsumptionQuota()}>
      {' / '}
      {formatNumber(quota, { short: true, locale })}
    </span>
  </span>
));

TokensConsumption.displayName = 'TokensConsumption';

export interface TokensProgressProps extends TokensConsumptionProps {
  /** Accessible description of the bar; defaults to `used of quota tokens`. */
  label?: string;
}

/**
 * TokensProgress — TokensConsumption over a mini progress bar whose tone
 * walks green → yellow → red with usage (spec: the component spec
 * "CellContent → tokens-progress"). Spec-over-original divergence: the original
 * Sessions table colors the bar by session STATUS (running green, failed
 * red, else accent); the spec keys the color to consumption thresholds —
 * the spec wins.
 */
// @@T mol-1 begin
export const TokensProgress: ForwardRefExoticComponent<PropsWithoutRef<TokensProgressProps> & RefAttributes<HTMLDivElement>> = forwardRef<HTMLDivElement, TokensProgressProps>(
// @@T mol-1 end
  ({ className, used, quota, locale, label, ...props }, ref) => {
    const ratio = quota > 0
      ? used / quota
      : used > 0
        ? Number.POSITIVE_INFINITY
        : 0;
    return (
      <div ref={ref} className={cn(tokensProgress(), className)} {...props}>
        <TokensConsumption used={used} quota={quota} locale={locale} />
        <UsageBar
          ratio={ratio}
          tone={tokensProgressTone(ratio)}
          size="sm"
          track
          label={label ?? `${used} of ${quota} tokens`}
        />
      </div>
    );
  },
);

TokensProgress.displayName = 'TokensProgress';
