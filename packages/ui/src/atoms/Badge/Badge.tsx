import { forwardRef, type HTMLAttributes } from 'react';

import { cn } from '../../lib';

// @@V ato-1 begin
import { badge, badgeDot, type BadgeVariants } from './Badge.variants';
// @@V ato-1 end

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
  BadgeVariants {
  /** Leading 6px dot in the tone's color. */
  dot?: boolean;
}

// @@T ato-1 begin
export const Badge: import('react').ForwardRefExoticComponent<BadgeProps & import('react').RefAttributes<HTMLSpanElement>> = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, tone, size, dot = false, children, ...props }, ref) => (
    <span ref={ref} className={cn(badge({ tone, size }), className)} {...props}>
      {/* @@V ato-1 begin */}
      {dot && <span className={badgeDot()} aria-hidden />}
      {/* @@V ato-1 end */}
      {children}
    </span>
  ),
);
// @@T ato-1 end

Badge.displayName = 'Badge';
