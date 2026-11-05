import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, mock } from 'bun:test';

import { Table, type Column } from './Table';

interface Row {
  id: string;
  name: string;
  cost: number;
}

const DATA: Row[] = [
  { id: 'a', name: 'Charlie', cost: 3 },
  { id: 'b', name: 'Alpha', cost: 10 },
  { id: 'c', name: 'Bravo', cost: 2 },
];

const COLUMNS: Column<Row>[] = [
  { key: 'name', header: 'Name', sortable: true, footer: (d) => `${d.length} rows` },
  { key: 'cost', header: 'Cost', align: 'end', sortable: true, cell: (r) => `$${r.cost}` },
];

const getRowId = (r: Row): string => r.id;

const bodyNames = (): string[] =>
  screen.getAllByRole('row').slice(1).map((r) => within(r).getAllByRole('cell')[0]?.textContent ?? '');

afterEach(cleanup);

describe('Table', () => {
  it('renders headers and rows', () => {
    render(<Table columns={COLUMNS} data={DATA} getRowId={getRowId} />);
    expect(screen.getByRole('columnheader', { name: /Name/ })).toBeTruthy();
    expect(bodyNames()).toEqual(['Charlie', 'Alpha', 'Bravo']);
    expect(screen.getByText('$10')).toBeTruthy();
  });

  it.each([
    { density: 'compact' },
    { density: 'comfortable' },
    { layout: 'scroll', maxHeight: 120 },
    { striped: true },
    { frame: false },
  ] as const)('renders variant %o', (props) => {
    render(<Table columns={COLUMNS} data={DATA} getRowId={getRowId} {...props} />);
    expect(bodyNames()).toHaveLength(3);
  });

  it('cycles sort asc, desc, none on header click', () => {
    render(<Table columns={COLUMNS} data={DATA} getRowId={getRowId} />);
    const head = screen.getByRole('columnheader', { name: /Name/ });
    fireEvent.click(head);
    expect(head.getAttribute('aria-sort')).toBe('ascending');
    expect(bodyNames()).toEqual(['Alpha', 'Bravo', 'Charlie']);
    fireEvent.click(head);
    expect(head.getAttribute('aria-sort')).toBe('descending');
    expect(bodyNames()).toEqual(['Charlie', 'Bravo', 'Alpha']);
    fireEvent.click(head);
    expect(head.getAttribute('aria-sort')).toBeNull();
    expect(bodyNames()).toEqual(['Charlie', 'Alpha', 'Bravo']);
  });

  it('sorts numerically and honours initialSort and sortAccessor', () => {
    const cols: Column<Row>[] = [
      { key: 'name', header: 'Name' },
      { key: 'cost', header: 'Cost', sortable: true, sortAccessor: (r) => -r.cost },
    ];
    render(
      <Table columns={cols} data={DATA} getRowId={getRowId} initialSort={{ key: 'cost', dir: 'asc' }} />,
    );
    expect(bodyNames()).toEqual(['Alpha', 'Charlie', 'Bravo']);
  });

  it('ignores clicks on non-sortable columns', () => {
    render(<Table columns={[{ key: 'name', header: 'Name' }]} data={DATA} getRowId={getRowId} />);
    fireEvent.click(screen.getByRole('columnheader', { name: /Name/ }));
    expect(bodyNames()).toEqual(['Charlie', 'Alpha', 'Bravo']);
  });

  it('renders the totals footer from column footers', () => {
    render(<Table columns={COLUMNS} data={DATA} getRowId={getRowId} stickyFooter />);
    expect(screen.getByText('3 rows')).toBeTruthy();
  });

  it('shows a tooltip for clipped truncated cells and hides it on leave', () => {
    const cols: Column<Row>[] = [{ key: 'name', header: 'Name', overflow: 'truncate' }];
    render(<Table columns={cols} data={DATA} getRowId={getRowId} />);
    const cell = screen.getByText('Charlie');
    Object.defineProperty(cell, 'scrollWidth', { configurable: true, value: 500 });
    fireEvent.mouseEnter(cell);
    expect(screen.getAllByText('Charlie')).toHaveLength(2);
    fireEvent.mouseLeave(cell);
    expect(screen.getAllByText('Charlie')).toHaveLength(1);
  });

  describe('selection', () => {
    it('emits all selectable ids from the header checkbox', () => {
      const onSelectionChange = mock((_ids: string[]) => {});
      render(
        <Table
          columns={COLUMNS}
          data={DATA}
          getRowId={getRowId}
          selectable
          selectedIds={[]}
          onSelectionChange={onSelectionChange}
          isRowSelectable={(r) => r.id !== 'c'}
        />,
      );
      fireEvent.click(screen.getByRole('checkbox', { name: 'Select all rows' }));
      expect(onSelectionChange).toHaveBeenLastCalledWith(['a', 'b']);
      expect(screen.getByRole('checkbox', { name: 'Select row c' }).hasAttribute('disabled')).toBe(true);
    });

    it('toggles single rows on and off', () => {
      const onSelectionChange = mock((_ids: string[]) => {});
      const { rerender } = render(
        <Table columns={COLUMNS} data={DATA} getRowId={getRowId} selectable selectedIds={['a']} onSelectionChange={onSelectionChange} />,
      );
      fireEvent.click(screen.getByRole('checkbox', { name: 'Select row b' }));
      expect(onSelectionChange).toHaveBeenLastCalledWith(['a', 'b']);
      fireEvent.click(screen.getByRole('checkbox', { name: 'Select row a' }));
      expect(onSelectionChange).toHaveBeenLastCalledWith([]);
      expect(screen.getByRole('checkbox', { name: 'Select all rows' }).getAttribute('aria-checked')).toBe('mixed');
      rerender(
        <Table columns={COLUMNS} data={DATA} getRowId={getRowId} selectable selectedIds={['a', 'b', 'c']} onSelectionChange={onSelectionChange} />,
      );
      expect(screen.getByRole('checkbox', { name: 'Select all rows' }).getAttribute('aria-checked')).toBe('true');
      fireEvent.click(screen.getByRole('checkbox', { name: 'Select all rows' }));
      expect(onSelectionChange).toHaveBeenLastCalledWith([]);
    });
  });

  describe('reorderable', () => {
    const dt = () => ({ effectAllowed: '', dropEffect: '', setData: () => {} });

    it('renders handles, opts rows out and disables column sort', () => {
      render(
        <Table columns={COLUMNS} data={DATA} getRowId={getRowId} reorderable isRowReorderable={(r) => r.id !== 'b'} />,
      );
      const rows = screen.getAllByRole('row').slice(1);
      expect(rows.every((r) => r.getAttribute('draggable') === 'true')).toBe(true);
      fireEvent.click(screen.getByRole('columnheader', { name: /Name/ }));
      expect(bodyNames().length).toBe(3);
      expect(within(rows[0] as HTMLElement).getAllByRole('cell')[1]?.textContent).toBe('Charlie');
    });

    it('emits the next order when a row is dragged from its handle', () => {
      const onReorder = mock((_next: Row[]) => {});
      const { container } = render(
        <Table columns={COLUMNS} data={DATA} getRowId={getRowId} reorderable onReorder={onReorder} />,
      );
      const rows = screen.getAllByRole('row').slice(1) as HTMLElement[];
      const grip = container.querySelectorAll('tbody tr')[0]?.querySelector('td span') as HTMLElement;
      fireEvent.pointerDown(grip);
      fireEvent.dragStart(rows[0] as HTMLElement, { dataTransfer: dt() });
      // happy-dom rects are zero-sized: clientY 0 is "not past the midpoint" → drop before row 2.
      fireEvent.dragOver(rows[2] as HTMLElement, { dataTransfer: dt() });
      fireEvent.drop(rows[2] as HTMLElement, { dataTransfer: dt() });
      expect(onReorder).toHaveBeenCalledTimes(1);
      expect((onReorder.mock.calls[0] as unknown[])[0]).toEqual([DATA[1], DATA[0], DATA[2]]);
    });

    it('ignores a drag that was not armed by the handle', () => {
      const onReorder = mock((_next: Row[]) => {});
      render(<Table columns={COLUMNS} data={DATA} getRowId={getRowId} reorderable onReorder={onReorder} />);
      const rows = screen.getAllByRole('row').slice(1) as HTMLElement[];
      fireEvent.dragStart(rows[0] as HTMLElement, { dataTransfer: dt() });
      fireEvent.dragOver(rows[2] as HTMLElement, { dataTransfer: dt() });
      fireEvent.drop(rows[2] as HTMLElement, { dataTransfer: dt() });
      expect(onReorder).not.toHaveBeenCalled();
    });
  });
});
