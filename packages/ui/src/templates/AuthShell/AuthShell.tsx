import {
  forwardRef,
  type ForwardRefExoticComponent,
  type HTMLAttributes,
  type ReactNode,
  type RefAttributes,
} from 'react';

import { cn } from '../../lib';

import {
  authBrand,
  authCard,
  authEyebrow,
  authFooter,
  authShell,
  type AuthCardVariants,
} from './AuthShell.variants';

export interface AuthShellProps
  extends HTMLAttributes<HTMLDivElement>,
  AuthCardVariants {
  /** Mono kicker as the card's first line ("welcome back", "step 1 of 2"). */
  eyebrow?: string;
  /** Line below the card (sign-up/sign-in cross-links). */
  footer?: ReactNode;
  /** Brand slot above the card (mark, wordmark or a link wrapping both). Omitted when absent. */
  brand?: ReactNode;
}

export const AuthShell: ForwardRefExoticComponent<
  AuthShellProps & RefAttributes<HTMLDivElement>
> = forwardRef<HTMLDivElement, AuthShellProps>(
  ({ className, eyebrow, footer, width, brand, children, ...props }, ref) => (
    <div ref={ref} className={cn(authShell(), className)} {...props}>
      {brand != null && <div className={authBrand()}>{brand}</div>}
      <section className={authCard({ width })}>
        {eyebrow != null && <div className={authEyebrow()}>{eyebrow}</div>}
        {children}
      </section>
      {footer != null && <div className={authFooter()}>{footer}</div>}
    </div>
  ),
);

AuthShell.displayName = 'AuthShell';
