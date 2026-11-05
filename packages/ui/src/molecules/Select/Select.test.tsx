import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, mock } from 'bun:test';

import { Select } from './Select';

const options = [
  { value: 'a', label: 'Alpha', icon: <i data-testid="ic" /> },
  { value: 'b', label: 'Beta' },
];

describe('Select', () => {
  it('shows the selected option label and icon', () => {
    render(
      <Select value="a" options={options} onChange={() => {}} ariaLabel="Pick" />,
    );
    const trigger = screen.getByRole('button', { name: 'Pick' });
    expect(trigger.textContent).toContain('Alpha');
    expect(screen.getByTestId('ic')).toBeTruthy();
  });

  it('falls back to the first option for an unknown value', () => {
    render(
      <Select value="zzz" options={options} onChange={() => {}} ariaLabel="Pick" size="sm" />,
    );
    expect(screen.getByRole('button', { name: 'Pick' }).textContent).toContain('Alpha');
  });

  it('shows placeholder with no options', () => {
    render(<Select value="" options={[]} onChange={() => {}} ariaLabel="Pick" />);
    expect(screen.getByRole('button', { name: 'Pick' }).textContent).toContain('Select…');
  });

  it('opens and reports the chosen option', async () => {
    const onChange = mock((_: string) => {});
    render(
      <Select value="a" options={options} onChange={onChange} ariaLabel="Pick" width={100} />,
    );
    const trigger = screen.getByRole('button', { name: 'Pick' });
    fireEvent.keyDown(trigger, { key: 'ArrowDown' });
    const item = await screen.findByRole('menuitemradio', { name: 'Beta' });
    fireEvent.click(item);
    expect(onChange).toHaveBeenCalledWith('b');
  });
});
