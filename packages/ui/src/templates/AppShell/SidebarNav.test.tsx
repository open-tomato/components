import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, mock } from 'bun:test';
import { act } from 'react';

import { SidebarNav } from './SidebarNav';

const items = [
  { id: 'a', label: 'Overview', icon: 'layout-dashboard' as const },
  { id: 'b', label: 'Reports', icon: 'terminal' as const },
];

describe('SidebarNav', () => {
  it('renders one item per config entry and marks the active one', async () => {
    await act(async () => {
      render(<SidebarNav items={items} activeId="b" />);
    });
    expect(screen.getByRole('navigation', { name: 'Main navigation' })).toBeTruthy();
    expect(screen.getAllByRole('button')).toHaveLength(2);
    expect(screen.getByRole('button', { name: 'Reports' }).getAttribute('aria-current')).toBe('page');
    expect(screen.getByRole('button', { name: 'Overview' }).hasAttribute('aria-current')).toBe(false);
  });

  it('reports the clicked id and tolerates a missing handler', async () => {
    const onNavigate = mock((_id: string) => {});
    await act(async () => {
      render(<SidebarNav items={items} onNavigate={onNavigate} />);
    });
    fireEvent.click(screen.getByRole('button', { name: 'Reports' }));
    expect(onNavigate).toHaveBeenCalledWith('b');
  });

  it('does not throw on click without onNavigate', async () => {
    await act(async () => {
      render(<SidebarNav items={items} />);
    });
    fireEvent.click(screen.getByRole('button', { name: 'Overview' }));
  });

  it('uses titles instead of labels when collapsed, with a custom nav label', async () => {
    await act(async () => {
      render(<SidebarNav items={items} collapsed label="Rail" />);
    });
    expect(screen.getByRole('navigation', { name: 'Rail' })).toBeTruthy();
    expect(screen.getByTitle('Overview')).toBeTruthy();
  });
});
