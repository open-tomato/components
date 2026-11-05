// @@T ato-3 begin
import {
  forwardRef,
  type HTMLAttributes,
  type ForwardRefExoticComponent,
  type RefAttributes,
} from 'react';
// @@T ato-3 end

import { cn, formatDuration, type DateInput } from '../../lib';

interface SecondsSource {
  /** Total seconds. */
  seconds: number;
  from?: never;
  to?: never;
}

interface RangeSource {
  seconds?: never;
  from: DateInput;
  to: DateInput;
}

export type FormattedDurationProps = HTMLAttributes<HTMLSpanElement> &
  (SecondsSource | RangeSource);

/**
 * FormattedDuration — `1h 3m 10s` from a total of seconds or a date range
 * (spec-defined). Zero units are omitted; a zero duration
 * reads `0s`.
 */
// @@T ato-3 begin
export const FormattedDuration: ForwardRefExoticComponent<
  FormattedDurationProps & RefAttributes<HTMLSpanElement>
> = forwardRef<
// @@T ato-3 end
  
  HTMLSpanElement,
  FormattedDurationProps
>(({ className, seconds, from, to, ...props }, ref) => (
  <span ref={ref} className={cn(className)} {...props}>
    {formatDuration(seconds != null
      ? seconds
      : { from: from as DateInput, to: to as DateInput })}
  </span>
));

FormattedDuration.displayName = 'FormattedDuration';
