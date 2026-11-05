import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, mock } from 'bun:test';

import { ProfileMenu } from './ProfileMenu';

const USER = { name: 'Sam Lin', email: 'sam@example.com', role: 'owner' };

afterEach(cleanup);

describe('ProfileMenu', () => {
  it('renders only the trigger when closed', () => {
    render(<ProfileMenu user={USER} />);
    expect(screen.getByRole('button', { name: 'Account — Sam Lin' })).toBeTruthy();
    expect(screen.queryByRole('menuitem')).toBeNull();
  });

  it('renders identity and options when open', () => {
    render(<ProfileMenu user={USER} defaultOpen />);
    expect(screen.getByText('sam@example.com')).toBeTruthy();
    expect(screen.getByText('owner')).toBeTruthy();
    for (const name of ['My profile', 'Account settings', 'Switch workspace', 'Log out']) {
      expect(screen.getByRole('menuitem', { name })).toBeTruthy();
    }
  });

  it.each([
    ['My profile', 'onProfile'],
    ['Account settings', 'onAccountSettings'],
    ['Switch workspace', 'onSwitchWorkspace'],
  ] as const)('fires the handler for %s', (name, prop) => {
    const handler = mock(() => {});
    render(<ProfileMenu user={USER} defaultOpen {...{ [prop]: handler }} />);
    fireEvent.click(screen.getByRole('menuitem', { name }));
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('confirms logout inline, cancel returns to the menu', () => {
    const onLogout = mock(() => {});
    render(<ProfileMenu user={USER} defaultOpen onLogout={onLogout} />);
    fireEvent.click(screen.getByRole('menuitem', { name: 'Log out' }));
    expect(screen.getByText('Log out of Acme?')).toBeTruthy();
    expect(onLogout).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('menuitem', { name: 'Cancel' }));
    expect(screen.getByRole('menuitem', { name: 'Log out' })).toBeTruthy();
    expect(onLogout).not.toHaveBeenCalled();
  });

  it('fires onLogout after confirming and closes the menu', () => {
    const onLogout = mock(() => {});
    render(<ProfileMenu user={USER} defaultOpen onLogout={onLogout} />);
    fireEvent.click(screen.getByRole('menuitem', { name: 'Log out' }));
    fireEvent.click(screen.getByRole('menuitem', { name: 'Yes, log out' }));
    expect(onLogout).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('menuitem')).toBeNull();
  });
});
