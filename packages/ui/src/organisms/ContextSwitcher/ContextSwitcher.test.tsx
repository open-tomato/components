import type { ReactElement } from 'react';

import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, mock } from 'bun:test';

import { ContextSwitcher, type ContextOption } from './ContextSwitcher';

import * as barrel from './index';

const CONTEXTS: ContextOption[] = [
  { id: 'a', name: 'alpha', meta: '4 seats', tone: 'accent' },
  { id: 'b', name: 'beta', tone: 'primary' },
  { id: 'c', name: 'gamma' },
];

const MANY: ContextOption[] = Array.from({ length: 7 }, (_, i) => ({ id: `c${i}`, name: `ctx-${i}` }));

const open = async (ui: ReactElement) => {
  await act(async () => {
    render(ui);
  });
};

describe('ContextSwitcher', () => {
  it('renders nothing for fewer than two options', async () => {
    await open(<ContextSwitcher contexts={[CONTEXTS[0]!]} activeId="a" />);
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('shows the active option in the trigger, falling back to the first', async () => {
    await open(<ContextSwitcher contexts={CONTEXTS} activeId="missing" className="extra" />);
    const trigger = screen.getByRole('button');
    expect(trigger.textContent).toContain('alpha');
    expect(trigger.className).toContain('extra');
  });

  it('lists only the five most recent options when open', async () => {
    await open(<ContextSwitcher contexts={MANY} activeId="c0" defaultOpen />);
    expect(screen.getAllByRole('menuitem').length).toBe(5 + 2);
    expect(screen.queryByText('ctx-6')).toBeNull();
    expect(screen.getByText('7 total')).toBeTruthy();
  });

  it('lists as many recent options as limit says', async () => {
    await open(<ContextSwitcher contexts={MANY} activeId="c0" defaultOpen limit={2} />);
    expect(screen.getAllByRole('menuitem').length).toBe(2 + 2);
    expect(screen.getByText('ctx-1')).toBeTruthy();
    expect(screen.queryByText('ctx-2')).toBeNull();
    expect(screen.getByText('7 total')).toBeTruthy();
  });

  it('shows the meta line only where given', async () => {
    await open(<ContextSwitcher contexts={CONTEXTS} activeId="a" defaultOpen />);
    expect(screen.getByText('4 seats')).toBeTruthy();
    expect(screen.getAllByText(/seats/).length).toBe(1);
  });

  it('labels the menu with neutral defaults', async () => {
    await open(<ContextSwitcher contexts={CONTEXTS} activeId="a" defaultOpen />);
    expect(screen.getByText('Recent')).toBeTruthy();
    expect(screen.getByText('See all')).toBeTruthy();
    expect(screen.getByText('New')).toBeTruthy();
  });

  it('takes the three labels as props', async () => {
    await open(
      <ContextSwitcher
        contexts={CONTEXTS}
        activeId="a"
        defaultOpen
        recentLabel="Recent sites"
        seeAllLabel="See all sites"
        newLabel="New site"
      />,
    );
    expect(screen.getByText('Recent sites')).toBeTruthy();
    expect(screen.getByText('See all sites')).toBeTruthy();
    expect(screen.getByText('New site')).toBeTruthy();
    expect(screen.queryByText('Recent')).toBeNull();
  });

  it.each([
    ['beta', 'onSwitch', 'b'],
    ['See all', 'onSeeAll', undefined],
    ['New', 'onNew', undefined],
  ] as const)('selecting %s calls %s', async (label, handler, arg) => {
    const fns = { onSwitch: mock(() => {}), onSeeAll: mock(() => {}), onNew: mock(() => {}) };
    await open(<ContextSwitcher contexts={CONTEXTS} activeId="a" defaultOpen {...fns} />);
    await act(async () => {
      fireEvent.click(screen.getByText(label));
    });
    expect(fns[handler]).toHaveBeenCalledTimes(1);
    if (arg) expect(fns.onSwitch).toHaveBeenCalledWith(arg);
  });

  it('tolerates selection without handlers', async () => {
    await open(<ContextSwitcher contexts={CONTEXTS} activeId="a" defaultOpen />);
    await act(async () => {
      fireEvent.click(screen.getByText('New'));
    });
  });

  it('exports its variants and component from the folder barrel', () => {
    expect(barrel.ContextSwitcher).toBe(ContextSwitcher);
    expect(typeof barrel.contextRow).toBe('function');
    expect(typeof barrel.contextSwitcherTrigger).toBe('function');
  });
});
