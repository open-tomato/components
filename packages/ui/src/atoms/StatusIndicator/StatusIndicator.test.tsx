import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'bun:test';
import { createRef } from 'react';

import { StatusIndicator } from './StatusIndicator';

afterEach(cleanup);

describe('StatusIndicator', () => {
  it('exposes a labelled status role', () => {
    render(<StatusIndicator label="running" />);
    const el = screen.getByRole('status', { name: 'running' });
    expect(el.getAttribute('aria-hidden')).toBeNull();
  });

  it('is decorative without a label', () => {
    const { container } = render(<StatusIndicator />);
    const el = container.firstElementChild as HTMLElement;
    expect(el.getAttribute('aria-hidden')).toBe('true');
    expect(screen.queryByRole('status')).toBeNull();
  });

  it('renders every tone', () => {
    const tones = ['ok', 'warn', 'err', 'info', 'disabled'] as const;
    for (const tone of tones) {
      render(<StatusIndicator tone={tone} label={tone} />);
      expect(screen.getByRole('status', { name: tone })).toBeTruthy();
    }
  });

  it('renders shapes and sizes', () => {
    render(
      <>
        <StatusIndicator shape="circle" label="circle" />
        <StatusIndicator shape="square" label="square" />
        <StatusIndicator size="sm" label="small" />
        <StatusIndicator size="md" label="medium" />
        <StatusIndicator size="lg" label="large" />
      </>,
    );
    expect(screen.getAllByRole('status')).toHaveLength(5);
  });

  it('renders the pulse variant', () => {
    render(<StatusIndicator pulse label="running" />);
    const plain = render(<StatusIndicator label="idle" />);
    expect(screen.getByRole('status', { name: 'running' }).className)
      .not.toBe(plain.getByRole('status', { name: 'idle' }).className);
  });

  it('merges className and forwards ref', () => {
    const ref = createRef<HTMLSpanElement>();
    render(<StatusIndicator ref={ref} className="custom" label="x" />);
    expect(ref.current?.className).toContain('custom');
  });
});
