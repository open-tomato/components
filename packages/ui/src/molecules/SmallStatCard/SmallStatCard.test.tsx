import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'bun:test';

import { Progress } from '../Progress';

import { SmallStatCard } from './SmallStatCard';

describe('SmallStatCard', () => {
  it('formats the value and renders the goal suffix', () => {
    render(<SmallStatCard title="units used" value={1_070_000} goal={4_000_000} locale="en-US" />);
    expect(screen.getByText('units used')).toBeTruthy();
    expect(screen.getByText('1.1M')).toBeTruthy();
    expect(screen.getByText('/ 4M')).toBeTruthy();
  });

  it('renders goal before unit', () => {
    render(<SmallStatCard title="budget" value={5} goal={10} unit="units" locale="en-US" />);
    expect(screen.getByText('/ 10 units')).toBeTruthy();
  });

  it('renders a signed trend', () => {
    render(<SmallStatCard title="items" value={247} trend={0.12} locale="en-US" />);
    expect(screen.getByText('247')).toBeTruthy();
    expect(screen.getByText(/12%/)).toBeTruthy();
  });

  it('trend wins over decoration', () => {
    render(
      <SmallStatCard
        title="x"
        value={1}
        trend={0.5}
        decoration={<span>deco</span>}
        locale="en-US"
      />,
    );
    expect(screen.queryByText('deco')).toBeNull();
  });

  it('renders decoration and unit', () => {
    render(
      <SmallStatCard
        title="live now"
        value={3}
        unit="items"
        decoration={<span>deco</span>}
        locale="en-US"
      />,
    );
    expect(screen.getByText('deco')).toBeTruthy();
    expect(screen.getByText('items')).toBeTruthy();
  });

  it('renders a node value verbatim', () => {
    render(<SmallStatCard title="cost" value={<b>$12.86</b>} locale="en-US" />);
    expect(screen.getByText('$12.86')).toBeTruthy();
  });

  it('renders link and progress footers', () => {
    render(
      <SmallStatCard
        title="errors"
        value={4}
        locale="en-US"
        footer={<a href="#items">View all items</a>}
      />,
    );
    expect(screen.getByRole('link', { name: 'View all items' })).toBeTruthy();
    render(
      <SmallStatCard
        title="budget"
        value={1}
        locale="en-US"
        footer={<Progress value={27} aria-label="27% of budget" />}
      />,
    );
    expect(screen.getByRole('progressbar', { name: '27% of budget' })).toBeTruthy();
  });

  it('renders the compact size without suffix', () => {
    const { container } = render(<SmallStatCard title="calls" value={4_734} size="sm" locale="en-US" />);
    expect(screen.getByText('4.7K')).toBeTruthy();
    expect(container.textContent).not.toContain('/');
  });
});
