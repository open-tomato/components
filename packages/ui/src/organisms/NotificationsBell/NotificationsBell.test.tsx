import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, mock } from 'bun:test';

import { NotificationsBell, type NotificationItem } from './NotificationsBell';

const ITEMS: NotificationItem[] = [
  { id: 1, unread: true, level: 'ok', title: 'build finished', body: '8 files', time: '2m ago' },
  { id: 2, unread: true, level: 'err', title: 'job failed' },
  { id: 3, unread: false, level: 'info', icon: 'git-branch', title: 'PR opened' },
];

describe('NotificationsBell', () => {
  it('shows the unread count in the bell label', () => {
    render(<NotificationsBell notifications={ITEMS} />);
    expect(screen.getByRole('button', { name: 'Notifications — 2 unread' })).toBeTruthy();
  });

  it('uses the plain label when all are read', () => {
    render(
      <NotificationsBell
        label="Inbox"
        notifications={ITEMS.map((n) => ({ ...n, unread: false }))}
      />,
    );
    expect(screen.getByRole('button', { name: 'Inbox' })).toBeTruthy();
  });

  it('renders grouped items when open', () => {
    render(<NotificationsBell notifications={ITEMS} defaultOpen />);
    expect(screen.getByText('build finished')).toBeTruthy();
    expect(screen.getByText('2m ago')).toBeTruthy();
    expect(screen.getByText('8 files')).toBeTruthy();
    expect(screen.getByText('job failed')).toBeTruthy();
    expect(screen.getByText('PR opened')).toBeTruthy();
    expect(screen.getByText('2 unread · 3 total')).toBeTruthy();
  });

  it('calls onMarkAllRead', () => {
    const onMarkAllRead = mock(() => {});
    render(<NotificationsBell notifications={ITEMS} defaultOpen onMarkAllRead={onMarkAllRead} />);
    fireEvent.click(screen.getByText('Mark all read'));
    expect(onMarkAllRead).toHaveBeenCalledTimes(1);
  });

  it('calls onOpenItem with the item', () => {
    const onOpenItem = mock((_i: NotificationItem) => {});
    render(<NotificationsBell notifications={ITEMS} defaultOpen onOpenItem={onOpenItem} />);
    fireEvent.click(screen.getByText('job failed'));
    expect(onOpenItem).toHaveBeenCalledWith(ITEMS[1]);
  });

  it('calls onSeeAll', () => {
    const onSeeAll = mock(() => {});
    render(<NotificationsBell notifications={ITEMS} defaultOpen onSeeAll={onSeeAll} />);
    fireEvent.click(screen.getByText('See all notifications'));
    expect(onSeeAll).toHaveBeenCalledTimes(1);
  });
});
