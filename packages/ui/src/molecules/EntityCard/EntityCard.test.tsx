import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, mock } from 'bun:test';

import { EntityCard } from './EntityCard';
import { EntityCardGrid } from './EntityCardGrid';

afterEach(cleanup);

describe('EntityCard', () => {
  it('renders a plain heading when not openable', () => {
    render(<EntityCard title="Billing">Body</EntityCard>);
    expect(screen.getByRole('heading', { name: 'Billing' })).toBeTruthy();
    expect(screen.queryByRole('button')).toBeNull();
    expect(screen.getByText('Body')).toBeTruthy();
  });

  it('renders badges, meta, control and action slots', () => {
    render(
      <EntityCard
        title="Billing"
        badges={<span>Badge</span>}
        meta={<span>Meta</span>}
        control={<span>Control</span>}
        action={<span>Action</span>}
      />,
    );
    for (const t of ['Badge', 'Meta', 'Control', 'Action']) {
      expect(screen.getByText(t)).toBeTruthy();
    }
  });

  it('makes the title a button that fires onOpen', () => {
    const onOpen = mock(() => undefined);
    render(<EntityCard title="Billing" onOpen={onOpen} />);
    fireEvent.click(screen.getByRole('button', { name: 'Billing' }));
    expect(onOpen).toHaveBeenCalledTimes(1);
  });
});

describe('EntityCardGrid', () => {
  it('renders children for each min and gap', () => {
    const { container } = render(
      <EntityCardGrid min="lg" gap="sm">
        <span>One</span>
      </EntityCardGrid>,
    );
    expect(screen.getByText('One')).toBeTruthy();
    expect((container.firstChild as HTMLElement).className).toContain('340px');
  });

  it('uses default variants', () => {
    const { container } = render(<EntityCardGrid />);
    expect((container.firstChild as HTMLElement).className).toContain('300px');
  });
});
