import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';

import { cn } from '../../lib';
import { StrokeIcon } from '../../lib/icons';

import {
  optionCard,
  optionCardBody,
  optionCardDescription,
  optionCardIndicator,
  optionCardTitle,
  optionCardTitleRow,
  type OptionCardVariants,
} from './OptionCard.variants';

export interface OptionCardProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'title'>,
  OptionCardVariants {
  selected: boolean;
  /** Identity slot — Monogram, IconTile, …. */
  leading?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  /** Title-row companion (Badge slot). */
  meta?: ReactNode;
}

export const OptionCard: import('react').ForwardRefExoticComponent<
  OptionCardProps & import('react').RefAttributes<HTMLButtonElement>
> = forwardRef<HTMLButtonElement, OptionCardProps>(
  ({ className, selected, align, leading, title, description, meta, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      aria-pressed={selected}
      className={cn(optionCard({ selected, align }), className)}
      {...props}
    >
      {leading}
      <span className={optionCardBody()}>
        <span className={optionCardTitleRow()}>
          <span className={optionCardTitle({ align })}>{title}</span>
          {meta}
        </span>
        {description != null && (
          <span
            className={optionCardDescription({ align: align ?? 'center' })}
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
