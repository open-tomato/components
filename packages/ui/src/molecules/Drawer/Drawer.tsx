import {
  useId,
  type JSX,
  type ReactNode,
} from 'react';

import { Overlay, type OverlayDismiss, type OverlayVariants } from '../../atoms/Overlay';
import { cn } from '../../lib';
// Direct file import, not the '../Modal' barrel: cross-molecule barrel
// imports create a chunk cycle in the static Storybook build (React #130).
import { OverlayHeader } from '../Modal/OverlayHeader';

import {
  drawerBody,
  drawerFooter,
  drawerPanel,
  type DrawerPanelVariants,
} from './Drawer.variants';

export interface DrawerProps extends DrawerPanelVariants {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  eyebrow?: ReactNode;
  footer?: ReactNode;
  dismiss?: OverlayDismiss;
  backdrop?: OverlayVariants['backdrop'];
  className?: string;
  children: ReactNode;
}

export const Drawer: { (props: DrawerProps): JSX.Element; displayName: string } = ({
  open,
  onClose,
  title,
  eyebrow,
  footer,
  side = 'right',
  size,
  dismiss,
  backdrop,
  className,
  children,
}: DrawerProps) => {
  const titleId = useId();
  return (
    <Overlay
      open={open}
      onClose={onClose}
      position={side}
      dismiss={dismiss}
      backdrop={backdrop}
    >
      <div
        aria-labelledby={title != null
          ? titleId
          : undefined}
        className={cn(drawerPanel({ side, size }), className)}
      >
        {title != null && (
          <OverlayHeader
            id={titleId}
            title={title}
            eyebrow={eyebrow}
            onClose={onClose}
          />
        )}
        <div className={drawerBody()}>
          {children}
        </div>
        {footer != null && (
          <div className={drawerFooter()}>
            {footer}
          </div>
        )}
      </div>
    </Overlay>
  );
};

Drawer.displayName = 'Drawer';
