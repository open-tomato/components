import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, mock } from 'bun:test';

import { Segmented } from './Segmented';

const items = [
  { key: 'a', label: 'Day' },
  { key: 'b', label: 'Week' },
  { key: 'c', label: 'Month' },
];

describe('Segmented', () => {
  it('marks the active tab as selected', () => {
    render(<Segmented items={items} index={1} size="sm" />);
    expect(screen.getAllByRole('tab')).toHaveLength(3);
    expect(
      screen.getByRole('tab', { name: 'Week' }).getAttribute('aria-selected'),
    ).toBe('true');
    expect(
      screen.getByRole('tab', { name: 'Day' }).getAttribute('aria-selected'),
    ).toBe('false');
  });

  it('calls onChange with the clicked index', () => {
    const onChange = mock((_: number) => {});
    render(<Segmented items={items} index={0} onChange={onChange} />);
    fireEvent.click(screen.getByRole('tab', { name: 'Month' }));
    expect(onChange).toHaveBeenCalledWith(2);
  });

  it('does not throw on click without onChange', () => {
    render(<Segmented items={items} index={0} />);
    fireEvent.click(screen.getByRole('tab', { name: 'Week' }));
    expect(screen.getByRole('tablist')).toBeTruthy();
  });
});
