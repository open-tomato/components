import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'bun:test';

import { Sparkline } from './Sparkline';

describe('Sparkline', () => {
  it('renders nothing for fewer than two points', () => {
    const { container } = render(<Sparkline data={[1]} />);
    expect(container.firstChild).toBeNull();
  });

  it('is decorative without a label', () => {
    const { container } = render(<Sparkline data={[1, 2, 3]} />);
    expect(container.querySelector('svg')?.getAttribute('aria-hidden')).toBe('true');
    expect(screen.queryByRole('img')).toBeNull();
  });

  it('exposes an image role with a label', () => {
    render(<Sparkline data={[3, 1, 2]} label="trend" tone="success" size="sm" />);
    expect(screen.getByRole('img', { name: 'trend' })).toBeTruthy();
  });

  it('draws the area fill only when fill is on', () => {
    const { container, rerender } = render(<Sparkline data={[1, 2]} />);
    expect(container.querySelectorAll('path')).toHaveLength(2);
    rerender(<Sparkline data={[1, 2]} fill={false} />);
    expect(container.querySelectorAll('path')).toHaveLength(1);
  });

  it('handles a flat series', () => {
    const { container } = render(<Sparkline data={[5, 5, 5]} />);
    expect(container.querySelector('path')?.getAttribute('d')).toContain('M0.0');
  });
});
