import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'bun:test';

import { EmptyState } from './EmptyState';

afterEach(cleanup);

describe('EmptyState', () => {
  it('renders the title only by default', () => {
    render(<EmptyState title="No items" />);
    expect(screen.getByText('No items')).toBeTruthy();
  });

  it('renders description and action', () => {
    render(
      <EmptyState title="t" description="Nothing here" action={<button type="button">New item</button>} />,
    );
    expect(screen.getByText('Nothing here')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'New item' })).toBeTruthy();
  });

  it('renders the illustration slot only when given', () => {
    const { rerender } = render(<EmptyState title="t" data-testid="es" />);
    expect(screen.getByTestId('es').querySelector('[data-slot="art"]')).toBeNull();
    rerender(<EmptyState title="t" data-testid="es" illustration={<i data-slot="art" />} />);
    expect(screen.getByTestId('es').querySelector('[data-slot="art"]')).toBeTruthy();
  });

  it.each(['sm', 'md', 'lg'] as const)('renders the %s size', (size) => {
    render(<EmptyState title={`s-${size}`} size={size} />);
    expect(screen.getByText(`s-${size}`)).toBeTruthy();
  });

  it('renders start alignment and passes props through', () => {
    render(<EmptyState title="t" align="start" className="extra" data-testid="es" />);
    expect(screen.getByTestId('es').className).toContain('extra');
  });
});
