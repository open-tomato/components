import type { ComponentProps } from 'react';

import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, mock } from 'bun:test';

import { Menu, MenuContent, MenuItem, MenuLabel, MenuSep, MenuTrigger } from './Menu';

const setup = (
  content: Partial<ComponentProps<typeof MenuContent>> = {},
  onSelect: () => void = () => undefined,
) => render(
  <Menu open modal={false}>
    <MenuTrigger>Actions</MenuTrigger>
    <MenuContent {...content}>
      <MenuLabel>Group</MenuLabel>
      <MenuItem icon={<i data-testid="ic" />} trailing={<kbd>K</kbd>} onSelect={onSelect}>
        Open
      </MenuItem>
      <MenuSep data-testid="sep" />
      <MenuItem tone="danger">Delete</MenuItem>
    </MenuContent>
  </Menu>,
);

describe('Menu', () => {
  it('renders label, items, icon, trailing and separator when open', () => {
    setup();
    expect(screen.getByRole('menu')).toBeTruthy();
    expect(screen.getByText('Group')).toBeTruthy();
    expect(screen.getByRole('menuitem', { name: /Open/ })).toBeTruthy();
    expect(screen.getByRole('menuitem', { name: 'Delete' })).toBeTruthy();
    expect(screen.getByTestId('ic')).toBeTruthy();
    expect(screen.getByText('K')).toBeTruthy();
    expect(screen.getByTestId('sep')).toBeTruthy();
  });

  it('calls onSelect when an item is chosen', () => {
    const onSelect = mock(() => undefined);
    setup({}, onSelect);
    fireEvent.click(screen.getByRole('menuitem', { name: /Open/ }));
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it.each(['sm', 'md', 'lg'] as const)('renders size %s', (size) => {
    setup({ size, className: 'extra' });
    expect(screen.getByRole('menu').className).toContain('extra');
  });

  it('renders end alignment', () => {
    setup({ align: 'end' });
    expect(screen.getByRole('menu')).toBeTruthy();
  });

  it('renders nothing of the content when closed', () => {
    render(
      <Menu>
        <MenuTrigger>Actions</MenuTrigger>
        <MenuContent><MenuItem>Open</MenuItem></MenuContent>
      </Menu>,
    );
    expect(screen.queryByRole('menu')).toBeNull();
    expect(screen.getByRole('button', { name: 'Actions' })).toBeTruthy();
  });
});
