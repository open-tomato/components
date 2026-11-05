import { forwardRef, type HTMLAttributes } from 'react';

import { touchable } from '../../atoms/Touchable/Touchable.variants';
import { cn } from '../../lib';
// Direct file import, not the '../Banner' barrel: cross-molecule barrel
// imports create a chunk cycle in the static Storybook build (React #130).
import { ToneIcon } from '../Banner/ToneIcon';

// @@V mol-2 begin
import {
  toast,
  toastBody,
  toastClose,
  toastIcon,
  type ToastVariants,
} from './Toast.variants';
// @@V mol-2 end

export interface ToastProps
  extends HTMLAttributes<HTMLDivElement>,
  ToastVariants {
  /** When set, renders the dismiss affordance. */
  onClose?: () => void;
}

// @@T mol-2 begin
export const Toast: import('react').ForwardRefExoticComponent<ToastProps & import('react').RefAttributes<HTMLDivElement>> = forwardRef<HTMLDivElement, ToastProps>(
// @@T mol-2 end
  ({ className, tone = 'success', floating, onClose, children, ...props }, ref) => (
    <div
      ref={ref}
      role="status"
      className={cn(toast({ floating }), className)}
      {...props}
    >
      <span className={toastIcon({ tone })}>
        <ToneIcon tone={tone ?? 'success'} size={16} />
      </span>
      {/* @@V mol-2 begin */}
      <span className={toastBody()}>{children}</span>
      {/* @@V mol-2 end */}
      {onClose != null && (
        <button
          type="button"
          aria-label="Dismiss"
          onClick={onClose}
          // @@V mol-2 begin
          className={cn(
            touchable({ inline: true, rounded: 'sm', noBrightness: false }),
            toastClose(),
          )}
          // @@V mol-2 end
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  ),
);

Toast.displayName = 'Toast';
