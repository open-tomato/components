import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'bun:test';
import { createRef } from 'react';

import { SectionCard } from './SectionCard';

afterEach(cleanup);

describe('SectionCard', () => {
  it('renders only the body without title or action', () => {
    const { container } = render(<SectionCard>Body</SectionCard>);
    expect(screen.getByText('Body')).toBeTruthy();
    expect(container.querySelector('header')).toBeNull();
  });

  it('renders title, subtitle, action and footer', () => {
    render(
      <SectionCard
        title="Usage"
        subtitle="Last 7 days"
        action={<button type="button">Filter</button>}
        footer="Updated now"
        footerDivider
      >
        Chart
      </SectionCard>,
    );
    expect(screen.getByText('Usage')).toBeTruthy();
    expect(screen.getByText('Last 7 days')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Filter' })).toBeTruthy();
    expect(screen.getByText('Updated now')).toBeTruthy();
  });

  it('renders the header for an action alone', () => {
    const { container } = render(
      <SectionCard action={<span>A</span>}>B</SectionCard>,
    );
    expect(container.querySelector('header')).not.toBeNull();
  });

  it('supports padded=false and forwards ref and props', () => {
    const ref = createRef<HTMLElement>();
    render(
      <SectionCard ref={ref} padded={false} data-testid="card">
        B
      </SectionCard>,
    );
    expect(ref.current).toBe(screen.getByTestId('card'));
  });
});
