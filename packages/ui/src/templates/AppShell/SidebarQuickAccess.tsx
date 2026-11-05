// @@T tpl-1 begin
import type { IconName } from '../../atoms/Icon';
import type { FC } from 'react';
// @@T tpl-1 end

import { Icon } from '../../atoms/Icon';
import { touchable } from '../../atoms/Touchable/Touchable.variants';
import { cn } from '../../lib';

// @@V tpl-1 begin
import {
  navItem,
  navItemIcon,
  navItemLabel,
  quickAccessLink,
  sidebarQuickAccess,
} from './AppShell.variants';
// @@V tpl-1 end
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
// @@T tpl-1 begin
export const SidebarQuickAccess: FC<SidebarQuickAccessProps> = ({
// @@T tpl-1 end
  items,
  collapsed = false,
  label = 'Quick access',
  className,
}: SidebarQuickAccessProps) => (
  <nav
    aria-label={label}
    // @@V tpl-1 begin
    className={cn(sidebarQuickAccess({ collapsed }), className)}
    // @@V tpl-1 end
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
            touchable({ rounded: 'md', noBrightness: false }),
            navItem({ active: false, collapsed }),
            // @@V tpl-1 begin
            // @@S tpl-1 begin
            // The theme's element defaults can beat Tailwind utilities
            // on `a` — win with `!` (see the layered-base gotcha in the docs).
            // @@S tpl-1 end
            quickAccessLink(),
            // @@V tpl-1 end
          )}
        >
          {/* @@V tpl-1 begin */}
          <span className={navItemIcon()}>
            <Icon name={item.icon} size={18} />
          </span>
          {!collapsed && <span className={navItemLabel()}>{item.label}</span>}
          {/* @@V tpl-1 end */}
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
