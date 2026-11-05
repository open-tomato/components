import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, mock } from 'bun:test';

import { RadioGroup } from './RadioGroup';

const options = [
  { value: 'a', label: 'Alpha' },
  { value: 'b', label: 'Beta', hint: 'Second' },
];

describe('RadioGroup', () => {
  it('renders a labelled group with the checked option', () => {
    render(<RadioGroup options={options} value="b" onChange={() => {}} ariaLabel="Letters" />);
    expect(screen.getByRole('radiogroup', { name: 'Letters' })).toBeTruthy();
    expect(screen.getByRole('radio', { name: 'Alpha' }).getAttribute('aria-checked')).toBe('false');
    expect(screen.getByRole('radio', { name: /Beta/ }).getAttribute('aria-checked')).toBe('true');
    expect(screen.getByText('Second')).toBeTruthy();
  });

  it('reports the picked value', () => {
    const onChange = mock((_v: string) => {});
    render(<RadioGroup options={options} value="b" onChange={onChange} />);
    fireEvent.click(screen.getByRole('radio', { name: 'Alpha' }));
    expect(onChange).toHaveBeenCalledWith('a');
  });
});
