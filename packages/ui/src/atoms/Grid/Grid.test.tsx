import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'bun:test';
import { createRef } from 'react';

import { Grid } from './Grid';

describe('Grid', () => {
  it('renders children with default auto columns and md gap', () => {
    render(<Grid data-testid="g"><span>One</span></Grid>);
    const grid = screen.getByTestId('g');
    expect(grid.textContent).toBe('One');
    expect(grid.className).toContain('grid');
    expect(grid.className).toContain('minmax(180px,1fr)');
    expect(grid.className).toContain('gap-4');
  });

  it.each(['1', '2', '3', '4'] as const)('applies cols %s', (cols) => {
    render(<Grid data-testid="g" cols={cols} />);
    expect(screen.getByTestId('g').className).toContain(`grid-cols-${cols}`);
  });

  it.each([
    ['sm', 'gap-3'],
    ['md', 'gap-4'],
    ['lg', 'gap-6'],
  ] as const)('applies gap %s', (gap, cls) => {
    render(<Grid data-testid="g" gap={gap} />);
    expect(screen.getByTestId('g').className).toContain(cls);
  });

  it('merges className and forwards ref', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Grid ref={ref} data-testid="g" className="extra" />);
    expect(screen.getByTestId('g').className).toContain('extra');
    expect(ref.current === screen.getByTestId('g')).toBe(true);
  });
});
