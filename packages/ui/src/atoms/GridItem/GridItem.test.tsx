import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'bun:test';
import { createRef } from 'react';

import { GridItem } from './GridItem';

afterEach(cleanup);

describe('GridItem', () => {
  it('renders children and forwards props and ref', () => {
    const ref = createRef<HTMLDivElement>();
    render(<GridItem ref={ref} data-testid="g" className="custom">content</GridItem>);
    const el = screen.getByTestId('g');
    expect(el.textContent).toBe('content');
    expect(el.className).toContain('custom');
    expect(ref.current).toBe(el as HTMLDivElement);
  });

  it('applies span and align variants', () => {
    const { container: a } = render(<GridItem />);
    const { container: b } = render(<GridItem span="2" align="center" />);
    expect((b.firstChild as HTMLElement).className).not.toBe((a.firstChild as HTMLElement).className);
  });
});
