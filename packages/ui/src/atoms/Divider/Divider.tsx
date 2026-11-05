// @@T ato-3 begin
import {
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
  type ForwardRefExoticComponent,
  type RefAttributes,
} from 'react';
// @@T ato-3 end

import { cn } from '../../lib';

import { divider, dividerLabel, dividerRule } from './Divider.variants';

export interface DividerProps extends HTMLAttributes<HTMLDivElement> {
  /** Mono label rendered mid-rule; omit for a plain rule. */
  label?: ReactNode;
}

// @@T ato-3 begin
export const Divider: ForwardRefExoticComponent<
  DividerProps & RefAttributes<HTMLDivElement>
> = forwardRef<
// @@T ato-3 end
  HTMLDivElement, DividerProps>(
  ({ className, label, ...props }, ref) => label == null
    ? (
      <div
        ref={ref}
        role="separator"
        className={cn('h-px w-full bg-border-soft', className)}
        {...props}
      />
    )
    : (
      <div ref={ref} role="separator" className={cn(divider(), className)} {...props}>
        <span className={dividerRule()} />
        <span className={dividerLabel()}>{label}</span>
        <span className={dividerRule()} />
      </div>
    ),
);

Divider.displayName = 'Divider';
