import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

import { cn } from '../../lib';

import { card, cardHeader, type CardVariants } from './Card.variants';

export interface CardProps
  extends HTMLAttributes<HTMLDivElement>,
  CardVariants {
  /** Optional header content, rendered in a divided row above the body. */
  header?: ReactNode;
}

// @@T ato-1 begin
export const Card: import('react').ForwardRefExoticComponent<CardProps & import('react').RefAttributes<HTMLDivElement>> = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      noShadow,
      padding,
      density,
      bordered,
      rounded,
      header,
      children,
      ...props
    },
    ref,
  ) => (
    <div
      ref={ref}
      className={cn(
        card({ noShadow, padding, density, bordered, rounded }),
        className,
      )}
      {...props}
    >
      {header != null && (
        <div className={cardHeader({ density })}>{header}</div>
      )}
      {children}
    </div>
  ),
);
// @@T ato-1 end

Card.displayName = 'Card';
