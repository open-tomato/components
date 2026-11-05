import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

import { TomatoMark } from '../../internal/TomatoMark';
import { cn } from '../../lib';

// @@V ato-1 begin
import {
  emptyState,
  emptyStateAction,
  emptyStateDescription,
  emptyStateMark,
  emptyStateTitle,
  type EmptyStateVariants,
} from './EmptyState.variants';
// @@V ato-1 end

export interface EmptyStateProps
  extends HTMLAttributes<HTMLDivElement>,
  EmptyStateVariants {
  title: string;
  description?: string;
  /** Optional call-to-action slot (typically a `<Button>`). */
  action?: ReactNode;
}

// @@T ato-1 begin
export const EmptyState: import('react').ForwardRefExoticComponent<EmptyStateProps & import('react').RefAttributes<HTMLDivElement>> = forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ className, size, align, title, description, action, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(emptyState({ size, align }), className)}
      {...props}
    >
      {/* @@V ato-1 begin */}
      <span className={emptyStateMark()}>
        <TomatoMark />
      </span>
      <span className={emptyStateTitle()}>
        {title}
      </span>
      {description != null && (
        <span className={emptyStateDescription()}>
          {description}
        </span>
      )}
      {action != null && <span className={emptyStateAction()}>{action}</span>}
      {/* @@V ato-1 end */}
    </div>
  ),
);
// @@T ato-1 end

EmptyState.displayName = 'EmptyState';
