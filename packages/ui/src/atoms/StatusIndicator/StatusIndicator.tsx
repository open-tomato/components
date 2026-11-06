import {
  forwardRef,
  type ForwardRefExoticComponent,
  type HTMLAttributes,
  type RefAttributes,
} from 'react';

import { cn } from '../../lib';

import {
  statusIndicator,
  type StatusIndicatorVariants,
} from './StatusIndicator.variants';

export interface StatusIndicatorProps
  extends HTMLAttributes<HTMLSpanElement>,
  StatusIndicatorVariants {
  /**
   * Accessible status text (e.g. "running"). Without it the dot is
   * decorative (aria-hidden) — pair it with visible text instead.
   */
  label?: string;
}

/**
 * StatusIndicator — a small circle / rounded-square inline status dot.
 * Spec-driven; no design artboard. `pulse` marks live
 * activity (a running job, a streaming process).
 */
export const StatusIndicator: ForwardRefExoticComponent<
  StatusIndicatorProps & RefAttributes<HTMLSpanElement>
> = forwardRef<
  HTMLSpanElement, StatusIndicatorProps>(
  ({ className, tone, shape, size, pulse, label, ...props }, ref) => (
    <span
      ref={ref}
      role={label != null
        ? 'status'
        : undefined}
      aria-label={label}
      aria-hidden={label == null || undefined}
      className={cn(statusIndicator({ tone, shape, size, pulse }), className)}
      {...props}
    />
  ),
);

StatusIndicator.displayName = 'StatusIndicator';
