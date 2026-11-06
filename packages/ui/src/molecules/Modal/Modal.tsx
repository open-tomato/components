import { useId, type ReactNode } from 'react';

import { Overlay, type OverlayDismiss, type OverlayVariants } from '../../atoms/Overlay';
import { cn } from '../../lib';

import {
  modalBody,
  modalFooter,
  modalPanel,
  type ModalPanelVariants,
} from './Modal.variants';
import { ModalFooterStatus } from './ModalFooterStatus';
import { OverlayHeader } from './OverlayHeader';

export interface ModalProps extends ModalPanelVariants {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  eyebrow?: ReactNode;
  footer?: ReactNode;
  /**
   * Status string slot, footer-left (spec: "ModalFooterStatus") — driven
   * by state changes in the modal content. Renders the footer row even
   * without `footer` actions.
   */
  footerStatus?: ReactNode;
  dismiss?: OverlayDismiss;
  backdrop?: OverlayVariants['backdrop'];
  className?: string;
  children: ReactNode;
}

export const Modal: { (props: ModalProps): import('react').JSX.Element; displayName?: string } = ({
  open,
  onClose,
  title,
  eyebrow,
  footer,
  footerStatus,
  size,
  dismiss,
  backdrop,
  className,
  children,
}: ModalProps): import('react').JSX.Element => {
  const titleId = useId();
  return (
    <Overlay
      open={open}
      onClose={onClose}
      position="center"
      dismiss={dismiss}
      backdrop={backdrop}
    >
      <div
        aria-labelledby={title != null
          ? titleId
          : undefined}
        className={cn(modalPanel({ size }), className)}
      >
        {title != null && (
          <OverlayHeader
            id={titleId}
            title={title}
            eyebrow={eyebrow}
            onClose={onClose}
          />
        )}
        <div className={modalBody()}>
          {children}
        </div>
        {(footer != null || footerStatus != null) && (
          <div className={modalFooter()}>
            {footerStatus != null && (
              <ModalFooterStatus>{footerStatus}</ModalFooterStatus>
            )}
            {footer}
          </div>
        )}
      </div>
    </Overlay>
  );
};

Modal.displayName = 'Modal';
