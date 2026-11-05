import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, mock } from 'bun:test';

import { Pagination } from './Pagination';

describe('Pagination', () => {
  it('renders a button per page and marks the current one', () => {
    render(<Pagination count={3} index={1} />);
    expect(screen.getByRole('button', { name: '2' }).getAttribute('aria-current')).toBe('page');
    expect(screen.getByRole('button', { name: '1' }).getAttribute('aria-current')).toBeNull();
    expect(screen.getByRole('button', { name: '3' })).toBeTruthy();
  });

  it('disables Previous on the first page', () => {
    render(<Pagination count={3} index={0} />);
    expect((screen.getByRole('button', { name: 'Previous' }) as HTMLButtonElement).disabled).toBe(true);
    expect((screen.getByRole('button', { name: 'Next' }) as HTMLButtonElement).disabled).toBe(false);
  });

  it('disables Next on the last page', () => {
    render(<Pagination count={3} index={2} />);
    expect((screen.getByRole('button', { name: 'Next' }) as HTMLButtonElement).disabled).toBe(true);
  });

  it('emits the clicked page index', () => {
    const onChange = mock((_i: number) => undefined);
    render(<Pagination count={5} index={2} onChange={onChange} />);
    fireEvent.click(screen.getByRole('button', { name: '5' }));
    expect(onChange).toHaveBeenLastCalledWith(4);
  });

  it('steps with Previous and Next', () => {
    const onChange = mock((_i: number) => undefined);
    render(<Pagination count={5} index={2} onChange={onChange} />);
    fireEvent.click(screen.getByRole('button', { name: 'Previous' }));
    expect(onChange).toHaveBeenLastCalledWith(1);
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(onChange).toHaveBeenLastCalledWith(3);
  });

  it('does not throw without an onChange handler', () => {
    render(<Pagination count={2} index={0} />);
    fireEvent.click(screen.getByRole('button', { name: '2' }));
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByRole('button', { name: '1' })).toBeTruthy();
  });
});
