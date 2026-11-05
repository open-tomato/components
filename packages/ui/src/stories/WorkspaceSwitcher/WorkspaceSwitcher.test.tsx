import type { ReactElement } from 'react';

import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, mock } from 'bun:test';

import { WorkspaceSwitcher, type WorkspaceOption } from './WorkspaceSwitcher';

import * as barrel from './index';

const WS: WorkspaceOption[] = [
  { id: 'a', name: 'alpha', members: 4, tone: 'accent' },
  { id: 'b', name: 'beta', tone: 'primary' },
  { id: 'c', name: 'gamma' },
];

const open = async (ui: ReactElement) => {
  await act(async () => {
    render(ui);
  });
};

describe('WorkspaceSwitcher', () => {
  // @@S tpl-1 begin
  it('renders nothing for fewer than two groups', async () => {
  // @@S tpl-1 end
    await open(<WorkspaceSwitcher workspaces={[WS[0]!]} activeId="a" />);
    expect(screen.queryByRole('button')).toBeNull();
  });

  // @@S tpl-1 begin
  it('shows the active group in the trigger, falling back to the first', async () => {
  // @@S tpl-1 end
    await open(<WorkspaceSwitcher workspaces={WS} activeId="missing" className="extra" />);
    const trigger = screen.getByRole('button');
    expect(trigger.textContent).toContain('alpha');
    expect(trigger.className).toContain('extra');
  });

  // @@S tpl-1 begin
  it('lists only the five most recent groups when open', async () => {
  // @@S tpl-1 end
    const many = Array.from({ length: 7 }, (_, i) => ({ id: `w${i}`, name: `ws-${i}` }));
    await open(<WorkspaceSwitcher workspaces={many} activeId="w0" defaultOpen />);
    expect(screen.getAllByRole('menuitem').length).toBe(5 + 2);
    expect(screen.queryByText('ws-6')).toBeNull();
    expect(screen.getByText('7 total')).toBeTruthy();
  });

  it('shows member counts only where given', async () => {
    await open(<WorkspaceSwitcher workspaces={WS} activeId="a" defaultOpen />);
    expect(screen.getByText('4 members')).toBeTruthy();
    expect(screen.getAllByText(/members/).length).toBe(1);
  });

  it.each([
    ['beta', 'onSwitch', 'b'],
    // @@S tpl-1 begin
    ['See all groups', 'onSeeAll', undefined],
    ['New group', 'onNew', undefined],
    // @@S tpl-1 end
  ] as const)('selecting %s calls %s', async (label, handler, arg) => {
    const fns = { onSwitch: mock(() => {}), onSeeAll: mock(() => {}), onNew: mock(() => {}) };
    await open(<WorkspaceSwitcher workspaces={WS} activeId="a" defaultOpen {...fns} />);
    await act(async () => {
      fireEvent.click(screen.getByText(label));
    });
    expect(fns[handler]).toHaveBeenCalledTimes(1);
    if (arg) expect(fns.onSwitch).toHaveBeenCalledWith(arg);
  });

  it('tolerates selection without handlers', async () => {
    await open(<WorkspaceSwitcher workspaces={WS} activeId="a" defaultOpen />);
    await act(async () => {
      // @@S tpl-1 begin
      fireEvent.click(screen.getByText('New group'));
      // @@S tpl-1 end
    });
  });

  it('exports its variants and component from the folder barrel', () => {
    expect(barrel.WorkspaceSwitcher).toBe(WorkspaceSwitcher);
    expect(typeof barrel.workspaceRow).toBe('function');
    expect(typeof barrel.workspaceSwitcherTrigger).toBe('function');
  });
});
