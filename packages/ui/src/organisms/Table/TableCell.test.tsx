import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, mock } from 'bun:test';

import { TableCell } from './TableCell';

afterEach(cleanup);

const fakeSizes = (el: HTMLElement, sizes: Record<string, number>): void => {
  for (const [k, v] of Object.entries(sizes)) {
    Object.defineProperty(el, k, { configurable: true, value: v });
  }
};

describe('TableCell', () => {
  it('renders wrapped content by default', () => {
    render(<TableCell>hello</TableCell>);
    expect(screen.getByText('hello').className).toContain('flex');
  });

  it.each([
    ['start', 'text-left'],
    ['center', 'text-center'],
    ['end', 'text-right'],
  ] as const)('aligns %s', (align, cls) => {
    render(<TableCell align={align}>x</TableCell>);
    expect(screen.getByText('x').className).toContain(cls);
  });

  it('truncate mode clips and shows a tip only when clipped', () => {
    const onTip = mock(() => {});
    const offTip = mock(() => {});
    render(<TableCell mode="truncate" onTip={onTip} offTip={offTip}>long text</TableCell>);
    const el = screen.getByText('long text');
    expect(el.className).toContain('truncate');
    fireEvent.mouseEnter(el);
    expect(onTip).not.toHaveBeenCalled();
    fakeSizes(el, { scrollWidth: 300, clientWidth: 100 });
    fireEvent.mouseEnter(el);
    expect(onTip).toHaveBeenCalledTimes(1);
    expect((onTip.mock.calls[0] as unknown[])[0]).toMatchObject({ text: 'long text' });
    fireEvent.mouseLeave(el);
    expect(offTip).toHaveBeenCalledTimes(1);
  });

  it('clamp mode applies the line clamp and tips when clipped vertically', () => {
    const onTip = mock(() => {});
    render(<TableCell mode="clamp" lines={3} onTip={onTip}>para</TableCell>);
    const el = screen.getByText('para');
    fakeSizes(el, { scrollHeight: 90, clientHeight: 40 });
    fireEvent.mouseEnter(el);
    expect(onTip).toHaveBeenCalledTimes(1);
  });

  it('does not tip in wrap mode', () => {
    const onTip = mock(() => {});
    render(<TableCell onTip={onTip}>w</TableCell>);
    fireEvent.mouseEnter(screen.getByText('w'));
    expect(onTip).not.toHaveBeenCalled();
  });
});
