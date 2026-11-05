// @@T tpl-1 begin
import {
  forwardRef,
  type ButtonHTMLAttributes,
  type ForwardRefExoticComponent,
  type ReactNode,
  type RefAttributes,
} from 'react';
// @@T tpl-1 end

import { touchable } from '../../atoms/Touchable/Touchable.variants';
import { cn } from '../../lib';

// @@V tpl-1 begin
import {
  navItem,
  navItemIcon,
  navItemLabel,
  type NavItemVariants,
} from './AppShell.variants';
// @@V tpl-1 end

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
// @@T tpl-1 begin
export const NavItem: ForwardRefExoticComponent<
  NavItemProps & RefAttributes<HTMLButtonElement>
> = forwardRef<
// @@T tpl-1 end
  HTMLButtonElement, NavItemProps>(
  ({ className, active, collapsed, icon, children, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      aria-current={active
        ? 'page'
        : undefined}
      className={cn(
        touchable({ rounded: 'md', noBrightness: false }),
        navItem({ active, collapsed }),
        className,
      )}
      {...props}
    >
      {/* @@V tpl-1 begin */}
      {icon != null && <span className={navItemIcon()}>{icon}</span>}
      {!collapsed && <span className={navItemLabel()}>{children}</span>}
      {/* @@V tpl-1 end */}
    </button>
  ),
);

NavItem.displayName = 'NavItem';
