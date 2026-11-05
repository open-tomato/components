import { render } from '@testing-library/react';
import { describe, expect, it } from 'bun:test';

import { Skeleton } from './Skeleton';

describe('Skeleton', () => {
  it('renders a hidden placeholder with the given class', () => {
    const { container } = render(<Skeleton className="w-[55%]" />);
    const el = container.firstElementChild as HTMLElement;
    expect(el.getAttribute('aria-hidden')).toBe('true');
    expect(el.className).toContain('w-[55%]');
  });

  it('renders several list rows', () => {
    const { container } = render(
      <div>
        {[0, 1, 2].map((i) => <Skeleton key={i} />)}
      </div>,
    );
    expect(container.querySelectorAll('[aria-hidden="true"]').length).toBe(3);
  });
});
