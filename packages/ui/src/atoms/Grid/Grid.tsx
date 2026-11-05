import { forwardRef, type HTMLAttributes } from 'react';

import { cn } from '../../lib';

import { grid, type GridVariants } from './Grid.variants';

export interface GridProps
  extends HTMLAttributes<HTMLDivElement>,
  GridVariants {}

// @@T ato-2 begin
export const Grid:
import('react').ForwardRefExoticComponent<GridProps & import('react').RefAttributes<HTMLDivElement>> = forwardRef<HTMLDivElement, GridProps>(
// @@T ato-2 end
  ({ className, cols, gap, ...props }, ref) => (
    <div ref={ref} className={cn(grid({ cols, gap }), className)} {...props} />
  ),
);

Grid.displayName = 'Grid';
