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
  // @@S tpl-1 begin
  /** Brand slot above the card (mark, wordmark or a link wrapping both). Omitted when absent. */
  brand?: ReactNode;
  // @@S tpl-1 end
}

// @@T tpl-1 begin
export const AuthShell: ForwardRefExoticComponent<
  AuthShellProps & RefAttributes<HTMLDivElement>
> = forwardRef<HTMLDivElement, AuthShellProps>(
// @@T tpl-1 end
  ({ className, eyebrow, footer, width, brand, children, ...props }, ref) => (
    <div ref={ref} className={cn(authShell(), className)} {...props}>
      {/* @@S tpl-1 begin */}
      {brand != null && <div className={authBrand()}>{brand}</div>}
      {/* @@S tpl-1 end */}
      <section className={authCard({ width })}>
        {eyebrow != null && <div className={authEyebrow()}>{eyebrow}</div>}
        {children}
      </section>
      {footer != null && <div className={authFooter()}>{footer}</div>}
    </div>
  ),
);

AuthShell.displayName = 'AuthShell';
