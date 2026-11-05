// @@T mol-1 begin
import { forwardRef, type HTMLAttributes, type ForwardRefExoticComponent, type PropsWithoutRef, type RefAttributes } from 'react';
// @@T mol-1 end

// Deep import, not the Formatted barrel: the storybook production build's
// lazy-init chunking drops the barrel init that defines HumanReadableValue
// (renders undefined → React #130); the direct module import keeps the
// init graph honest. Same pattern as Formatted.stories.tsx.
import { HumanReadableValue } from '../../atoms/Formatted/HumanReadableValue';
import { cn } from '../../lib';

import { cellValue, type CellValueVariants } from './CellContent.variants';

export interface CellValueProps
  extends HTMLAttributes<HTMLDivElement>,
  CellValueVariants {
  /**
   * Numeric value rendered through HumanReadableValue (accentuated value,
   * small greyed unit). Omit it to render pre-formatted `children`
   * (FormattedCurrency, FormattedDate, …) instead.
   */
  value?: number;
  // @@S mol-1 begin
  /** Unit suffix (`units`, `runs`, …) — small, greyed, to the right. */
  // @@S mol-1 end
  unit?: string;
  /** Compact notation (`12.5K`). Default true — "human readable". */
  short?: boolean;
  precision?: number;
  locale?: string;
}

/**
 * CellValue — the Value / Value-with-unit cell content (spec:
 * "CellContent"). Numeric cells right-align by
 * default (`align="end"`); pass pre-formatted children (currency, date,
 * time) for the plain Value form.
 */
// @@T mol-1 begin
export const CellValue: ForwardRefExoticComponent<PropsWithoutRef<CellValueProps> & RefAttributes<HTMLDivElement>> = forwardRef<HTMLDivElement, CellValueProps>(
// @@T mol-1 end
  (
    {
      className,
      align,
      value,
      unit,
      short,
      precision,
      locale,
      children,
      ...props
    },
    ref,
  ) => (
    <div ref={ref} className={cn(cellValue({ align }), className)} {...props}>
      {value != null
        ? (
          <HumanReadableValue
            value={value}
            unit={unit}
            short={short}
            precision={precision}
            locale={locale}
            size="sm"
          />
        )
        : children}
    </div>
  ),
);

CellValue.displayName = 'CellValue';
