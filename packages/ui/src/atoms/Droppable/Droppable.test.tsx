import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, mock } from 'bun:test';

import { Droppable, DroppableInline, DroppableRegion, DroppableZone } from './Droppable';
import { fmtBytes, validateDrop } from './useDroppable';

afterEach(cleanup);

const file = (name: string, type = 'text/markdown', size = 10): File => {
  const f = new File(['x'], name, { type });
  Object.defineProperty(f, 'size', { value: size });
  return f;
};

const dropData = (files: File[], types: string[] = ['Files']) => ({
  dataTransfer: { types, files, dropEffect: 'none' },
});

describe('Droppable', () => {
  it('renders the zone by default with its defaults', () => {
    render(<Droppable />);
    expect(screen.getByRole('button', { name: 'Drag a file here' })).toBeTruthy();
  });

  it('renders the compact zone with label and hint', () => {
    render(<Droppable feedback="zone" compact label="Drop a context file" hint=".md or .txt" />);
    expect(screen.getByText('Drop a context file')).toBeTruthy();
    expect(screen.getByText('.md or .txt')).toBeTruthy();
  });

  it('renders inline and region presentations', () => {
    render(<Droppable feedback="inline"><i>avatar</i></Droppable>);
    expect(screen.getByRole('button', { name: /avatar/ })).toBeTruthy();
    cleanup();
    render(<Droppable feedback="region" minHeight={50}>content</Droppable>);
    expect(screen.getByText('Drop files to add them here')).toBeTruthy();
  });

  it('shows the over state and resets on leave', () => {
    render(<DroppableZone />);
    const btn = screen.getByRole('button');
    fireEvent.dragEnter(btn, dropData([]));
    expect(screen.getByText('Release to add')).toBeTruthy();
    fireEvent.dragOver(btn, dropData([]));
    fireEvent.dragLeave(btn, dropData([]));
    expect(screen.getByText('Drag a file here')).toBeTruthy();
  });

  it('ignores internal drags', () => {
    render(<DroppableZone />);
    fireEvent.dragEnter(screen.getByRole('button'), dropData([], ['text/plain']));
    expect(screen.getByText('Drag a file here')).toBeTruthy();
  });

  it('emits onDrop with accepted files', () => {
    const onDrop = mock((_f: File[]) => {});
    render(<DroppableZone accept={{ ext: ['.md'] }} onDrop={onDrop} />);
    const f = file('a.md');
    fireEvent.drop(screen.getByRole('button'), dropData([f]));
    expect(onDrop).toHaveBeenCalledWith([f]);
  });

  it('emits onReject and shows the reason in the zone', () => {
    const onReject = mock((_r: string) => {});
    render(<DroppableZone accept={{ ext: ['.md'], mime: ['text/markdown'] }} onReject={onReject} />);
    fireEvent.drop(screen.getByRole('button'), dropData([file('a.png', 'image/png')]));
    expect(onReject).toHaveBeenCalledTimes(1);
    expect(screen.getByText(/a\.png isn't accepted/)).toBeTruthy();
  });

  it('rejects on the inline and region presentations', () => {
    const onReject = mock((_r: string) => {});
    const { container } = render(
      <>
        <DroppableInline accept={{ multiple: false }} onReject={onReject}>m</DroppableInline>
        <DroppableRegion accept={{ maxSize: 1 }} onReject={onReject}>r</DroppableRegion>
      </>,
    );
    fireEvent.drop(screen.getByRole('button'), dropData([file('a'), file('b')]));
    fireEvent.drop(container.querySelector('div') as HTMLElement, dropData([file('big', 'x', 99)]));
    expect(onReject).toHaveBeenCalledTimes(2);
  });

  it('does nothing when disabled', () => {
    const onDrop = mock((_f: File[]) => {});
    render(<DroppableZone disabled onDrop={onDrop} />);
    const btn = screen.getByRole('button');
    fireEvent.dragEnter(btn, dropData([]));
    fireEvent.drop(btn, dropData([file('a.md')]));
    expect(onDrop).not.toHaveBeenCalled();
  });

  it('forwards a file chosen through the hidden input', () => {
    const onDrop = mock((_f: File[]) => {});
    const onReject = mock((_r: string) => {});
    const { container } = render(
      <DroppableZone accept={{ ext: ['.md'], mime: ['text/markdown'] }} onDrop={onDrop} onReject={onReject} />,
    );
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.click(screen.getByRole('button'));
    fireEvent.change(input, { target: { files: [file('a.md')] } });
    expect(onDrop).toHaveBeenCalledTimes(1);
    fireEvent.change(input, { target: { files: [file('a.png', 'image/png')] } });
    expect(onReject).toHaveBeenCalledTimes(1);
  });
});

describe('validateDrop', () => {
  it('covers empty, count and mime wildcard cases', () => {
    expect(validateDrop([]).ok).toBe(false);
    expect(validateDrop([file('a'), file('b')], { maxCount: 1 })).toEqual({
      ok: false,
      reason: 'Up to 1 file at a time.',
    });
    expect(validateDrop([file('a.png', 'image/png')], { mime: ['image/*'] }).ok).toBe(true);
    expect(fmtBytes(500)).toBe('500 B');
    expect(fmtBytes(2048)).toBe('2 KB');
    expect(fmtBytes(3145728)).toBe('3.0 MB');
  });
});
