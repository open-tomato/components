import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, mock } from 'bun:test';
import { act, createRef } from 'react';

import { LiveShell } from '../../stories/shell-fixtures';

import {
  AppShell,
  AppShellBrand,
  AppShellContent,
  AppShellMain,
  AppShellSidebar,
  AppShellSpacer,
  AppShellTitle,
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

describe('AppShell height', () => {
  it('fills the box its parent gives it by default', () => {
    render(<AppShell data-testid="shell" />);
    const shell = screen.getByTestId('shell');
    expect(shell.className).toContain('h-full');
    expect(shell.className).not.toContain('h-dvh');
  });

  it('fills the viewport with viewport, whatever its parent', () => {
    render(<AppShell data-testid="shell" viewport />);
    const shell = screen.getByTestId('shell');
    expect(shell.className).toContain('h-dvh');
    expect(shell.className).not.toContain('h-full');
  });
});

describe('AppShell brand, title and spacer', () => {
  it('brand row shows the mark and the wordmark, and forwards ref and className', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <AppShellBrand
        ref={ref}
        className="extra"
        data-testid="brand"
        mark={<span>M</span>}
        wordmark="acme labs"
      />,
    );
    const brand = screen.getByTestId('brand');
    expect(ref.current === brand).toBe(true);
    expect(brand.className).toContain('extra');
    expect(brand.className).toContain('h-[60px]');
    expect(brand.className).toContain('border-b');
    expect(brand.textContent).toBe('Macme labs');
  });

  it('collapsed brand row keeps the mark, drops the wordmark and centres', () => {
    render(
      <AppShellBrand data-testid="brand" collapsed mark={<span>M</span>} wordmark="acme labs" />,
    );
    const brand = screen.getByTestId('brand');
    expect(brand.textContent).toBe('M');
    expect(brand.className).toContain('justify-center');
  });

  it('title is the page heading and grows, so what follows sits at the far end', () => {
    const ref = createRef<HTMLHeadingElement>();
    render(<AppShellTitle ref={ref} className="extra">Usage</AppShellTitle>);
    const title = screen.getByRole('heading', { level: 1, name: 'Usage' });
    expect(ref.current === title).toBe(true);
    expect(title.className).toContain('extra');
    expect(title.className).toContain('flex-1');
    expect(title.className).toContain('truncate');
  });

  it('spacer is hidden from assistive tech and takes the free space', () => {
    render(<AppShellSpacer data-testid="spacer" />);
    const spacer = screen.getByTestId('spacer');
    expect(spacer.getAttribute('aria-hidden')).toBe('true');
    expect(spacer.className).toContain('flex-1');
  });
});

describe('LiveShell stories', () => {
  it('frames the shell in a fixed box by default', async () => {
    let view!: ReturnType<typeof render>;
    await act(async () => {
      view = render(<LiveShell />);
    });
    const outer = view.container.firstElementChild as HTMLElement;
    expect(outer.className).toContain('h-[560px]');
  });

  it('renders the shell unframed, filling the viewport, for the viewport story', async () => {
    let view!: ReturnType<typeof render>;
    await act(async () => {
      view = render(<LiveShell viewport />);
    });
    const outer = view.container.firstElementChild as HTMLElement;
    expect(outer.className).toContain('h-dvh');
    expect(outer.className).not.toContain('h-[560px]');
  });

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
