// @@T tpl-1 begin
// @@S ato-2 begin
import type { MonogramProps } from '../../atoms/Monogram';
// @@S ato-2 end
import type { FC } from 'react';
// @@T tpl-1 end

import { Icon } from '../../atoms/Icon';
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuLabel,
  MenuSep,
  MenuTrigger,
} from '../../atoms/Menu';
// @@S ato-2 begin
import { Monogram } from '../../atoms/Monogram';
// @@S ato-2 end
import { cn } from '../../lib';

import {
  workspaceRow,
  // @@V tpl-1 begin
  workspaceRowBody,
  workspaceRowCheck,
  workspaceRowMembers,
  workspaceRowName,
  workspaceRowText,
  workspaceSwitcherChevron,
  workspaceSwitcherMenu,
  workspaceSwitcherName,
  workspaceSwitcherTotal,
  // @@V tpl-1 end
  workspaceSwitcherTrigger,
} from './WorkspaceSwitcher.variants';

const RECENT_LIMIT = 5;

export interface WorkspaceOption {
  id: string;
  name: string;
  /** Member count, shown mono under the name in the menu rows. */
  members?: number;
  // @@S tpl-1 begin
  /** Monogram fill for this group's identity block. */
  // @@S tpl-1 end
  // @@S ato-2 begin
  tone?: MonogramProps['tone'];
  // @@S ato-2 end
}

export interface WorkspaceSwitcherProps {
  /** Ordered most-recent-first; only the first 5 are listed inline. */
  workspaces: WorkspaceOption[];
  activeId: string;
  onSwitch?: (id: string) => void;
  // @@S tpl-1 begin
  /** "See all groups" — links to the groups settings page. */
  // @@S tpl-1 end
  onSeeAll?: () => void;
  onNew?: () => void;
  /** Render with the menu open (docs/stories). */
  defaultOpen?: boolean;
  className?: string;
}

// @@S tpl-1 begin
/**
 * Group switcher (topbar demo; app-shell spec): the active group as a
 * max-width pill; the menu lists the 5 most recent groups (check mark on the
 * active one) and links out to the groups settings page instead of offering
 * in-place search. Hidden entirely for single-group users (the spec's
 * default), and scope-free — no topbar dependency, so it can move to the
 * sidebar later.
 */
// @@S tpl-1 end
// @@T tpl-1 begin
export const WorkspaceSwitcher: FC<WorkspaceSwitcherProps> = ({
// @@T tpl-1 end
  workspaces,
  activeId,
  onSwitch,
  onSeeAll,
  onNew,
  defaultOpen = false,
  className,
}: WorkspaceSwitcherProps) => {
  // @@S tpl-1 begin
  // Spec: users with one group never see the switcher.
  // @@S tpl-1 end
  const [first] = workspaces;
  if (workspaces.length < 2 || first == null) return null;
  const active = workspaces.find((w) => w.id === activeId) ?? first;
  const recent = workspaces.slice(0, RECENT_LIMIT);
  return (
    <Menu defaultOpen={defaultOpen} modal={false}>
      <MenuTrigger className={cn(workspaceSwitcherTrigger(), className)}>
        {/* @@S ato-2 begin */}
        <Monogram name={active.name} tone={active.tone} size="sm" />
        {/* @@S ato-2 end */}
        {/* @@V tpl-1 begin */}
        <span className={workspaceSwitcherName()}>{active.name}</span>
        <Icon name="chevron-down" size={14} className={workspaceSwitcherChevron()} />
      </MenuTrigger>
      <MenuContent className={workspaceSwitcherMenu()}>
        {/* @@V tpl-1 end */}
        {/* @@S tpl-1 begin */}
        <MenuLabel>Recent groups</MenuLabel>
        {/* @@S tpl-1 end */}
        {recent.map((w) => (
          <MenuItem
            key={w.id}
            className={workspaceRow({ active: w.id === activeId })}
            onSelect={() => onSwitch?.(w.id)}
            trailing={
              w.id === activeId
                // @@V tpl-1 begin
                ? <Icon name="check" size={14} className={workspaceRowCheck()} />
                // @@V tpl-1 end
                : undefined
            }
          >
            {/* @@V tpl-1 begin */}
            <span className={workspaceRowBody()}>
              {/* @@S ato-2 begin */}
              <Monogram name={w.name} tone={w.tone} size="sm" />
              {/* @@S ato-2 end */}
              <span className={workspaceRowText()}>
                <span className={workspaceRowName()}>
                  {w.name}
                </span>
                {w.members != null && (
                  <span className={workspaceRowMembers()}>
                    {/* @@V tpl-1 end */}
                    {w.members} members
                  </span>
                )}
              </span>
            </span>
          </MenuItem>
        ))}
        <MenuSep />
        <MenuItem
          icon={<Icon name="layers" size={15} />}
          trailing={(
            // @@V tpl-1 begin
            <span className={workspaceSwitcherTotal()}>
              {/* @@V tpl-1 end */}
              {workspaces.length} total
            </span>
          )}
          onSelect={() => onSeeAll?.()}
        >
          {/* @@S tpl-1 begin */}
          See all groups
          {/* @@S tpl-1 end */}
        </MenuItem>
        <MenuItem
          tone="accent"
          icon={<Icon name="plus" size={15} />}
          onSelect={() => onNew?.()}
        >
          {/* @@S tpl-1 begin */}
          New group
          {/* @@S tpl-1 end */}
        </MenuItem>
      </MenuContent>
    </Menu>
  );
};

WorkspaceSwitcher.displayName = 'WorkspaceSwitcher';
