import { forwardRef, type HTMLAttributes } from 'react';

import { cn } from '../../lib';

import { skeleton } from './Skeleton.variants';

export type SkeletonProps = HTMLAttributes<HTMLSpanElement>;

export const Skeleton: import('react').ForwardRefExoticComponent<
  SkeletonProps & import('react').RefAttributes<HTMLSpanElement>
> = forwardRef<HTMLSpanElement, SkeletonProps>(
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
