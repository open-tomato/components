import type { ReactNode } from 'react';

import { cn } from '../../lib';

// @@V mol-2 begin
import { modalFooterStatus } from './Modal.variants';
// @@V mol-2 end

/**
 * The left-aligned status slot in a Modal footer (spec:
 * "ModalFooterStatus"). Driven by state changes in the
 * modal content (e.g. the selected tool type in the Tools flow — see
 * the tools-page spec), so it announces politely to assistive tech.
 *
 * Rendered by Modal when `footerStatus` is set; exported for composition in
 * custom footers, following the OverlayHeader internal-component pattern.
 */
export interface ModalFooterStatusProps {
  children: ReactNode;
  className?: string;
}

// @@T mol-2 begin
export const ModalFooterStatus: { (props: ModalFooterStatusProps): import('react').JSX.Element; displayName?: string } = ({
// @@T mol-2 end
  children,
  className,
// @@T mol-2 begin
}: ModalFooterStatusProps): import('react').JSX.Element => (
// @@T mol-2 end
  <span
    aria-live="polite"
    className={cn(
      // @@V mol-2 begin
      modalFooterStatus(),
      // @@V mol-2 end
      className,
    )}
  >
    {children}
  </span>
);

ModalFooterStatus.displayName = 'ModalFooterStatus';
