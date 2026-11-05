// @@T mol-1 begin
import { forwardRef, type HTMLAttributes, type ForwardRefExoticComponent, type PropsWithoutRef, type RefAttributes } from 'react';
// @@T mol-1 end

import { cn } from '../../lib';

import { cellDecoration } from './CellContent.variants';

export type CellDecorationProps = HTMLAttributes<HTMLDivElement>;

/**
 * CellDecoration — the avatar/icon/badge slot (spec: the component spec
 * "CellContent → Decoration").
 *
 * FIRST-COLUMN RULE (spec): a decoration is optional, but when present it
 * must be the row's FIRST column, so decorations gutter-align down the
 * table. The component itself is placement-agnostic — the rule is a table
 * configuration convention, enforced by convention rather than code.
 */
// @@T mol-1 begin
export const CellDecoration: ForwardRefExoticComponent<PropsWithoutRef<CellDecorationProps> & RefAttributes<HTMLDivElement>> = forwardRef<HTMLDivElement, CellDecorationProps>(
// @@T mol-1 end
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn(cellDecoration(), className)} {...props}>
      {children}
    </div>
  ),
);

CellDecoration.displayName = 'CellDecoration';
