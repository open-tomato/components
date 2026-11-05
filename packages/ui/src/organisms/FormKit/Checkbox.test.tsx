import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, mock } from 'bun:test';

import { Checkbox, CheckGroup } from './Checkbox';

describe('Checkbox', () => {
  it('renders label, hint and checked state', () => {
    render(<Checkbox checked label="Email me" hint="Weekly" onChange={() => {}} />);
    const box = screen.getByRole('checkbox', { name: /Email me/ });
    expect(box.getAttribute('aria-checked')).toBe('true');
    expect(screen.getByText('Weekly')).toBeTruthy();
  });

  it('toggles on click', () => {
    const onChange = mock((_c: boolean) => {});
    render(<Checkbox checked={false} label="Email me" onChange={onChange} />);
    fireEvent.click(screen.getByRole('checkbox'));
    expect(onChange).toHaveBeenCalledWith(true);
  });
});

describe('CheckGroup', () => {
  const options = [
    { value: 'a', label: 'Alpha' },
    { value: 'b', label: 'Beta', hint: 'Second' },
  ];

  it('renders every option with its checked state', () => {
    render(<CheckGroup options={options} value={['b']} onChange={() => {}} columns={2} />);
    expect(screen.getByRole('checkbox', { name: 'Alpha' }).getAttribute('aria-checked')).toBe('false');
    expect(screen.getByRole('checkbox', { name: /Beta/ }).getAttribute('aria-checked')).toBe('true');
  });

  it('adds and removes values', () => {
    const onChange = mock((_v: string[]) => {});
    render(<CheckGroup options={options} value={['b']} onChange={onChange} />);
    fireEvent.click(screen.getByRole('checkbox', { name: 'Alpha' }));
    expect(onChange).toHaveBeenLastCalledWith(['b', 'a']);
    fireEvent.click(screen.getByRole('checkbox', { name: /Beta/ }));
    expect(onChange).toHaveBeenLastCalledWith([]);
  });
});
