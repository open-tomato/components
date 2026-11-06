import {
  forwardRef,
  type HTMLAttributes,
  type ForwardRefExoticComponent,
  type RefAttributes,
} from 'react';

import { cn, formatNumber } from '../../lib';

import {
  formattedUnit,
  formattedValue,
  type FormattedSizeVariants,
} from './Formatted.variants';

export interface HumanReadableValueProps
  extends HTMLAttributes<HTMLSpanElement>,
  FormattedSizeVariants {
  value: number;
  /** Unit suffix (`units`, `runs`, …) — small, greyed, to the right. */
  unit?: string;
  /** Compact notation (`12.5K`). Default true — "human readable". */
  short?: boolean;
  /** Max fraction digits (defaults: 1 when short, 0 otherwise). */
  precision?: number;
  locale?: string;
}

/**
 * HumanReadableValue — an accentuated numeric value with a small greyed-out
 * unit suffix (spec: "Formatted / Human readable
 * values").
 */
export const HumanReadableValue: ForwardRefExoticComponent<
  HumanReadableValueProps & RefAttributes<HTMLSpanElement>
> = forwardRef<
  
  HTMLSpanElement,
  HumanReadableValueProps
>(
  (
    { className, value, unit, short = true, precision, locale, size, ...props },
    ref,
  ) => (
    <span
      ref={ref}
      className={cn(formattedValue({ size }), className)}
      {...props}
    >
      {formatNumber(value, { short, precision, locale })}
      {unit != null && <span className={formattedUnit({ size })}>{unit}</span>}
    </span>
  ),
);

HumanReadableValue.displayName = 'HumanReadableValue';
