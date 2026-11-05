import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'bun:test';

import { Avatar } from './Avatar';

afterEach(cleanup);

describe('Avatar', () => {
  it('exposes the name and shows initials', () => {
    render(<Avatar name="Ada Lovelace" />);
    const img = screen.getByRole('img', { name: 'Ada Lovelace' });
    expect(img.textContent).toBe('AL');
  });

  it.each(['sm', 'md', 'lg'] as const)('renders size %s', (size) => {
    render(<Avatar name="Bo" size={size} />);
    expect(screen.getByRole('img', { name: 'Bo' })).toBeTruthy();
  });

  it.each(['circle', 'rounded'] as const)('renders shape %s', (shape) => {
    const { container } = render(<Avatar name="Bo" shape={shape} />);
    expect(container.querySelector('span span')?.className).toContain(
      shape === 'circle'
        ? 'rounded-full'
        : 'rounded-lg',
    );
  });

  it.each(['none', 'online', 'busy', 'away'] as const)('renders status %s', (status) => {
    const { container } = render(<Avatar name="Bo" status={status} />);
    const dot = container.querySelector('[aria-hidden]');
    expect(dot).not.toBeNull();
    expect(dot?.className.includes('hidden')).toBe(status === 'none');
  });

  it('merges a custom className', () => {
    render(<Avatar name="Bo" className="custom" />);
    expect(screen.getByRole('img', { name: 'Bo' }).className).toContain('custom');
  });
});
