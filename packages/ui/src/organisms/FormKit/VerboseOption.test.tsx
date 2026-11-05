import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, mock } from 'bun:test';

import { VerboseOption, VerboseOptionList } from './VerboseOption';

describe('VerboseOption', () => {
  it('renders as a radio with label, badges, description and meta', () => {
    render(
      <VerboseOption
        selected
        label="model-x"
        badges={['fast', <b key="n">custom</b>]}
        description="Quick"
        meta="$1 / M"
      />,
    );
    const r = screen.getByRole('radio', { name: /model-x/ });
    expect(r.getAttribute('aria-checked')).toBe('true');
    expect(screen.getByText('fast')).toBeTruthy();
    expect(screen.getByText('custom')).toBeTruthy();
    expect(screen.getByText('Quick')).toBeTruthy();
    expect(screen.getByText('$1 / M')).toBeTruthy();
  });

  it('renders as a checkbox in checkbox mode', () => {
    render(<VerboseOption mode="checkbox" selected={false} label="opt" />);
    expect(screen.getByRole('checkbox').getAttribute('aria-checked')).toBe('false');
  });

  it('selects on click unless disabled', () => {
    const onSelect = mock(() => {});
    const { rerender } = render(<VerboseOption selected={false} label="opt" onSelect={onSelect} />);
    fireEvent.click(screen.getByRole('radio'));
    expect(onSelect).toHaveBeenCalledTimes(1);
    rerender(<VerboseOption selected={false} label="opt" disabled onSelect={onSelect} />);
    fireEvent.click(screen.getByRole('radio'));
    expect(onSelect).toHaveBeenCalledTimes(1);
  });
});

describe('VerboseOptionList', () => {
  const options = [
    { value: 'a', label: 'Alpha', description: 'First' },
    { value: 'b', label: 'Beta' },
  ];

  it('radio mode: radiogroup that picks one value', () => {
    const onChange = mock((_v: string) => {});
    render(<VerboseOptionList options={options} value="a" onChange={onChange} ariaLabel="Models" />);
    expect(screen.getByRole('radiogroup', { name: 'Models' })).toBeTruthy();
    expect(screen.getByRole('radio', { name: /Alpha/ }).getAttribute('aria-checked')).toBe('true');
    fireEvent.click(screen.getByRole('radio', { name: 'Beta' }));
    expect(onChange).toHaveBeenCalledWith('b');
  });

  it('checkbox mode: group that toggles values', () => {
    const onChange = mock((_v: string[]) => {});
    render(<VerboseOptionList mode="checkbox" options={options} value={['a']} onChange={onChange} ariaLabel="Models" />);
    expect(screen.getByRole('group', { name: 'Models' })).toBeTruthy();
    fireEvent.click(screen.getByRole('checkbox', { name: 'Beta' }));
    expect(onChange).toHaveBeenLastCalledWith(['a', 'b']);
    fireEvent.click(screen.getByRole('checkbox', { name: /Alpha/ }));
    expect(onChange).toHaveBeenLastCalledWith([]);
  });
});
