import {
  forwardRef,
  type ButtonHTMLAttributes,
  type ForwardRefExoticComponent,
  type ReactNode,
  type RefAttributes,
} from 'react';

import { cn } from '../../lib';
import { touchableVariants } from '../../particles/touchable';

import {
  navItem,
  navItemIcon,
  navItemLabel,
  type NavItemVariants,
} from './AppShell.variants';

export interface NavItemProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'>,
  NavItemVariants {
  /** Leading icon (18px in the original demo). */
  icon?: ReactNode;
}

/**
 * A rail entry. Collapse isn't ITS state — the shell owns it and passes it
 * down; the item just reads the flag: hide the label, center the icon,
 * surface a title tooltip (caller passes `title` when collapsed).
 */
export const NavItem: ForwardRefExoticComponent<
  NavItemProps & RefAttributes<HTMLButtonElement>
> = forwardRef<
  HTMLButtonElement, NavItemProps>(
  ({ className, active, collapsed, icon, children, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      aria-current={active
        ? 'page'
        : undefined}
      className={cn(
        touchableVariants({ rounded: 'md', noBrightness: false }),
        navItem({ active, collapsed }),
        className,
      )}
      {...props}
    >
      {icon != null && <span className={navItemIcon()}>{icon}</span>}
      {!collapsed && <span className={navItemLabel()}>{children}</span>}
    </button>
  ),
);

NavItem.displayName = 'NavItem';
