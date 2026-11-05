// @@T ato-3 begin
import {
  forwardRef,
  type ForwardRefExoticComponent,
  type HTMLAttributes,
  type RefAttributes,
} from 'react';
// @@T ato-3 end

import { cn } from '../../lib';

import { shell, type ShellVariants } from './Shell.variants';

export interface ShellProps
  extends HTMLAttributes<HTMLDivElement>,
  ShellVariants {}

// @@T ato-3 begin
export const Shell: ForwardRefExoticComponent<
  ShellProps & RefAttributes<HTMLDivElement>
> = forwardRef<
// @@T ato-3 end
  HTMLDivElement, ShellProps>(
  ({ className, padding, tone, bordered, rounded, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(shell({ padding, tone, bordered, rounded }), className)}
      {...props}
    />
  ),
);

Shell.displayName = 'Shell';
