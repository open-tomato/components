// @@T tpl-1 begin
import type { IconName } from '../../atoms/Icon';
import type { FC } from 'react';
// @@T tpl-1 end

import { Icon } from '../../atoms/Icon';
import { cn } from '../../lib';

// @@V tpl-1 begin
import { sidebarNav } from './AppShell.variants';
// @@V tpl-1 end
import { NavItem } from './NavItem';

/**
 * One nav entry as DATA (app-shell spec: Side Bar — "dynamically
 * generated from json/api/yaml"): icons travel as Lucide names, so a nav
 * config can come straight off the wire (and later carry feature flags).
 */
export interface SidebarNavConfigItem {
  id: string;
  label: string;
  icon: IconName;
}

export interface SidebarNavProps {
  items: SidebarNavConfigItem[];
  activeId?: string;
  onNavigate?: (id: string) => void;
  /** Threaded down from the shell — never this component's own state. */
  collapsed?: boolean;
  /** Accessible name for the nav landmark. */
  label?: string;
  className?: string;
}

/**
 * The sidebar's data-driven navigation: a column of NavItems rendered
 * from a config array. The current spec'd set is Overview
 * (layout-dashboard), Sessions (terminal), Agents (bot), Roadmap (list),
 * Tools (cpu) — but the component takes whatever the config says.
 */
// @@T tpl-1 begin
export const SidebarNav: FC<SidebarNavProps> = ({
// @@T tpl-1 end
  items,
  activeId,
  onNavigate,
  collapsed = false,
  label = 'Main navigation',
  className,
}: SidebarNavProps) => (
  <nav
    aria-label={label}
    // @@V tpl-1 begin
    className={cn(sidebarNav({ collapsed }), className)}
    // @@V tpl-1 end
  >
    {items.map((item) => (
      <NavItem
        key={item.id}
        active={item.id === activeId}
        collapsed={collapsed}
        title={collapsed
          ? item.label
          : undefined}
        icon={<Icon name={item.icon} size={18} />}
        onClick={() => onNavigate?.(item.id)}
      >
        {item.label}
      </NavItem>
    ))}
  </nav>
);

SidebarNav.displayName = 'SidebarNav';
