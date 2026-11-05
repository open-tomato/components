import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, mock } from 'bun:test';
import { act, createRef } from 'react';

import { LiveShell } from '../../stories/shell-fixtures';

import {
  AppShell,
  AppShellContent,
  AppShellMain,
  AppShellSidebar,
  AppShellTopbar,
} from './AppShell';

describe('AppShell zones', () => {
  it('renders each zone with its landmark and forwards ref and className', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <AppShell ref={ref} className="extra" data-testid="shell">
        <AppShellSidebar collapsed aria-label="side">s</AppShellSidebar>
        <AppShellMain>
          <AppShellTopbar>top</AppShellTopbar>
          <AppShellContent footer={<span>foot</span>}>body</AppShellContent>
        </AppShellMain>
      </AppShell>,
    );
    expect(ref.current === screen.getByTestId('shell')).toBe(true);
    expect(ref.current?.className).toContain('extra');
    expect(screen.getByLabelText('side').tagName).toBe('ASIDE');
    expect(screen.getByRole('main')).toBeTruthy();
    expect(screen.getByRole('banner').textContent).toBe('top');
    expect(screen.getByRole('contentinfo').textContent).toBe('foot');
  });

  it('omits the footer and the toggle when not provided', () => {
    render(
      <>
        <AppShellTopbar>t</AppShellTopbar>
        <AppShellContent>c</AppShellContent>
      </>,
    );
    expect(screen.queryByRole('contentinfo')).toBeNull();
    expect(screen.queryByRole('button')).toBeNull();
  });

  it.each([
    [false, 'Collapse sidebar'],
    [true, 'Expand sidebar'],
  ])('topbar toggle for collapsed=%p is named %s and fires', async (collapsed, name) => {
    const onToggle = mock(() => {});
    await act(async () => {
      render(<AppShellTopbar onToggleSidebar={onToggle} sidebarCollapsed={collapsed} />);
    });
    fireEvent.click(screen.getByRole('button', { name }));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });
});

describe('LiveShell stories', () => {
  it('renders the default shell and toggles the rail', async () => {
    await act(async () => {
      render(<LiveShell />);
    });
    expect(screen.getByRole('navigation', { name: 'Main navigation' })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Collapse sidebar' }));
    expect(screen.getByRole('button', { name: 'Expand sidebar' })).toBeTruthy();
  });

  it('renders the collapsed variant', async () => {
    await act(async () => {
      render(<LiveShell collapsed />);
    });
    expect(screen.getByRole('button', { name: 'Expand sidebar' })).toBeTruthy();
  });

  it('renders the content footer variant', async () => {
    await act(async () => {
      render(<LiveShell page="settings" withFooter />);
    });
    expect(screen.getByText('Documentation')).toBeTruthy();
  });
});
