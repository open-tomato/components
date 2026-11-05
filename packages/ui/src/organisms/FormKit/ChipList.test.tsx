import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, mock } from 'bun:test';

import { ChipList } from './ChipList';

const options = [
  { value: 'a', label: 'Apple' },
  { value: 'b', label: 'Banana' },
  { value: 'c', label: 'Apricot' },
];

describe('ChipList', () => {
  it('renders selected chips and an empty combobox', () => {
    render(<ChipList options={options} value={['a']} onChange={() => {}} ariaLabel="Fruit" />);
    expect(screen.getByText('Apple')).toBeTruthy();
    expect(screen.getByRole('combobox', { name: 'Fruit' }).getAttribute('aria-expanded')).toBe('false');
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  it('suggests matches excluding selected, first preselected', () => {
    render(<ChipList options={options} value={['a']} onChange={() => {}} ariaLabel="Fruit" />);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'ap' } });
    const opts = screen.getAllByRole('option');
    expect(opts).toHaveLength(1);
    expect(opts[0]?.textContent).toBe('Apricot');
    expect(opts[0]?.getAttribute('aria-selected')).toBe('true');
  });

  it('shows an empty message when nothing matches', () => {
    render(<ChipList options={options} value={[]} onChange={() => {}} />);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'zzz' } });
    expect(screen.getByText('No matches.')).toBeTruthy();
  });

  it('picks the active row with Enter and moves with arrows', () => {
    const onChange = mock((_v: string[]) => {});
    render(<ChipList options={options} value={[]} onChange={onChange} />);
    const input = screen.getByRole('combobox');
    fireEvent.change(input, { target: { value: 'ap' } });
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onChange).toHaveBeenCalledWith(['c']);
  });

  it('closes on Escape', () => {
    render(<ChipList options={options} value={[]} onChange={() => {}} />);
    const input = screen.getByRole('combobox');
    fireEvent.change(input, { target: { value: 'ap' } });
    fireEvent.keyDown(input, { key: 'Escape' });
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  it('picks by click', () => {
    const onChange = mock((_v: string[]) => {});
    render(<ChipList options={options} value={[]} onChange={onChange} />);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'ban' } });
    fireEvent.click(screen.getByRole('option', { name: 'Banana' }));
    expect(onChange).toHaveBeenCalledWith(['b']);
  });

  it('removes a chip via its X', () => {
    const onChange = mock((_v: string[]) => {});
    render(<ChipList options={options} value={['a', 'b']} onChange={onChange} />);
    fireEvent.click(screen.getAllByRole('button', { name: 'Remove' })[0] as HTMLElement);
    expect(onChange).toHaveBeenCalledWith(['b']);
  });

  it('single mode hides the input once a chip is chosen', () => {
    render(<ChipList options={options} value={['a']} onChange={() => {}} mode="single" />);
    expect(screen.queryByRole('combobox')).toBeNull();
  });

  it('single mode replaces the value on pick', () => {
    const onChange = mock((_v: string[]) => {});
    render(<ChipList options={options} value={[]} onChange={onChange} mode="single" />);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'ban' } });
    fireEvent.keyDown(screen.getByRole('combobox'), { key: 'Enter' });
    expect(onChange).toHaveBeenCalledWith(['b']);
  });

  it('allowNew offers typed text first and creates it', () => {
    const onChange = mock((_v: string[]) => {});
    render(<ChipList options={options} value={[]} onChange={onChange} allowNew />);
    const input = screen.getByRole('combobox');
    fireEvent.change(input, { target: { value: 'Kiwi' } });
    expect(screen.getByText('new')).toBeTruthy();
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onChange).toHaveBeenCalledWith(['Kiwi']);
  });

  it('allowNew does not offer an exact match', () => {
    render(<ChipList options={options} value={[]} onChange={() => {}} allowNew />);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'banana' } });
    expect(screen.queryByText('new')).toBeNull();
  });
});
