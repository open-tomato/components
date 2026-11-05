import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, mock } from 'bun:test';

import { DecoratedToggle, DecoratedToggleList } from './DecoratedToggle';

describe('DecoratedToggle', () => {
  it('renders title, description, meta and decoration', () => {
    render(
      <DecoratedToggle
        title="search"
        description="Find things"
        meta={<span>recommended</span>}
        decoration={<span>D</span>}
        checked
      />,
    );
    const sw = screen.getByRole('switch', { name: /search/ });
    expect(sw.getAttribute('aria-checked')).toBe('true');
    expect(screen.getByText('Find things')).toBeTruthy();
    expect(screen.getByText('recommended')).toBeTruthy();
    expect(screen.getByText('D')).toBeTruthy();
  });

  it('toggles on click', () => {
    const onChange = mock((_c: boolean) => {});
    render(<DecoratedToggle title="search" checked={false} onChange={onChange} />);
    fireEvent.click(screen.getByRole('switch'));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('does not fire when disabled', () => {
    const onChange = mock((_c: boolean) => {});
    render(<DecoratedToggle title="search" checked={false} disabled onChange={onChange} />);
    fireEvent.click(screen.getByRole('switch'));
    expect(onChange).not.toHaveBeenCalled();
  });
});

describe('DecoratedToggleList', () => {
  const options = [
    { id: 'a', title: 'Alpha' },
    { id: 'b', title: 'Beta', disabled: true },
  ];

  it('shows the x/y-on indicator and each switch state', () => {
    render(<DecoratedToggleList title="Tools" options={options} value={['a']} onChange={() => {}} />);
    expect(screen.getByText('Tools')).toBeTruthy();
    expect(screen.getByText('1/2')).toBeTruthy();
    expect(screen.getByRole('switch', { name: 'Alpha' }).getAttribute('aria-checked')).toBe('true');
    expect((screen.getByRole('switch', { name: 'Beta' }) as HTMLButtonElement).disabled).toBe(true);
  });

  it('adds and removes ids', () => {
    const onChange = mock((_v: string[]) => {});
    const two = [{ id: 'a', title: 'Alpha' }, { id: 'b', title: 'Beta' }];
    render(<DecoratedToggleList title="Tools" options={two} value={['a']} onChange={onChange} />);
    fireEvent.click(screen.getByRole('switch', { name: 'Beta' }));
    expect(onChange).toHaveBeenLastCalledWith(['a', 'b']);
    fireEvent.click(screen.getByRole('switch', { name: 'Alpha' }));
    expect(onChange).toHaveBeenLastCalledWith([]);
  });
});
