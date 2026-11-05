import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'bun:test';

import { Divider } from './Divider';

afterEach(cleanup);

describe('Divider', () => {
  it('renders a plain rule as a separator', () => {
    const { container } = render(<Divider />);
    const sep = screen.getByRole('separator');
    expect(sep.textContent).toBe('');
    expect(container.querySelectorAll('span').length).toBe(0);
  });

  it('renders the label between two rules', () => {
    render(<Divider label="or" />);
    const sep = screen.getByRole('separator');
    expect(sep.querySelectorAll('span').length).toBe(3);
    expect(sep.textContent).toBe('or');
  });

  it('merges a custom className', () => {
    render(<Divider className="custom" />);
    expect(screen.getByRole('separator').className).toContain('custom');
  });
});
