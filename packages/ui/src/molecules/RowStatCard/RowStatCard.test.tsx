import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'bun:test';

import { RowStatCard } from './RowStatCard';
import { RowStatCardMeter } from './RowStatCardMeter';

describe('RowStatCard', () => {
  it('renders title only', () => {
    render(<RowStatCard title="Budget" />);
    expect(screen.getByText('Budget')).toBeTruthy();
  });

  it('renders subtitle, stats, action and footer', () => {
    render(
      <RowStatCard
        title="Budget"
        subtitle="Monthly"
        stats={[
          { title: 'Spent', value: '$10', trend: 1 },
          { title: 'Left', value: '$5', trend: -1 },
          { title: 'Flat', value: '$0', trend: 0 },
          { title: 'Forced', value: '$1', trend: 1, tone: 'danger' },
        ]}
        action={<button type="button">Adjust</button>}
        footer={<p>note</p>}
      />,
    );
    expect(screen.getByText('Monthly')).toBeTruthy();
    expect(screen.getByText('$10')).toBeTruthy();
    expect(screen.getByText('$5')).toBeTruthy();
    expect(screen.getByText('Forced')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Adjust' })).toBeTruthy();
    expect(screen.getByText('note')).toBeTruthy();
  });
});

describe('RowStatCardMeter', () => {
  it('renders a clamped meter with default label', () => {
    render(<RowStatCardMeter value={2} />);
    const meter = screen.getByRole('meter', { name: '100% used' });
    expect(meter.getAttribute('aria-valuenow')).toBe('100');
  });

  it('renders captions and marker', () => {
    render(
      <RowStatCardMeter
        value={0.4}
        label="Usage"
        startLabel="May 1"
        endLabel="May 31"
        marker={{ ratio: 0.99, label: 'Forecast' }}
      />,
    );
    expect(screen.getByRole('meter', { name: 'Usage' })).toBeTruthy();
    expect(screen.getByText('May 1')).toBeTruthy();
    expect(screen.getByText('May 31')).toBeTruthy();
    expect(screen.getByText('↑ Forecast')).toBeTruthy();
  });
});
