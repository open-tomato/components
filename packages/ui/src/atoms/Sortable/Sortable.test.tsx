import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, mock } from 'bun:test';

import { Sortable } from './Sortable';
import { SortableRow } from './SortableRow';

const TYPE = 'application/x-otx-sort-a';
const OTHER = 'application/x-otx-sort-b';

interface Item { id: string; name: string }
const ITEMS: Item[] = [
  { id: '1', name: 'One' },
  { id: '2', name: 'Two' },
  { id: '3', name: 'Three' },
];

const makeDt = (types: string[], data: Record<string, string> = {}) => ({
  types,
  dropEffect: 'none',
  effectAllowed: 'none',
  getData: (t: string) => data[t] ?? '',
  setData: (t: string, v: string) => {
    data[t] = v;
  },
});

const setup = (props: Partial<Parameters<typeof Sortable<Item>>[0]> = {}) => {
  const onReorder = mock((_next: Item[]) => {});
  const utils = render(
    <Sortable<Item>
      group="a"
      items={ITEMS}
      getKey={(i) => i.id}
      onReorder={onReorder}
      renderItem={(i, { dragging }) => (
        <span data-dragging={String(dragging)}>{i.name}</span>
      )}
      {...props}
    />,
  );
  const rows = () => ITEMS.map((i) => screen.getByText(i.name).parentElement as HTMLElement);
  return { onReorder, rows, ...utils };
};

/**
 * A dragover on an item bubbles to the container, whose handler overwrites the
 * item's index while the container's overIndex is still null. Priming the
 * container first makes the item's index stick, as in a real drag.
 */
const hover = (root: HTMLElement, row: HTMLElement, dt: ReturnType<typeof makeDt>): void => {
  fireEvent.dragOver(root, { dataTransfer: dt });
  fireEvent.dragOver(row, { dataTransfer: dt });
};

describe('Sortable', () => {
  it('renders every item draggable', () => {
    const { rows } = setup();
    expect(rows()).toHaveLength(3);
    for (const r of rows()) expect(r.getAttribute('draggable')).toBe('true');
  });

  it('shows the default and custom empty hints', () => {
    const { unmount } = setup({ items: [] });
    expect(screen.getByText('Empty')).toBeTruthy();
    unmount();
    setup({ items: [], emptyHint: 'Drop here' });
    expect(screen.getByText('Drop here')).toBeTruthy();
  });

  it('applies direction and gap', () => {
    const { container } = setup({ direction: 'horizontal', gap: 20 });
    const root = container.firstElementChild as HTMLElement;
    expect(root.style.gap).toBe('20px');
  });

  it('marks the dragged item and clears on drag end', () => {
    const { rows } = setup();
    const dt = makeDt([]);
    fireEvent.dragStart(rows()[0]!, { dataTransfer: dt });
    expect(dt.getData(TYPE)).toContain('"fromIndex":0');
    expect(screen.getByText('One').dataset.dragging).toBe('true');
    fireEvent.dragEnd(rows()[0]!);
    expect(screen.getByText('One').dataset.dragging).toBe('false');
  });

  it('reorders on an internal drop', () => {
    const { rows, onReorder, container } = setup();
    const root = container.firstElementChild as HTMLElement;
    const data = { [TYPE]: JSON.stringify({ fromIndex: 0 }) };
    const dt = makeDt([TYPE], data);
    // happy-dom drops clientY, so the drop lands before item 3 (index 2)
    hover(root, rows()[2]!, dt);
    fireEvent.drop(rows()[2]!, { dataTransfer: dt });
    expect(onReorder).toHaveBeenCalledTimes(1);
    expect(onReorder.mock.calls[0]![0].map((i) => i.id)).toEqual(['2', '1', '3']);
  });

  it('does not reorder when dropped in place', () => {
    const { rows, onReorder, container } = setup();
    const root = container.firstElementChild as HTMLElement;
    const dt = makeDt([TYPE], { [TYPE]: JSON.stringify({ fromIndex: 1 }) });
    hover(root, rows()[1]!, dt);
    fireEvent.drop(rows()[1]!, { dataTransfer: dt });
    expect(onReorder).not.toHaveBeenCalled();
  });

  it('drops on the container at the end when no item is hovered', () => {
    const { container, onReorder } = setup();
    const root = container.firstElementChild as HTMLElement;
    const dt = makeDt([TYPE], { [TYPE]: JSON.stringify({ fromIndex: 0 }) });
    fireEvent.dragEnter(root, { dataTransfer: dt });
    fireEvent.dragOver(root, { dataTransfer: dt });
    fireEvent.drop(root, { dataTransfer: dt });
    expect(onReorder.mock.calls[0]![0].map((i) => i.id)).toEqual(['2', '3', '1']);
  });

  it('shows the drop line while dragging over and hides it on leave', () => {
    const { rows, container } = setup();
    const root = container.firstElementChild as HTMLElement;
    const dt = makeDt([TYPE]);
    const before = root.children.length;
    fireEvent.dragEnter(root, { dataTransfer: dt });
    fireEvent.dragOver(rows()[1]!, { dataTransfer: dt });
    expect(root.children.length).toBe(before + 1);
    fireEvent.dragLeave(root, { dataTransfer: dt });
    expect(root.children.length).toBe(before);
  });

  it('receives items from another group when onReceive is given', () => {
    const onReceive = mock((_item: Item, _at: number) => {});
    const { rows, onReorder, container } = setup({ onReceive });
    const root = container.firstElementChild as HTMLElement;
    const item = { id: '9', name: 'Nine' };
    const dt = makeDt([OTHER], { [OTHER]: JSON.stringify({ fromIndex: 0, item }) });
    hover(root, rows()[1]!, dt);
    fireEvent.drop(rows()[1]!, { dataTransfer: dt });
    expect(onReceive).toHaveBeenCalledWith(item, 1);
    expect(onReorder).not.toHaveBeenCalled();
  });

  it('rejects cross-group drags without onReceive', () => {
    const { rows, container, onReorder } = setup();
    const dt = makeDt([OTHER], { [OTHER]: JSON.stringify({ item: ITEMS[0] }) });
    const root = container.firstElementChild as HTMLElement;
    const before = root.children.length;
    fireEvent.dragOver(rows()[1]!, { dataTransfer: dt });
    fireEvent.dragOver(root, { dataTransfer: dt });
    expect(root.children.length).toBe(before);
    fireEvent.drop(root, { dataTransfer: dt });
    expect(onReorder).not.toHaveBeenCalled();
  });

  it('ignores file drags and unknown drags', () => {
    const onReceive = mock((_item: Item, _at: number) => {});
    const { rows, container, onReorder } = setup({ onReceive });
    const root = container.firstElementChild as HTMLElement;
    for (const types of [['Files'], ['text/plain']]) {
      const dt = makeDt(types);
      fireEvent.dragOver(rows()[0]!, { dataTransfer: dt });
      fireEvent.dragLeave(root, { dataTransfer: dt });
      fireEvent.drop(root, { dataTransfer: dt });
    }
    expect(onReorder).not.toHaveBeenCalled();
    expect(onReceive).not.toHaveBeenCalled();
  });
});

describe('SortableRow', () => {
  it('renders children, trailing slot and className', () => {
    render(
      <SortableRow trailing={<em>done</em>} className="extra" data-testid="row">
        Task
      </SortableRow>,
    );
    const row = screen.getByTestId('row');
    expect(row.className).toContain('extra');
    expect(screen.getByText('Task')).toBeTruthy();
    expect(screen.getByText('done')).toBeTruthy();
  });
});
