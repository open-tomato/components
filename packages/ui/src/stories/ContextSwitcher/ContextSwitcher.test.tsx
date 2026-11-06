import type { ReactElement } from 'react';

import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, mock } from 'bun:test';

import { ContextSwitcher, type ContextOption } from './ContextSwitcher';

import * as barrel from './index';

const WS: ContextOption[] = [
  { id: 'a', name: 'alpha', members: 4, tone: 'accent' },
  { id: 'b', name: 'beta', tone: 'primary' },
  { id: 'c', name: 'gamma' },
];

const open = async (ui: ReactElement) => {
  await act(async () => {
    render(ui);
  });
};

describe('ContextSwitcher', () => {
  it('renders nothing for fewer than two groups', async () => {
    await open(<ContextSwitcher contexts={[WS[0]!]} activeId="a" />);
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('shows the active group in the trigger, falling back to the first', async () => {
    await open(<ContextSwitcher contexts={WS} activeId="missing" className="extra" />);
    const trigger = screen.getByRole('button');
    expect(trigger.textContent).toContain('alpha');
    expect(trigger.className).toContain('extra');
  });

  it('lists only the five most recent groups when open', async () => {
    const many = Array.from({ length: 7 }, (_, i) => ({ id: `w${i}`, name: `ws-${i}` }));
    await open(<ContextSwitcher contexts={many} activeId="w0" defaultOpen />);
    expect(screen.getAllByRole('menuitem').length).toBe(5 + 2);
    expect(screen.queryByText('ws-6')).toBeNull();
    expect(screen.getByText('7 total')).toBeTruthy();
  });

  it('shows member counts only where given', async () => {
    await open(<ContextSwitcher contexts={WS} activeId="a" defaultOpen />);
    expect(screen.getByText('4 members')).toBeTruthy();
    expect(screen.getAllByText(/members/).length).toBe(1);
  });

  it.each([
    ['beta', 'onSwitch', 'b'],
    ['See all groups', 'onSeeAll', undefined],
    ['New group', 'onNew', undefined],
  ] as const)('selecting %s calls %s', async (label, handler, arg) => {
    const fns = { onSwitch: mock(() => {}), onSeeAll: mock(() => {}), onNew: mock(() => {}) };
    await open(<ContextSwitcher contexts={WS} activeId="a" defaultOpen {...fns} />);
    await act(async () => {
      fireEvent.click(screen.getByText(label));
    });
    expect(fns[handler]).toHaveBeenCalledTimes(1);
    if (arg) expect(fns.onSwitch).toHaveBeenCalledWith(arg);
  });

  it('tolerates selection without handlers', async () => {
    await open(<ContextSwitcher contexts={WS} activeId="a" defaultOpen />);
    await act(async () => {
      fireEvent.click(screen.getByText('New group'));
    });
  });

  it('exports its variants and component from the folder barrel', () => {
    expect(barrel.ContextSwitcher).toBe(ContextSwitcher);
    expect(typeof barrel.contextRow).toBe('function');
    expect(typeof barrel.contextSwitcherTrigger).toBe('function');
  });
});
