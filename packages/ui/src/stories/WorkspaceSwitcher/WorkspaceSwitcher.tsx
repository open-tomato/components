import type { MonogramProps } from '../../atoms/Monogram';
import type { FC } from 'react';

import { Icon } from '../../atoms/Icon';
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuLabel,
  MenuSep,
  MenuTrigger,
} from '../../atoms/Menu';
import { Monogram } from '../../atoms/Monogram';
import { cn } from '../../lib';

import {
  workspaceRow,
  workspaceRowBody,
  workspaceRowCheck,
  workspaceRowMembers,
  workspaceRowName,
  workspaceRowText,
  workspaceSwitcherChevron,
  workspaceSwitcherMenu,
  workspaceSwitcherName,
  workspaceSwitcherTotal,
  workspaceSwitcherTrigger,
} from './WorkspaceSwitcher.variants';

const RECENT_LIMIT = 5;

export interface WorkspaceOption {
  id: string;
  name: string;
  /** Member count, shown mono under the name in the menu rows. */
  members?: number;
  /** Monogram fill for this group's identity block. */
  tone?: MonogramProps['tone'];
}

export interface WorkspaceSwitcherProps {
  /** Ordered most-recent-first; only the first 5 are listed inline. */
  workspaces: WorkspaceOption[];
  activeId: string;
  onSwitch?: (id: string) => void;
  /** "See all groups" — links to the groups settings page. */
  onSeeAll?: () => void;
  onNew?: () => void;
  /** Render with the menu open (docs/stories). */
  defaultOpen?: boolean;
  className?: string;
}

/**
 * Group switcher (topbar demo; app-shell spec): the active group as a
 * max-width pill; the menu lists the 5 most recent groups (check mark on the
 * active one) and links out to the groups settings page instead of offering
 * in-place search. Hidden entirely for single-group users (the spec's
 * default), and scope-free — no topbar dependency, so it can move to the
 * sidebar later.
 */
export const WorkspaceSwitcher: FC<WorkspaceSwitcherProps> = ({
  workspaces,
  activeId,
  onSwitch,
  onSeeAll,
  onNew,
  defaultOpen = false,
  className,
}: WorkspaceSwitcherProps) => {
  // Spec: users with one group never see the switcher.
  const [first] = workspaces;
  if (workspaces.length < 2 || first == null) return null;
  const active = workspaces.find((w) => w.id === activeId) ?? first;
  const recent = workspaces.slice(0, RECENT_LIMIT);
  return (
    <Menu defaultOpen={defaultOpen} modal={false}>
      <MenuTrigger className={cn(workspaceSwitcherTrigger(), className)}>
        <Monogram name={active.name} tone={active.tone} size="sm" />
        <span className={workspaceSwitcherName()}>{active.name}</span>
        <Icon name="chevron-down" size={14} className={workspaceSwitcherChevron()} />
      </MenuTrigger>
      <MenuContent className={workspaceSwitcherMenu()}>
        <MenuLabel>Recent groups</MenuLabel>
        {recent.map((w) => (
          <MenuItem
            key={w.id}
            className={workspaceRow({ active: w.id === activeId })}
            onSelect={() => onSwitch?.(w.id)}
            trailing={
              w.id === activeId
                ? <Icon name="check" size={14} className={workspaceRowCheck()} />
                : undefined
            }
          >
            <span className={workspaceRowBody()}>
              <Monogram name={w.name} tone={w.tone} size="sm" />
              <span className={workspaceRowText()}>
                <span className={workspaceRowName()}>
                  {w.name}
                </span>
                {w.members != null && (
                  <span className={workspaceRowMembers()}>
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
            <span className={workspaceSwitcherTotal()}>
              {workspaces.length} total
            </span>
          )}
          onSelect={() => onSeeAll?.()}
        >
          See all groups
        </MenuItem>
        <MenuItem
          tone="accent"
          icon={<Icon name="plus" size={15} />}
          onSelect={() => onNew?.()}
        >
          New group
        </MenuItem>
      </MenuContent>
    </Menu>
  );
};

WorkspaceSwitcher.displayName = 'WorkspaceSwitcher';
