import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

import { touchable } from '../../atoms/Touchable/Touchable.variants';
import { cn } from '../../lib';

// @@V mol-2 begin
import {
  banner,
  bannerAction,
  bannerBody,
  bannerContent,
  bannerDismiss,
  bannerIcon,
  bannerTitle,
  type BannerVariants,
} from './Banner.variants';
// @@V mol-2 end
import { ToneIcon } from './ToneIcon';

export interface BannerProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'title'>,
  BannerVariants {
  title?: ReactNode;
  /** Optional tone-colored action (label + onClick). */
  action?: { label: string; onClick: () => void };
  /** When set, renders the dismiss affordance. */
  onClose?: () => void;
}

// @@T mol-2 begin
export const Banner: import('react').ForwardRefExoticComponent<BannerProps & import('react').RefAttributes<HTMLDivElement>> = forwardRef<
// @@T mol-2 end
  HTMLDivElement, BannerProps>(
  ({ className, tone = 'info', title, action, onClose, children, ...props }, ref) => (
    <div ref={ref} className={cn(banner({ tone }), className)} {...props}>
      <span className={bannerIcon({ tone })}>
        <ToneIcon tone={tone ?? 'info'} />
      </span>
      {/* @@V mol-2 begin */}
      <div className={bannerContent()}>
        {title != null && (
          <div className={bannerTitle()}>{title}</div>
        )}
        <div className={bannerBody()}>{children}</div>
      </div>
      {/* @@V mol-2 end */}
      {action != null && (
        <button
          type="button"
          onClick={action.onClick}
          className={cn(
            touchable({ inline: true, rounded: 'md', noBrightness: false }),
            bannerAction({ tone }),
          )}
        >
          {action.label}
        </button>
      )}
      {onClose != null && (
        <button
          type="button"
          aria-label="Dismiss"
          onClick={onClose}
          className={cn(
            touchable({ inline: true, rounded: 'sm', noBrightness: false }),
            // @@V mol-2 begin
            bannerDismiss(),
            // @@V mol-2 end
          )}
        >
          <svg
            width="15"
            height="15"
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

Banner.displayName = 'Banner';
