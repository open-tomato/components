import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'bun:test';

import { Progress } from './Progress';

describe('Progress', () => {
  it('renders determinate value and fill width', () => {
    render(<Progress value={34} aria-label="Token budget" />);
    const bar = screen.getByRole('progressbar', { name: 'Token budget' });
    expect(bar.getAttribute('aria-valuenow')).toBe('34');
    expect((bar.firstElementChild as HTMLElement).style.width).toBe('34%');
  });

  it('clamps out-of-range values', () => {
    render(<Progress value={150} aria-label="over" />);
    const bar = screen.getByRole('progressbar', { name: 'over' });
    expect((bar.firstElementChild as HTMLElement).style.width).toBe('100%');
  });

  it('renders the danger tone', () => {
    render(<Progress value={92} tone="danger" aria-label="Token budget" />);
    const bar = screen.getByRole('progressbar');
    expect(bar.firstElementChild?.className).toContain('bg-danger');
  });

  it('renders indeterminate without value or width', () => {
    render(<Progress indeterminate aria-label="Working" />);
    const bar = screen.getByRole('progressbar', { name: 'Working' });
    expect(bar.hasAttribute('aria-valuenow')).toBe(false);
    expect((bar.firstElementChild as HTMLElement).style.width).toBe('');
  });
});
