import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, mock } from 'bun:test';
import { act } from 'react';

import { SidebarQuickAccess } from './SidebarQuickAccess';

describe('SidebarQuickAccess', () => {
  it('renders href items as new-tab links and click items as buttons', async () => {
    const onClick = mock(() => {});
    await act(async () => {
      render(
        <SidebarQuickAccess
          items={[
            { id: 'docs', label: 'Docs', icon: 'book-open', href: 'https://example.com/docs' },
            { id: 'set', label: 'Settings', icon: 'settings', onClick, active: true },
          ]}
        />,
      );
    });
    expect(screen.getByRole('navigation', { name: 'Quick access' })).toBeTruthy();
    const link = screen.getByRole('link', { name: 'Docs' });
    expect(link.getAttribute('href')).toBe('https://example.com/docs');
    expect(link.getAttribute('target')).toBe('_blank');
    const btn = screen.getByRole('button', { name: 'Settings' });
    expect(btn.getAttribute('aria-current')).toBe('page');
    fireEvent.click(btn);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('shows titles only when collapsed', async () => {
    await act(async () => {
      render(
        <SidebarQuickAccess
          collapsed
          label="Shortcuts"
          items={[
            { id: 'docs', label: 'Docs', icon: 'book-open', href: 'https://example.com' },
            { id: 'set', label: 'Settings', icon: 'settings' },
          ]}
        />,
      );
    });
    expect(screen.getByRole('navigation', { name: 'Shortcuts' })).toBeTruthy();
    expect(screen.getByTitle('Docs')).toBeTruthy();
    expect(screen.getByTitle('Settings')).toBeTruthy();
    expect(screen.getByTitle('Settings').hasAttribute('aria-current')).toBe(false);
  });
});
