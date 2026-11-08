import type { IconName } from '../../atoms/Icon';
import type { FC } from 'react';

import { Icon } from '../../atoms/Icon';
import { cn } from '../../lib';
import { touchableVariants } from '../../particles/touchable';

import {
  navItem,
  navItemIcon,
  navItemLabel,
  quickAccessLink,
  sidebarQuickAccess,
} from './AppShell.variants';
import { NavItem } from './NavItem';

export interface SidebarQuickAccessItem {
  id: string;
  label: string;
  icon: IconName;
  /** External destination — renders an anchor opening a NEW TAB. */
  href?: string;
  onClick?: () => void;
  active?: boolean;
}

export interface SidebarQuickAccessProps {
  /**
   * The spec's static set is Docs (href, new tab) + Settings (onClick) —
   * data-driven so it can become configurable / "recent" later.
   */
  items: SidebarQuickAccessItem[];
  collapsed?: boolean;
  label?: string;
  className?: string;
}

/**
 * The sidebar's bottom quick-access band (app-shell spec: Side
 * Bar): a bordered strip under the week summary. Items with `href` are
 * real links opening in a new tab (Docs → the documentation site);
 * items with `onClick` are in-app NavItems (Settings → settings page).
 */
export const SidebarQuickAccess: FC<SidebarQuickAccessProps> = ({
  items,
  collapsed = false,
  label = 'Quick access',
  className,
}: SidebarQuickAccessProps) => (
  <nav
    aria-label={label}
    className={cn(sidebarQuickAccess({ collapsed }), className)}
  >
    {items.map((item) => item.href != null
      ? (
        <a
          key={item.id}
          href={item.href}
          target="_blank"
          rel="noreferrer"
          title={collapsed
            ? item.label
            : undefined}
          className={cn(
            touchableVariants({ rounded: 'md', noBrightness: false }),
            navItem({ active: false, collapsed }),
            // The theme's element defaults can beat Tailwind utilities
            // on `a` — win with `!` (see the layered-base gotcha in the docs).
            quickAccessLink(),
          )}
        >
          <span className={navItemIcon()}>
            <Icon name={item.icon} size={18} />
          </span>
          {!collapsed && <span className={navItemLabel()}>{item.label}</span>}
        </a>
      )
      : (
        <NavItem
          key={item.id}
          active={item.active ?? false}
          collapsed={collapsed}
          title={collapsed
            ? item.label
            : undefined}
          icon={<Icon name={item.icon} size={18} />}
          onClick={item.onClick}
        >
          {item.label}
        </NavItem>
      ))}
  </nav>
);

SidebarQuickAccess.displayName = 'SidebarQuickAccess';
