import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'bun:test';

import { fmtCount, makeColumns, ITEMS, STATUS } from './items';

describe('fmtCount', () => {
  it.each([
    [0, '—'],
    [850, '850'],
    [1500, '1.5k'],
    [99_999, '100.0k'],
    [123_456, '123k'],
  ])('%d → %s', (n, out) => {
    expect(fmtCount(n)).toBe(out);
  });
});

describe('item fixtures', () => {
  it('ranks every status used by the dataset', () => {
    expect(ITEMS.length).toBeGreaterThan(0);
    for (const s of ITEMS) expect(STATUS[s.status]).toBeDefined();
  });

  it('builds six columns with the goal overflow mode', () => {
    const cols = makeColumns('clamp');
    expect(cols.map((c) => c.key)).toEqual(['status', 'name', 'goal', 'model', 'count', 'updated']);
    expect(cols[2]?.overflow).toBe('clamp');
  });

  it('renders each column cell and footer for a row', () => {
    const cols = makeColumns('wrap');
    const row = ITEMS.find((s) => s.name.includes(' · ')) ?? ITEMS[0]!;
    render(
      <div>
        {cols.map((c) => <div key={c.key}>{c.cell?.(row)}</div>)}
      </div>,
    );
    expect(screen.getByText(STATUS[row.status].label)).toBeTruthy();
    expect(screen.getByText(row.model)).toBeTruthy();
    expect(screen.getByText(`${row.updated}m ago`)).toBeTruthy();
    const footers = cols.map((c) => c.footer?.(ITEMS)).filter(Boolean);
    expect(footers).toContain(`${ITEMS.length} items`);
    expect(footers.some((f) => String(f).endsWith(' total'))).toBe(true);
  });

  it('sorts statuses by rank', () => {
    const accessor = makeColumns('wrap')[0]?.sortAccessor;
    expect(accessor?.({ ...ITEMS[0]!, status: 'running' })).toBe(0);
    expect(accessor?.({ ...ITEMS[0]!, status: 'idle' })).toBe(4);
  });
});
