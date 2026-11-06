import type { IconName } from '../../atoms/Icon';
import type { FC, ReactNode } from 'react';

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

import { Icon } from '../../atoms/Icon';
import { IconButton } from '../../atoms/IconButton';
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuLabel,
  MenuTrigger,
} from '../../atoms/Menu';

import {
  notificationDot,
  notificationPuck,
  notificationRow,
  notificationBody,
  notificationCount,
  notificationFooter,
  notificationHeader,
  notificationItemTitle,
  notificationList,
  notificationMarkAll,
  notificationPopover,
  notificationRowInner,
  notificationText,
  notificationTime,
  notificationTitle,
  notificationTitleRow,
  notificationTrigger,
  notificationUnreadMark,
} from './NotificationsBell.variants';

export type NotificationLevel = 'ok' | 'warn' | 'err' | 'info';

export interface NotificationItem {
  id: string | number;
  level: NotificationLevel;
  title: string;
  body?: ReactNode;
  /** Relative time chip ("2m ago"). */
  time?: string;
  unread?: boolean;
  /** Overrides the level's default glyph. */
  icon?: IconName;
}

export interface NotificationsBellProps {
  /** Parent-owned; mark-all-read mutates via `onMarkAllRead`. */
  notifications: NotificationItem[];
  onMarkAllRead?: () => void;
  onOpenItem?: (item: NotificationItem) => void;
  onSeeAll?: () => void;
  /** Render with the popover open (docs/stories). */
  defaultOpen?: boolean;
  label?: string;
}

/** Level → default Lucide glyph (original seed icons). */
const LEVEL_ICON: Record<NotificationLevel, IconName> = {
  ok: 'check',
  warn: 'triangle-alert',
  err: 'x',
  info: 'info',
};

/** Spec grouping order: ok / warn / err / info. */
const LEVEL_ORDER: NotificationLevel[] = ['ok', 'warn', 'err', 'info'];

/**
 * NotificationsBell (the original TopbarLive demo; app-shell spec: Top
 * Bar): a ghost bell IconButton carrying a single red dot when ≥1 unread
 * (never a numeric badge — numbers crowd the bar), opening a popover
 * grouped by level with a mark-all-read action in its header. State is
 * parent-owned: the component renders `notifications` and reports
 * intents through callbacks.
 */
export const NotificationsBell: FC<NotificationsBellProps> = ({
  notifications,
  onMarkAllRead,
  onOpenItem,
  onSeeAll,
  defaultOpen = false,
  label = 'Notifications',
}: NotificationsBellProps) => {
  const unread = notifications.filter((n) => n.unread).length;
  const groups = LEVEL_ORDER
    .map((level) => ({
      level,
      items: notifications.filter((n) => n.level === level),
    }))
    .filter((g) => g.items.length > 0);
  return (
    <Menu defaultOpen={defaultOpen} modal={false}>
      <MenuTrigger asChild>
        <IconButton
          className={notificationTrigger()}
          label={unread > 0
            ? `${label} — ${unread} unread`
            : label}
          icon={(
            <>
              <Icon name="bell" size={18} />
              {unread > 0 && <span className={notificationDot()} aria-hidden />}
            </>
          )}
        />
      </MenuTrigger>
      <MenuContent align="end" className={notificationPopover()}>
        <div className={notificationHeader()}>
          <div>
            <div className={notificationTitle()}>
              Notifications
            </div>
            <div className={notificationCount()}>
              {unread} unread · {notifications.length} total
            </div>
          </div>
          <DropdownMenu.Item
            asChild
            disabled={unread === 0}
            onSelect={(e) => {
              // Keep the popover open — marking read is not a dismissal.
              e.preventDefault();
              onMarkAllRead?.();
            }}
          >
            <button
              type="button"
              className={notificationMarkAll()}
            >
              Mark all read
            </button>
          </DropdownMenu.Item>
        </div>
        <div className={notificationList()}>
          {groups.map((g) => (
            <div key={g.level}>
              <MenuLabel>{g.level}</MenuLabel>
              {g.items.map((n) => (
                <MenuItem
                  key={n.id}
                  className={notificationRow({ unread: n.unread ?? false })}
                  onSelect={() => onOpenItem?.(n)}
                >
                  <span className={notificationRowInner()}>
                    <span className={notificationPuck({ level: n.level })}>
                      <Icon name={n.icon ?? LEVEL_ICON[n.level]} size={14} />
                    </span>
                    <span className={notificationText()}>
                      <span className={notificationTitleRow()}>
                        <span className={notificationItemTitle()}>
                          {n.title}
                        </span>
                        {n.time != null && (
                          <span className={notificationTime()}>
                            {n.time}
                          </span>
                        )}
                      </span>
                      {n.body != null && (
                        <span className={notificationBody()}>
                          {n.body}
                        </span>
                      )}
                    </span>
                    {n.unread && (
                      <span
                        className={notificationUnreadMark()}
                        aria-hidden
                      />
                    )}
                  </span>
                </MenuItem>
              ))}
            </div>
          ))}
        </div>
        <div className={notificationFooter()}>
          <MenuItem
            tone="accent"
            icon={<Icon name="inbox" size={15} />}
            onSelect={() => onSeeAll?.()}
          >
            See all notifications
          </MenuItem>
        </div>
      </MenuContent>
    </Menu>
  );
};

NotificationsBell.displayName = 'NotificationsBell';
