import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, mock } from 'bun:test';

import { Breadcrumb } from './Breadcrumb';

afterEach(cleanup);

const items = [
  { key: 'a', label: 'Account' },
  { key: 'b', label: 'Plan' },
  { key: 'c', label: 'Review' },
];

describe('Breadcrumb', () => {
  it('renders a labelled nav with one button per item', () => {
    render(<Breadcrumb items={items} index={1} />);
    expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeTruthy();
    expect(screen.getAllByRole('button')).toHaveLength(3);
  });

  it('marks only the current item', () => {
    render(<Breadcrumb items={items} index={1} />);
    expect(screen.getByRole('button', { name: 'Plan' }).getAttribute('aria-current')).toBe('page');
    expect(screen.getByRole('button', { name: 'Account' }).getAttribute('aria-current')).toBeNull();
    expect(screen.getByRole('button', { name: 'Review' }).getAttribute('aria-current')).toBeNull();
  });

  it('reports the clicked index', () => {
    const onChange = mock((_i: number) => undefined);
    render(<Breadcrumb items={items} index={0} onChange={onChange} />);
    fireEvent.click(screen.getByRole('button', { name: 'Review' }));
    expect(onChange).toHaveBeenCalledWith(2);
  });

  it('tolerates a click without onChange', () => {
    render(<Breadcrumb items={items} index={0} />);
    fireEvent.click(screen.getByRole('button', { name: 'Plan' }));
    expect(screen.getAllByRole('button')).toHaveLength(3);
  });
});
