import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'bun:test';
import { createRef } from 'react';

import { Icon } from './Icon';

describe('Icon', () => {
  it('is decorative without a label', () => {
    render(<Icon name="terminal" data-testid="i" />);
    expect(screen.getByTestId('i').getAttribute('aria-hidden')).toBe('true');
    expect(screen.queryByRole('img')).toBeNull();
  });

  it('exposes an img role with a label', () => {
    render(<Icon name="terminal" label="Terminal" />);
    expect(screen.getByRole('img', { name: 'Terminal' })).toBeTruthy();
  });

  it('shows a pending placeholder, then the lazy glyph at the given size', async () => {
    const { container } = render(
      <Icon name="git-branch" size={28} strokeWidth={2} label="Branch" />,
    );
    await waitFor(() => {
      expect(container.querySelector('svg')).not.toBeNull();
    });
    const svg = container.querySelector('svg')!;
    expect(svg.getAttribute('width')).toBe('28');
    expect(svg.getAttribute('stroke-width')).toBe('2');
    expect(container.querySelector('[data-glyph-pending]')).toBeNull();
  });

  it('renders a sized placeholder for an unknown name', () => {
    const { container } = render(
      <Icon name={'no-such-icon-xyz' as never} size={20} />,
    );
    const ph = container.querySelector('span span') as HTMLElement;
    expect(ph.style.width).toBe('20px');
    expect(ph.hasAttribute('data-glyph-pending')).toBe(false);
  });

  it.each(['inherit', 'accent', 'success', 'warning', 'danger', 'info', 'muted'] as const)(
    'renders accent %s',
    (accent) => {
      render(<Icon name="zap" accent={accent} data-testid="i" />);
      expect(screen.getByTestId('i').className).not.toBe('');
    },
  );

  it.each(['none', 'soft', 'accent', 'success', 'warning', 'danger', 'info'] as const)(
    'renders bg %s and merges className',
    (bg) => {
      const ref = createRef<HTMLSpanElement>();
      render(<Icon ref={ref} name="zap" bg={bg} className="extra" data-testid="i" />);
      expect(screen.getByTestId('i').className).toContain('extra');
      expect(ref.current).toBe(screen.getByTestId('i'));
    },
  );
});
