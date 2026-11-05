import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'bun:test';
import { createRef } from 'react';

import { Monogram } from './Monogram';

describe('Monogram', () => {
  it('renders initials with the name as label', () => {
    render(<Monogram name="open-garden" />);
    const el = screen.getByRole('img', { name: 'open-garden' });
    expect(el.textContent).toBe('OG');
  });

  it.each([
    ['market-garden', 'primary', 'lg'],
    ['seed-bank', 'gold', 'md'],
    ['default', 'accent', 'lg'],
  ] as const)('renders %s with tone %s and size %s', (name, tone, size) => {
    render(<Monogram name={name} tone={tone} size={size} />);
    const el = screen.getByRole('img', { name });
    expect((el.textContent ?? '').length).toBeGreaterThan(0);
  });

  it('merges className, forwards props and ref', () => {
    const ref = createRef<HTMLSpanElement>();
    render(<Monogram ref={ref} name="seed-bank" className="extra" data-testid="m" />);
    const el = screen.getByTestId('m');
    expect(el.classList.contains('extra')).toBe(true);
    expect(ref.current).toBe(el);
  });
});
