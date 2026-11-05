import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';

import { cn } from '../../lib';

import { iconButton, type IconButtonVariants } from './IconButton.variants';

export interface IconButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'children'>,
  IconButtonVariants {
  icon: ReactNode;
  /** Accessible name — required, the button has no text. */
  label: string;
}

// @@T ato-1 begin
export const IconButton: import('react').ForwardRefExoticComponent<IconButtonProps & import('react').RefAttributes<HTMLButtonElement>> = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, icon, label, active, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      aria-label={label}
      className={cn(iconButton({ active }), className)}
      {...props}
    >
      {icon}
    </button>
  ),
);
// @@T ato-1 end

IconButton.displayName = 'IconButton';
