import { forwardRef, type HTMLAttributes } from 'react';

import { cn } from '../../lib';

import { skeleton } from './Skeleton.variants';

export type SkeletonProps = HTMLAttributes<HTMLSpanElement>;

// @@T mol-3 begin
export const Skeleton: import('react').ForwardRefExoticComponent<
  SkeletonProps & import('react').RefAttributes<HTMLSpanElement>
> = forwardRef<HTMLSpanElement, SkeletonProps>(
// @@T mol-3 end
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      aria-hidden
      className={cn(skeleton(), className)}
      {...props}
    />
  ),
);

Skeleton.displayName = 'Skeleton';
