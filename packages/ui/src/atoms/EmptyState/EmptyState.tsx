import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

import { cn } from '../../lib';

import {
  emptyState,
  emptyStateAction,
  emptyStateDescription,
  emptyStateMark,
  emptyStateTitle,
  type EmptyStateVariants,
} from './EmptyState.variants';

export interface EmptyStateProps
  extends HTMLAttributes<HTMLDivElement>,
  EmptyStateVariants {
  title: string;
  description?: string;
  /** Optional illustration slot, shown above the title inside a tinted circle. */
  illustration?: ReactNode;
  /** Optional call-to-action slot (typically a `<Button>`). */
  action?: ReactNode;
}

export const EmptyState: import('react').ForwardRefExoticComponent<EmptyStateProps & import('react').RefAttributes<HTMLDivElement>> = forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ className, size, align, title, description, action, illustration, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(emptyState({ size, align }), className)}
      {...props}
    >
      {illustration != null && (
        <span className={emptyStateMark()}>
          {illustration}
        </span>
      )}
      <span className={emptyStateTitle()}>
        {title}
      </span>
      {description != null && (
        <span className={emptyStateDescription()}>
          {description}
        </span>
      )}
      {action != null && <span className={emptyStateAction()}>{action}</span>}
    </div>
  ),
);

EmptyState.displayName = 'EmptyState';
