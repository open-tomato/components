import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, mock } from 'bun:test';

import { Switch } from './Switch';

describe('Switch', () => {
  it('renders an unchecked switch by default', () => {
    render(<Switch aria-label="Wifi" />);
    const el = screen.getByRole('switch', { name: 'Wifi' });
    expect(el.getAttribute('aria-checked')).toBe('false');
    expect(el.hasAttribute('data-on')).toBe(false);
  });

  it('renders checked state', () => {
    render(<Switch aria-label="Wifi" checked />);
    const el = screen.getByRole('switch', { name: 'Wifi' });
    expect(el.getAttribute('aria-checked')).toBe('true');
    expect(el.hasAttribute('data-on')).toBe(true);
  });

  it('calls onChange with the toggled value', () => {
    const onChange = mock((_checked: boolean) => undefined);
    const { rerender } = render(<Switch aria-label="Wifi" onChange={onChange} />);
    fireEvent.click(screen.getByRole('switch'));
    expect(onChange).toHaveBeenLastCalledWith(true);
    rerender(<Switch aria-label="Wifi" checked onChange={onChange} />);
    fireEvent.click(screen.getByRole('switch'));
    expect(onChange).toHaveBeenLastCalledWith(false);
  });

  it('does not throw without onChange and merges className', () => {
    render(<Switch aria-label="Wifi" className="extra" size="sm" tone="accent" />);
    const el = screen.getByRole('switch');
    fireEvent.click(el);
    expect(el.className).toContain('extra');
  });
});
