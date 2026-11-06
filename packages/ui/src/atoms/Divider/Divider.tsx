import {
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
  type ForwardRefExoticComponent,
  type RefAttributes,
} from 'react';

import { cn } from '../../lib';

import { divider, dividerLabel, dividerPlain, dividerRule } from './Divider.variants';

export interface DividerProps extends HTMLAttributes<HTMLDivElement> {
  /** Mono label rendered mid-rule; omit for a plain rule. */
  label?: ReactNode;
}

export const Divider: ForwardRefExoticComponent<
  DividerProps & RefAttributes<HTMLDivElement>
> = forwardRef<
  HTMLDivElement, DividerProps>(
  ({ className, label, ...props }, ref) => label == null
    ? (
      <div
        ref={ref}
        role="separator"
        className={cn(dividerPlain(), className)}
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
