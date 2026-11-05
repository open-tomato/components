import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'bun:test';

import { Badge } from './Badge';

describe('Badge', () => {
  it.each(['success', 'warning', 'danger', 'info', 'neutral', 'accent', 'leaf'] as const)(
    'renders the %s tone',
    (tone) => {
      render(<Badge tone={tone}>label</Badge>);
      expect(screen.getByText('label').tagName).toBe('SPAN');
    },
  );

  it('renders the sm size with a custom class', () => {
    render(<Badge size="sm" className="extra">running</Badge>);
    expect(screen.getByText('running').className).toContain('extra');
  });

  it('renders a hidden dot only when asked', () => {
    const { container, rerender } = render(<Badge>a</Badge>);
    expect(container.querySelector('[aria-hidden]')).toBeNull();
    rerender(<Badge dot>a</Badge>);
    expect(container.querySelector('[aria-hidden]')).not.toBeNull();
  });
});
