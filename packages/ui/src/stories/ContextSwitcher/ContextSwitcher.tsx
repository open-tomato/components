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
  contextRow,
  contextRowBody,
  contextRowCheck,
  contextRowMembers,
  contextRowName,
  contextRowText,
  contextSwitcherChevron,
  contextSwitcherMenu,
  contextSwitcherName,
  contextSwitcherTotal,
  contextSwitcherTrigger,
} from './ContextSwitcher.variants';

const RECENT_LIMIT = 5;

export interface ContextOption {
  id: string;
  name: string;
  /** Member count, shown mono under the name in the menu rows. */
  members?: number;
  /** Monogram fill for this group's identity block. */
  tone?: MonogramProps['tone'];
}

export interface ContextSwitcherProps {
  /** Ordered most-recent-first; only the first 5 are listed inline. */
  contexts: ContextOption[];
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
export const ContextSwitcher: FC<ContextSwitcherProps> = ({
  contexts,
  activeId,
  onSwitch,
  onSeeAll,
  onNew,
  defaultOpen = false,
  className,
}: ContextSwitcherProps) => {
  // Spec: users with one group never see the switcher.
  const [first] = contexts;
  if (contexts.length < 2 || first == null) return null;
  const active = contexts.find((w) => w.id === activeId) ?? first;
  const recent = contexts.slice(0, RECENT_LIMIT);
  return (
    <Menu defaultOpen={defaultOpen} modal={false}>
      <MenuTrigger className={cn(contextSwitcherTrigger(), className)}>
        <Monogram name={active.name} tone={active.tone} size="sm" />
        <span className={contextSwitcherName()}>{active.name}</span>
        <Icon name="chevron-down" size={14} className={contextSwitcherChevron()} />
      </MenuTrigger>
      <MenuContent className={contextSwitcherMenu()}>
        <MenuLabel>Recent groups</MenuLabel>
        {recent.map((w) => (
          <MenuItem
            key={w.id}
            className={contextRow({ active: w.id === activeId })}
            onSelect={() => onSwitch?.(w.id)}
            trailing={
              w.id === activeId
                ? <Icon name="check" size={14} className={contextRowCheck()} />
                : undefined
            }
          >
            <span className={contextRowBody()}>
              <Monogram name={w.name} tone={w.tone} size="sm" />
              <span className={contextRowText()}>
                <span className={contextRowName()}>
                  {w.name}
                </span>
                {w.members != null && (
                  <span className={contextRowMembers()}>
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
            <span className={contextSwitcherTotal()}>
              {contexts.length} total
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

ContextSwitcher.displayName = 'ContextSwitcher';
