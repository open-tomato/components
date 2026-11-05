import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'bun:test';

import { TrendIndicator } from './TrendIndicator';

describe('TrendIndicator', () => {
  it('renders an up trend with a synthesized label', () => {
    render(<TrendIndicator trend={0.1} />);
    expect(screen.getByRole('img').getAttribute('aria-label')).toContain('trending up');
  });

  it('renders a down trend', () => {
    render(<TrendIndicator trend={-0.3} />);
    expect(screen.getByRole('img').getAttribute('aria-label')).toContain('trending down');
  });

  it('renders the flat state and hides it with showZero=false', () => {
    const { container, rerender } = render(<TrendIndicator trend={0} showValue />);
    expect(screen.getByRole('img', { name: 'no change' })).toBeTruthy();
    expect(screen.getByRole('img').textContent).toBe('');
    rerender(<TrendIndicator trend={0} showZero={false} />);
    expect(container.firstChild).toBeNull();
  });

  it('shows the signed value and honours a custom label', () => {
    render(<TrendIndicator trend={0.1} showValue label="Growth" className="extra" />);
    const el = screen.getByRole('img', { name: 'Growth' });
    expect(el.className).toContain('extra');
    expect(el.textContent).toContain('10');
  });
});
