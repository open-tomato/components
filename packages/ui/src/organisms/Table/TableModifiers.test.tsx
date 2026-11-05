import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, mock } from 'bun:test';

import { TableRowCheckbox, TableSortHandle } from './TableModifiers';

afterEach(cleanup);

describe('TableRowCheckbox', () => {
  it('reflects checked, unchecked and mixed states', () => {
    const { rerender } = render(<TableRowCheckbox checked={false} onChange={() => {}} label="Pick" />);
    expect(screen.getByRole('checkbox', { name: 'Pick' }).getAttribute('aria-checked')).toBe('false');
    rerender(<TableRowCheckbox checked onChange={() => {}} label="Pick" />);
    expect(screen.getByRole('checkbox', { name: 'Pick' }).getAttribute('aria-checked')).toBe('true');
    rerender(<TableRowCheckbox checked={false} indeterminate onChange={() => {}} label="Pick" />);
    expect(screen.getByRole('checkbox', { name: 'Pick' }).getAttribute('aria-checked')).toBe('mixed');
  });

  it('emits the toggled value on click', () => {
    const onChange = mock((_c: boolean) => {});
    const { rerender } = render(<TableRowCheckbox checked={false} onChange={onChange} label="Pick" />);
    fireEvent.click(screen.getByRole('checkbox'));
    expect(onChange).toHaveBeenLastCalledWith(true);
    rerender(<TableRowCheckbox checked onChange={onChange} label="Pick" />);
    fireEvent.click(screen.getByRole('checkbox'));
    expect(onChange).toHaveBeenLastCalledWith(false);
    rerender(<TableRowCheckbox checked={false} indeterminate onChange={onChange} label="Pick" />);
    fireEvent.click(screen.getByRole('checkbox'));
    expect(onChange).toHaveBeenLastCalledWith(false);
  });

  it('does not emit when disabled', () => {
    const onChange = mock((_c: boolean) => {});
    render(<TableRowCheckbox checked={false} disabled onChange={onChange} label="Pick" />);
    fireEvent.click(screen.getByRole('checkbox'));
    expect(onChange).not.toHaveBeenCalled();
  });
});

describe('TableSortHandle', () => {
  it('renders an aria-hidden grip, enabled and disabled', () => {
    const { container, rerender } = render(<TableSortHandle />);
    expect(container.querySelector('span[aria-hidden="true"]')).toBeTruthy();
    rerender(<TableSortHandle disabled />);
    expect(container.querySelector('span[aria-hidden="true"]')).toBeTruthy();
  });
});
