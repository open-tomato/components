// @@T mol-1 begin
import { forwardRef, type HTMLAttributes, type ReactNode, type ForwardRefExoticComponent, type PropsWithoutRef, type RefAttributes } from 'react';
// @@T mol-1 end

import { cn } from '../../lib';

import {
  cellDoubleLine,
  cellDoubleLineSubtitle,
  cellDoubleLineTitle,
} from './CellContent.variants';

export interface CellDoubleLineProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Top line — short, accentuated. */
  title: ReactNode;
  /** Bottom line — longer, greyed, truncating. */
  subtitle?: ReactNode;
}

/**
 * CellDoubleLine — name over a truncating subtitle (spec:
 * "CellContent → DoubleLine text"). Truncation is
 * per-line CSS ellipsis; the tooltip for clipped text belongs to the
 * parent cell (see the kit's tooltip-ownership decision in
 * CellContent.variants.ts).
 */
// @@T mol-1 begin
export const CellDoubleLine: ForwardRefExoticComponent<PropsWithoutRef<CellDoubleLineProps> & RefAttributes<HTMLDivElement>> = forwardRef<HTMLDivElement, CellDoubleLineProps>(
// @@T mol-1 end
  ({ className, title, subtitle, ...props }, ref) => (
    <div ref={ref} className={cn(cellDoubleLine(), className)} {...props}>
      <span className={cellDoubleLineTitle()}>{title}</span>
      {subtitle != null && (
        <span className={cellDoubleLineSubtitle()}>{subtitle}</span>
      )}
    </div>
  ),
);

CellDoubleLine.displayName = 'CellDoubleLine';
