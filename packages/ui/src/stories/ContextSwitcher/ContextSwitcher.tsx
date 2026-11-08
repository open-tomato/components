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
  contextRowMeta,
  contextRowName,
  contextRowText,
  contextSwitcherChevron,
  contextSwitcherMenu,
  contextSwitcherName,
  contextSwitcherTotal,
  contextSwitcherTrigger,
} from './ContextSwitcher.variants';

/** How many recent options the menu lists inline unless `limit` says otherwise. */
const DEFAULT_LIMIT = 5;

export interface ContextOption {
  id: string;
  name: string;
  /** A free second line, shown mono under the name in the menu rows ("staging", "3 projects"). */
  meta?: string;
  /** Monogram fill for this option's identity block. */
  tone?: MonogramProps['tone'];
}

export interface ContextSwitcherProps {
  /** Ordered most-recent-first; only the first `limit` are listed inline. */
  contexts: ContextOption[];
  activeId: string;
  onSwitch?: (id: string) => void;
  /** Called by the "see all" row, which also shows the total count. */
  onSeeAll?: () => void;
  onNew?: () => void;
  /** Heading over the recent rows. */
  recentLabel?: string;
  /** Text of the row that leads to the full list. */
  seeAllLabel?: string;
  /** Text of the row that creates a new option. */
  newLabel?: string;
  /** How many recent options the menu lists inline. */
  limit?: number;
  /** Render with the menu open (docs/stories). */
  defaultOpen?: boolean;
  className?: string;
}

/**
 * A switcher between contexts: the active one as a max-width pill; the menu
 * lists the most recent ones (check mark on the active one) and a "see all"
 * row instead of offering in-place search. Hidden entirely with fewer than
 * two options, and scope-free — no top-bar dependency, so it can move to
 * the sidebar later.
 */
export const ContextSwitcher: FC<ContextSwitcherProps> = ({
  contexts,
  activeId,
  onSwitch,
  onSeeAll,
  onNew,
  recentLabel = 'Recent',
  seeAllLabel = 'See all',
  newLabel = 'New',
  limit = DEFAULT_LIMIT,
  defaultOpen = false,
  className,
}: ContextSwitcherProps) => {
  // One option alone is nothing to switch between.
  const [first] = contexts;
  if (contexts.length < 2 || first == null) return null;
  const active = contexts.find((w) => w.id === activeId) ?? first;
  const recent = contexts.slice(0, limit);
  return (
    <Menu defaultOpen={defaultOpen} modal={false}>
      <MenuTrigger className={cn(contextSwitcherTrigger(), className)}>
        <Monogram name={active.name} tone={active.tone} size="sm" />
        <span className={contextSwitcherName()}>{active.name}</span>
        <Icon name="chevron-down" size={14} className={contextSwitcherChevron()} />
      </MenuTrigger>
      <MenuContent className={contextSwitcherMenu()}>
        <MenuLabel>{recentLabel}</MenuLabel>
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
                {w.meta != null && (
                  <span className={contextRowMeta()}>
                    {w.meta}
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
          {seeAllLabel}
        </MenuItem>
        <MenuItem
          tone="accent"
          icon={<Icon name="plus" size={15} />}
          onSelect={() => onNew?.()}
        >
          {newLabel}
        </MenuItem>
      </MenuContent>
    </Menu>
  );
};

ContextSwitcher.displayName = 'ContextSwitcher';
