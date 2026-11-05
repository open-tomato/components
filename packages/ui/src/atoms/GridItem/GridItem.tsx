// @@T ato-3 begin
import {
  forwardRef,
  type ForwardRefExoticComponent,
  type HTMLAttributes,
  type RefAttributes,
} from 'react';
// @@T ato-3 end

import { cn } from '../../lib';

import { gridItem, type GridItemVariants } from './GridItem.variants';

export interface GridItemProps
  extends HTMLAttributes<HTMLDivElement>,
  GridItemVariants {}

// @@T ato-3 begin
export const GridItem: ForwardRefExoticComponent<
  GridItemProps & RefAttributes<HTMLDivElement>
> = forwardRef<
// @@T ato-3 end
  HTMLDivElement, GridItemProps>(
  ({ className, span, align, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(gridItem({ span, align }), className)}
      {...props}
    />
  ),
);

GridItem.displayName = 'GridItem';
