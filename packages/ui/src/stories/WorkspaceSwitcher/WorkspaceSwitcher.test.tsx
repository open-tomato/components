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
  it('renders nothing for fewer than two workspaces', async () => {
    await open(<WorkspaceSwitcher workspaces={[WS[0]!]} activeId="a" />);
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('shows the active workspace in the trigger, falling back to the first', async () => {
    await open(<WorkspaceSwitcher workspaces={WS} activeId="missing" className="extra" />);
    const trigger = screen.getByRole('button');
    expect(trigger.textContent).toContain('alpha');
    expect(trigger.className).toContain('extra');
  });

  it('lists only the five most recent workspaces when open', async () => {
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
    ['See all workspaces', 'onSeeAll', undefined],
    ['New workspace', 'onNew', undefined],
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
      fireEvent.click(screen.getByText('New workspace'));
    });
  });

  it('exports its variants and component from the folder barrel', () => {
    expect(barrel.WorkspaceSwitcher).toBe(WorkspaceSwitcher);
    expect(typeof barrel.workspaceRow).toBe('function');
    expect(typeof barrel.workspaceSwitcherTrigger).toBe('function');
  });
});
