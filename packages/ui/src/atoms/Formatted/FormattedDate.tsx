// @@T ato-3 begin
import {
  forwardRef,
  type TimeHTMLAttributes,
  type ForwardRefExoticComponent,
  type RefAttributes,
} from 'react';
// @@T ato-3 end

import { cn, formatDate, toDate, type DateInput } from '../../lib';

export interface FormattedDateProps
  extends TimeHTMLAttributes<HTMLTimeElement> {
  date: DateInput;
  /**
   * Explicit locale (the Settings locale). Spec priority: this prop →
   * browser locale → system locale (resolveLocale in src/lib/format).
   */
  locale?: string;
  dateStyle?: Intl.DateTimeFormatOptions['dateStyle'];
}

/**
 * FormattedDate — a locale-formatted calendar date in a semantic `<time>`
 * element (spec-defined).
 */
// @@T ato-3 begin
export const FormattedDate: ForwardRefExoticComponent<
  FormattedDateProps & RefAttributes<HTMLTimeElement>
> = forwardRef<
// @@T ato-3 end
  HTMLTimeElement, FormattedDateProps>(
  ({ className, date, locale, dateStyle, ...props }, ref) => (
    <time
      ref={ref}
      dateTime={toDate(date).toISOString()}
      className={cn(className)}
      {...props}
    >
      {formatDate(date, { locale, dateStyle })}
    </time>
  ),
);

FormattedDate.displayName = 'FormattedDate';
