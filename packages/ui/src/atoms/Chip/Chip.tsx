// @@T ato-3 begin
import {
  forwardRef,
  type ForwardRefExoticComponent,
  type RefAttributes,
  type HTMLAttributes, type ReactNode } from 'react';
// @@T ato-3 end

import { cn } from '../../lib';
import { Touchable } from '../Touchable';

// @@V ato-3 begin
import { chip, chipIcon, chipRemove } from './Chip.variants';
// @@V ato-3 end

export interface ChipProps extends HTMLAttributes<HTMLSpanElement> {
  /** Optional leading icon (13px, accent-colored). */
  icon?: ReactNode;
  /** When set, renders the remove affordance and drives the tighter padding. */
  onRemove?: () => void;
}

// @@T ato-3 begin
export const Chip: ForwardRefExoticComponent<
  ChipProps & RefAttributes<HTMLSpanElement>
> = forwardRef<
// @@T ato-3 end
  HTMLSpanElement, ChipProps>(
  ({ className, icon, onRemove, children, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(chip({ removable: onRemove != null }), className)}
      {...props}
    >
      {/* @@V ato-3 begin */}
      {icon != null && <span className={chipIcon()}>{icon}</span>}
      {/* @@V ato-3 end */}
      {children}
      {onRemove != null && (
        <Touchable
          inline
          rounded="full"
          aria-label="Remove"
          onClick={onRemove}
          // @@V ato-3 begin
          className={chipRemove()}
          // @@V ato-3 end
        >
          <svg
            width="11"
            height="11"
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
        </Touchable>
      )}
    </span>
  ),
);

Chip.displayName = 'Chip';
