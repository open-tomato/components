import { forwardRef, type HTMLAttributes } from 'react';

import { cn, initials } from '../../lib';

// @@S ato-2 begin
import { monogram, type MonogramVariants } from './Monogram.variants';

export interface MonogramProps
  extends HTMLAttributes<HTMLSpanElement>,
  MonogramVariants {
  /** Name the initials are derived from; also the accessible label. */
  name: string;
}
// @@S ato-2 end

// @@T ato-2 begin
// @@S ato-2 begin
export const Monogram:
import('react').ForwardRefExoticComponent<MonogramProps & import('react').RefAttributes<HTMLSpanElement>> = forwardRef<HTMLSpanElement, MonogramProps>(
// @@S ato-2 end
// @@T ato-2 end
  ({ className, name, tone, size, ...props }, ref) => (
    <span
      ref={ref}
      role="img"
      aria-label={name}
      // @@S ato-2 begin
      className={cn(monogram({ tone, size }), className)}
      // @@S ato-2 end
      {...props}
    >
      {initials(name)}
    </span>
  ),
);

// @@S ato-2 begin
Monogram.displayName = 'Monogram';
// @@S ato-2 end
