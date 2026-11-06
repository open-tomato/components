import {
  forwardRef,
  type ForwardRefExoticComponent,
  type HTMLAttributes,
  type RefAttributes,
} from 'react';

import { cn } from '../../lib';

import { shell, type ShellVariants } from './Shell.variants';

export interface ShellProps
  extends HTMLAttributes<HTMLDivElement>,
  ShellVariants {}

export const Shell: ForwardRefExoticComponent<
  ShellProps & RefAttributes<HTMLDivElement>
> = forwardRef<
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
