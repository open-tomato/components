import { forwardRef, type HTMLAttributes } from 'react';

import { cn, initials } from '../../lib';

import { monogram, type MonogramVariants } from './Monogram.variants';

export interface MonogramProps
  extends HTMLAttributes<HTMLSpanElement>,
  MonogramVariants {
  /** Name the initials are derived from; also the accessible label. */
  name: string;
}

export const Monogram:
import('react').ForwardRefExoticComponent<MonogramProps & import('react').RefAttributes<HTMLSpanElement>> = forwardRef<HTMLSpanElement, MonogramProps>(
  ({ className, name, tone, size, ...props }, ref) => (
    <span
      ref={ref}
      role="img"
      aria-label={name}
      className={cn(monogram({ tone, size }), className)}
      {...props}
    >
      {initials(name)}
    </span>
  ),
);

Monogram.displayName = 'Monogram';
