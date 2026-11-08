import type { ReactNode } from 'react';

import { cn } from '../../lib';
import { touchableVariants } from '../../particles/touchable';

import {
  overlayHeader,
  overlayHeaderClose,
  overlayHeaderEyebrow,
  overlayHeaderText,
  overlayHeaderTitle,
} from './Modal.variants';

/**
 * The header row Modal and Drawer share:
 * optional eyebrow, display title, and the close affordance.
 */
export interface OverlayHeaderProps {
  title: ReactNode;
  eyebrow?: ReactNode;
  onClose: () => void;
  /** id for the title element, for aria-labelledby wiring. */
  id?: string;
}

export const OverlayHeader: { (props: OverlayHeaderProps): import('react').JSX.Element; displayName?: string } = ({ title, eyebrow, onClose, id }: OverlayHeaderProps): import('react').JSX.Element => (
  <div className={overlayHeader()}>
    <div className={overlayHeaderText()}>
      {eyebrow != null && (
        <div className={overlayHeaderEyebrow()}>
          {eyebrow}
        </div>
      )}
      <h3
        id={id}
        className={overlayHeaderTitle()}
      >
        {title}
      </h3>
    </div>
    <button
      type="button"
      aria-label="Close"
      onClick={onClose}
      className={cn(
        touchableVariants({ inline: true, rounded: 'md', noBrightness: false }),
        overlayHeaderClose(),
      )}
    >
      <svg
        width="17"
        height="17"
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
  </div>
);

OverlayHeader.displayName = 'OverlayHeader';
