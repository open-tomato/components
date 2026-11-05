import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, mock } from 'bun:test';

import { Banner } from './Banner';

afterEach(cleanup);

describe('Banner', () => {
  it.each(['success', 'warning', 'danger', 'info', 'neutral'] as const)(
    'renders the %s tone with its icon',
    (tone) => {
      const { container } = render(<Banner tone={tone}>Body text</Banner>);
      expect(screen.getByText('Body text')).toBeTruthy();
      expect(container.querySelector('svg')).not.toBeNull();
    },
  );

  it('renders without a tone, title, action or dismiss', () => {
    render(<Banner>Plain</Banner>);
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('renders the title', () => {
    render(<Banner title="Heads up">Body</Banner>);
    expect(screen.getByText('Heads up')).toBeTruthy();
  });

  it('fires the action handler', () => {
    const onClick = mock(() => undefined);
    render(<Banner action={{ label: 'Retry', onClick }}>Body</Banner>);
    fireEvent.click(screen.getByRole('button', { name: 'Retry' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('fires onClose from the dismiss button', () => {
    const onClose = mock(() => undefined);
    render(<Banner onClose={onClose}>Body</Banner>);
    fireEvent.click(screen.getByRole('button', { name: 'Dismiss' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
