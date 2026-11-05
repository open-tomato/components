import type { ReactNode } from 'react';

import { touchable } from '../../atoms/Touchable/Touchable.variants';
import { cn } from '../../lib';

// @@V mol-2 begin
import {
  overlayHeader,
  overlayHeaderClose,
  overlayHeaderEyebrow,
  overlayHeaderText,
  overlayHeaderTitle,
} from './Modal.variants';
// @@V mol-2 end

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

// @@T mol-2 begin
export const OverlayHeader: { (props: OverlayHeaderProps): import('react').JSX.Element; displayName?: string } = ({ title, eyebrow, onClose, id }: OverlayHeaderProps): import('react').JSX.Element => (
// @@T mol-2 end
  // @@V mol-2 begin
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
    {/* @@V mol-2 end */}
    <button
      type="button"
      aria-label="Close"
      onClick={onClose}
      className={cn(
        touchable({ inline: true, rounded: 'md', noBrightness: false }),
        // @@V mol-2 begin
        overlayHeaderClose(),
        // @@V mol-2 end
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
