import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'bun:test';

import { Content } from './Content';

describe('Content', () => {
  it('renders children in a column by default', () => {
    render(<Content data-testid="c">hi</Content>);
    const el = screen.getByTestId('c');
    expect(el.textContent).toBe('hi');
    expect(el.className).toContain('flex-col');
  });

  it('applies layout variants', () => {
    render(
      <Content data-testid="c" direction="row" gap="xl" align="center" justify="between" wrap className="extra">
        x
      </Content>,
    );
    const cls = screen.getByTestId('c').className;
    for (const c of ['flex-row', 'gap-6', 'items-center', 'justify-between', 'flex-wrap', 'extra']) {
      expect(cls).toContain(c);
    }
  });
});
