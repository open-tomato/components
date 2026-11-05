import type { ComponentProps } from 'react';

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, mock } from 'bun:test';

import { CommandPalette, fuzzy, type Command } from './CommandPalette';

const COMMANDS: Command[] = [
  { id: 'go-home', group: 'Go to', label: 'Overview', keys: 'dashboard home' },
  { id: 'go-members', group: 'Go to', label: 'Members' },
  { id: 'new-item', group: 'Actions', label: 'New item', hint: '⌘N' },
];

afterEach(cleanup);

const setup = (props: Partial<ComponentProps<typeof CommandPalette>> = {}) => {
  const onClose = mock(() => {});
  const onRun = mock((_c: Command) => {});
  render(
    <CommandPalette open onClose={onClose} onRun={onRun} commands={COMMANDS} {...props} />,
  );
  return { onClose, onRun };
};

describe('fuzzy', () => {
  it('matches subsequences case-insensitively', () => {
    expect(fuzzy('', 'x')).toBe(true);
    expect(fuzzy('nim', 'New item')).toBe(true);
    expect(fuzzy('zz', 'New item')).toBe(false);
  });
});

describe('CommandPalette', () => {
  it('renders nothing when closed', () => {
    setup({ open: false });
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('renders grouped commands with hint and count', () => {
    setup();
    expect(screen.getByRole('dialog', { name: 'Command palette' })).toBeTruthy();
    expect(screen.getByText('Go to')).toBeTruthy();
    expect(screen.getByText('Actions')).toBeTruthy();
    expect(screen.getByRole('button', { name: /New item/ })).toBeTruthy();
    expect(screen.getByText('⌘N')).toBeTruthy();
    expect(screen.getByText('3 results')).toBeTruthy();
  });

  it('shows the Recent group when recent is set', () => {
    setup({ recent: ['new-item', 'missing'] });
    expect(screen.getByText('Recent')).toBeTruthy();
    expect(screen.getByText('1 result')).toBeTruthy();
  });

  it('uses a custom placeholder', () => {
    setup({ placeholder: 'Find' });
    expect(screen.getByPlaceholderText('Find')).toBeTruthy();
  });

  it('filters by query and shows the empty state', () => {
    setup();
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'dash' } });
    expect(screen.getByRole('button', { name: /Overview/ })).toBeTruthy();
    expect(screen.queryByRole('button', { name: /Members/ })).toBeNull();
    fireEvent.change(input, { target: { value: 'qqq' } });
    expect(screen.getByText(/No commands for/)).toBeTruthy();
  });

  it('runs the active command with Enter after arrow navigation', () => {
    const { onRun, onClose } = setup();
    const input = screen.getByRole('textbox');
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'ArrowUp' });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onRun.mock.calls[0]?.[0].id).toBe('go-members');
    expect(onClose).toHaveBeenCalled();
  });

  it('supports Home and End keys', () => {
    const { onRun } = setup();
    const input = screen.getByRole('textbox');
    fireEvent.keyDown(input, { key: 'End' });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onRun.mock.calls[0]?.[0].id).toBe('new-item');
    fireEvent.keyDown(input, { key: 'Home' });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onRun.mock.calls[1]?.[0].id).toBe('go-home');
  });

  it('runs a command on click and activates on mouse move', () => {
    const { onRun } = setup();
    const btn = screen.getByRole('button', { name: /Members/ });
    fireEvent.mouseMove(btn);
    fireEvent.click(btn);
    expect(onRun.mock.calls[0]?.[0].id).toBe('go-members');
  });
});
