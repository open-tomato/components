import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, mock } from 'bun:test';

import { Toast } from './Toast';

afterEach(cleanup);

describe('Toast', () => {
  it('renders its message in a status region', () => {
    render(<Toast>Saved</Toast>);
    expect(screen.getByRole('status').textContent).toContain('Saved');
  });

  it.each(['success', 'warning', 'danger', 'info', 'neutral'] as const)('renders the %s tone', (tone) => {
    render(<Toast tone={tone}>Message</Toast>);
    expect(screen.getByRole('status')).toBeTruthy();
  });

  it('renders floating and merges className', () => {
    render(<Toast floating className="extra">Floating</Toast>);
    expect(screen.getByRole('status').className).toContain('extra');
  });

  it('has no dismiss button without onClose', () => {
    render(<Toast>Saved</Toast>);
    expect(screen.queryByRole('button', { name: 'Dismiss' })).toBeNull();
  });

  it('calls onClose when dismissed', () => {
    const onClose = mock(() => undefined);
    render(<Toast onClose={onClose}>Saved</Toast>);
    fireEvent.click(screen.getByRole('button', { name: 'Dismiss' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
