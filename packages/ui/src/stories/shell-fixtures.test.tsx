import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'bun:test';

import { LiveShell, NAV_PRIMARY, SidebarDemo, TopbarDemo } from './shell-fixtures';

describe('shell fixtures', () => {
  it('lists the primary nav as data', () => {
    expect(NAV_PRIMARY.map((n) => n.id)).toContain('overview');
  });

  it('SidebarDemo shows the wordmark and navigates, and hides it when collapsed', async () => {
    const seen: string[] = [];
    let view!: ReturnType<typeof render>;
    await act(async () => {
      view = render(<SidebarDemo active="overview" onNavigate={(id) => seen.push(id)} />);
    });
    expect(screen.getByText('tomato')).toBeTruthy();
    await act(async () => {
      fireEvent.click(screen.getByText('Sessions'));
    });
    expect(seen).toEqual(['sessions']);
    view.unmount();
    await act(async () => {
      render(<SidebarDemo active="settings" onNavigate={() => {}} collapsed />);
    });
    expect(screen.queryByText('tomato')).toBeNull();
  });

  it('TopbarDemo renders the title beside the workspace switcher', async () => {
    await act(async () => {
      render(<TopbarDemo title="usage" />);
    });
    expect(screen.getByText('usage')).toBeTruthy();
    expect(screen.getByText('open-garden')).toBeTruthy();
  });

  it('LiveShell renders the page placeholder and the optional footer', async () => {
    await act(async () => {
      render(<LiveShell page="agents" withFooter />);
    });
    expect(screen.getByLabelText('agents placeholder')).toBeTruthy();
    expect(screen.getByText('Documentation')).toBeTruthy();
  });

  it('LiveShell omits the footer by default', async () => {
    await act(async () => {
      render(<LiveShell />);
    });
    expect(screen.queryByText('Documentation')).toBeNull();
    expect(screen.getByLabelText('overview placeholder')).toBeTruthy();
  });
});
