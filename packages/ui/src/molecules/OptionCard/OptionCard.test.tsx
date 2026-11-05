import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, mock } from 'bun:test';

import { OptionCard } from './OptionCard';

describe('OptionCard', () => {
  it('renders title, description, meta and leading', () => {
    render(
      <OptionCard
        selected={false}
        title="Plan"
        description="Pay as you go"
        meta={<em>New</em>}
        leading={<i data-testid="lead" />}
      />,
    );
    const button = screen.getByRole('button', { name: /Plan/ });
    expect(button.getAttribute('aria-pressed')).toBe('false');
    expect(screen.getByText('Pay as you go')).toBeTruthy();
    expect(screen.getByText('New')).toBeTruthy();
    expect(screen.getByTestId('lead')).toBeTruthy();
  });

  it('shows the check when selected, for both alignments', () => {
    const { container, rerender } = render(<OptionCard selected title="A" description="d" />);
    expect(screen.getByRole('button').getAttribute('aria-pressed')).toBe('true');
    expect(container.querySelector('svg')).not.toBeNull();
    rerender(<OptionCard selected align="start" title="A" description="d" />);
    expect(container.querySelector('svg')).not.toBeNull();
    rerender(<OptionCard selected={false} align="start" title="A" />);
    expect(container.querySelector('svg')).toBeNull();
  });

  it('calls onClick', () => {
    const onClick = mock(() => {});
    render(<OptionCard selected={false} title="A" onClick={onClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
