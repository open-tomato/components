import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';

import { cn } from '../../lib';
import { StrokeIcon } from '../../lib/icons';

// @@V mol-3 begin
import {
  optionCard,
  optionCardBody,
  optionCardDescription,
  optionCardIndicator,
  optionCardTitle,
  optionCardTitleRow,
  type OptionCardVariants,
} from './OptionCard.variants';
// @@V mol-3 end

export interface OptionCardProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'title'>,
  OptionCardVariants {
  selected: boolean;
  // @@S mol-3 begin
  /** Identity slot — an avatar mark, IconTile, …. */
  // @@S mol-3 end
  leading?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  /** Title-row companion (Badge slot). */
  meta?: ReactNode;
}

// @@T mol-3 begin
export const OptionCard: import('react').ForwardRefExoticComponent<
  OptionCardProps & import('react').RefAttributes<HTMLButtonElement>
> = forwardRef<HTMLButtonElement, OptionCardProps>(
// @@T mol-3 end
  ({ className, selected, align, leading, title, description, meta, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      aria-pressed={selected}
      className={cn(optionCard({ selected, align }), className)}
      {...props}
    >
      {leading}
      {/* @@V mol-3 begin */}
      <span className={optionCardBody()}>
        <span className={optionCardTitleRow()}>
          {/* @@V mol-3 end */}
          <span className={optionCardTitle({ align })}>{title}</span>
          {meta}
        </span>
        {description != null && (
          <span
            // @@V mol-3 begin
            className={optionCardDescription({ align: align ?? 'center' })}
            // @@V mol-3 end
          >
            {description}
          </span>
        )}
      </span>
      <span className={optionCardIndicator({ selected, align })}>
        {selected && <StrokeIcon name="check" size={align === 'start'
          ? 11
          : 12} />}
      </span>
    </button>
  ),
);

OptionCard.displayName = 'OptionCard';
