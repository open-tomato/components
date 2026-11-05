import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'bun:test';

import { PasswordStrength } from './PasswordStrength';

const segments = (container: HTMLElement): Element[] =>
  Array.from(container.querySelectorAll('span.h-1'));

describe('PasswordStrength', () => {
  it('renders the label and five empty segments at score 0', () => {
    const { container } = render(<PasswordStrength score={0} label="Empty" />);
    expect(screen.getByText('Empty')).toBeTruthy();
    const segs = segments(container);
    expect(segs).toHaveLength(5);
    for (const s of segs) expect(s.className).toContain('bg-cream-300');
  });

  it.each([
    [1, 'bg-danger'],
    [2, 'bg-gold-500'],
    [3, 'bg-gold-500'],
    [4, 'bg-success'],
    [5, 'bg-success'],
  ] as const)('fills %s segments with %s', (score, cls) => {
    const { container } = render(<PasswordStrength score={score} label="x" />);
    const segs = segments(container);
    segs.forEach((s, i) => {
      expect(s.className).toContain(i < score
        ? cls
        : 'bg-cream-300');
    });
  });

  it('forwards className and html attributes', () => {
    render(<PasswordStrength score={2} label="Fair" className="extra" data-testid="ps" />);
    expect(screen.getByTestId('ps').className).toContain('extra');
  });
});
