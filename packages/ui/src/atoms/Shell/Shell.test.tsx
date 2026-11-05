import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'bun:test';
import { createRef } from 'react';

import { Shell } from './Shell';

afterEach(cleanup);

describe('Shell', () => {
  it('renders children and forwards props and ref', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Shell ref={ref} data-testid="s" className="custom">content</Shell>);
    const el = screen.getByTestId('s');
    expect(el.textContent).toBe('content');
    expect(el.className).toContain('custom');
    expect(ref.current).toBe(el as HTMLDivElement);
  });

  it('applies variant classes', () => {
    const { container: a } = render(<Shell />);
    const { container: b } = render(<Shell padding="none" bordered rounded="xl" />);
    expect((b.firstChild as HTMLElement).className).not.toBe((a.firstChild as HTMLElement).className);
  });
});
