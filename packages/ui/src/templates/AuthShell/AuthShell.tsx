import {
// @@T tpl-1 begin
  forwardRef,
  type ForwardRefExoticComponent,
  type HTMLAttributes,
  type ReactNode,
  type RefAttributes,
// @@T tpl-1 end
} from 'react';

import { cn } from '../../lib';

import {
  authCard,
  authEyebrow,
  authFooter,
  authShell,
  type AuthCardVariants,
} from './AuthShell.variants';
import { BrandLockup } from './BrandLockup';

export interface AuthShellProps
  extends HTMLAttributes<HTMLDivElement>,
  AuthCardVariants {
  /** Mono kicker as the card's first line ("welcome back", "step 1 of 2"). */
  eyebrow?: string;
  /** Line below the card (sign-up/sign-in cross-links). */
  footer?: ReactNode;
  /** Brand lockup link target. */
  brandHref?: string;
}

// @@T tpl-1 begin
export const AuthShell: ForwardRefExoticComponent<
  AuthShellProps & RefAttributes<HTMLDivElement>
> = forwardRef<HTMLDivElement, AuthShellProps>(
// @@T tpl-1 end
  ({ className, eyebrow, footer, width, brandHref, children, ...props }, ref) => (
    <div ref={ref} className={cn(authShell(), className)} {...props}>
      <BrandLockup href={brandHref} />
      <section className={authCard({ width })}>
        {eyebrow != null && <div className={authEyebrow()}>{eyebrow}</div>}
        {children}
      </section>
      {footer != null && <div className={authFooter()}>{footer}</div>}
    </div>
  ),
);

AuthShell.displayName = 'AuthShell';
