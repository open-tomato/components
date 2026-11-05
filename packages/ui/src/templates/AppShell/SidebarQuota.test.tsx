import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'bun:test';
import { act } from 'react';

import { SidebarQuota } from './SidebarQuota';

describe('SidebarQuota', () => {
  it.each(['healthy', 'unhealthy'] as const)('renders the %s status', async (status) => {
    await act(async () => {
      render(<SidebarQuota status={status} used={500} limit={1000} />);
    });
    expect(screen.getByText(status)).toBeTruthy();
    expect(screen.getByText('usage')).toBeTruthy();
  });

  it('renders the title slot and no unit by default', async () => {
    await act(async () => {
      render(<SidebarQuota status="healthy" used={500} limit={1000} title="this week" />);
    });
    expect(screen.getByText('this week')).toBeTruthy();
    expect(screen.getByText('/ 1,000')).toBeTruthy();
  });

  it('uses a custom unit', async () => {
    await act(async () => {
      render(<SidebarQuota status="healthy" used={1} limit={0} unit="credits" />);
    });
    expect(screen.getByText(/credits/)).toBeTruthy();
  });

  it('renders nothing when collapsed', () => {
    const { container } = render(<SidebarQuota status="healthy" used={1} limit={2} collapsed />);
    expect(container.innerHTML).toBe('');
  });
});
