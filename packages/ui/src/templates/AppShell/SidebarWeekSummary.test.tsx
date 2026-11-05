import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'bun:test';
import { act } from 'react';

import { SidebarWeekSummary } from './SidebarWeekSummary';

describe('SidebarWeekSummary', () => {
  it.each(['healthy', 'unhealthy'] as const)('renders the %s status', async (status) => {
    await act(async () => {
      render(<SidebarWeekSummary status={status} used={500} limit={1000} />);
    });
    expect(screen.getByText(status)).toBeTruthy();
    expect(screen.getByText('this week')).toBeTruthy();
    expect(screen.getByText(/tokens/)).toBeTruthy();
  });

  it('uses a custom unit', async () => {
    await act(async () => {
      render(<SidebarWeekSummary status="healthy" used={1} limit={0} unit="credits" />);
    });
    expect(screen.getByText(/credits/)).toBeTruthy();
  });

  it('renders nothing when collapsed', () => {
    const { container } = render(<SidebarWeekSummary status="healthy" used={1} limit={2} collapsed />);
    expect(container.innerHTML).toBe('');
  });
});
