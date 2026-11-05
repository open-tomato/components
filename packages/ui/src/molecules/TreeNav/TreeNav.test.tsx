import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, mock } from 'bun:test';

import { TreeNav, type TreeNavNode } from './TreeNav';

afterEach(cleanup);

const nodes: readonly TreeNavNode[] = [
  {
    key: 'a',
    label: 'Alpha',
    children: [
      { key: 'a1', label: 'Alpha One', children: [] },
      { key: 'a2', label: 'Alpha Two', children: [] },
    ],
  },
  { key: 'b', label: 'Beta', children: [] },
];

const item = (name: string) => screen.getByRole('treeitem', { name });

describe('TreeNav', () => {
  it('renders a labelled tree with collapsed branches hiding children', () => {
    render(<TreeNav nodes={nodes} expandedKeys={[]} label="Files" />);
    expect(screen.getByRole('tree', { name: 'Files' })).toBeTruthy();
    expect(item('Alpha').getAttribute('aria-expanded')).toBe('false');
    expect(item('Beta').getAttribute('aria-expanded')).toBeNull();
    expect(screen.queryByRole('treeitem', { name: 'Alpha One' })).toBeNull();
  });

  it('uses the default label', () => {
    render(<TreeNav nodes={nodes} expandedKeys={[]} />);
    expect(screen.getByRole('tree', { name: 'Tree' })).toBeTruthy();
  });

  it('renders open branches with their group and the selection', () => {
    render(<TreeNav nodes={nodes} expandedKeys={['a']} selectedKey="a1" />);
    expect(item('Alpha').getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByRole('group')).toBeTruthy();
    expect(item('Alpha One').getAttribute('aria-selected')).toBe('true');
    expect(item('Alpha One').getAttribute('tabindex')).toBe('0');
    expect(item('Beta').getAttribute('tabindex')).toBe('-1');
  });

  it('selects on click and toggles on twisty click without selecting', () => {
    const onSelect = mock((_key: string) => undefined);
    const onToggle = mock((_key: string) => undefined);
    const { container } = render(
      <TreeNav nodes={nodes} expandedKeys={[]} onSelect={onSelect} onToggle={onToggle} />,
    );
    fireEvent.click(screen.getByText('Beta'));
    expect(onSelect).toHaveBeenCalledWith('b');
    const twisty = container.querySelector('[role="presentation"]') as Element;
    fireEvent.click(twisty);
    expect(onToggle).toHaveBeenCalledWith('a');
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it('does not throw without callbacks', () => {
    const { container } = render(<TreeNav nodes={nodes} expandedKeys={[]} />);
    fireEvent.click(screen.getByText('Beta'));
    fireEvent.click(container.querySelector('[role="presentation"]') as Element);
    fireEvent.keyDown(item('Alpha'), { key: 'ArrowRight' });
    fireEvent.keyDown(item('Alpha'), { key: 'Enter' });
    expect(item('Beta')).toBeTruthy();
  });

  it('walks rows with arrow, Home and End keys', () => {
    render(<TreeNav nodes={nodes} expandedKeys={['a']} />);
    item('Alpha').focus();
    fireEvent.keyDown(item('Alpha'), { key: 'ArrowDown' });
    expect(document.activeElement).toBe(item('Alpha One'));
    fireEvent.keyDown(item('Alpha One'), { key: 'ArrowUp' });
    expect(document.activeElement).toBe(item('Alpha'));
    fireEvent.keyDown(item('Alpha'), { key: 'End' });
    expect(document.activeElement).toBe(item('Beta'));
    fireEvent.keyDown(item('Beta'), { key: 'Home' });
    expect(document.activeElement).toBe(item('Alpha'));
    fireEvent.keyDown(item('Alpha'), { key: 'ArrowUp' });
    expect(document.activeElement).toBe(item('Alpha'));
  });

  it('opens, descends, closes and ascends with ArrowRight/ArrowLeft', () => {
    const onToggle = mock((_key: string) => undefined);
    const { rerender } = render(<TreeNav nodes={nodes} expandedKeys={[]} onToggle={onToggle} />);
    fireEvent.keyDown(item('Alpha'), { key: 'ArrowRight' });
    expect(onToggle).toHaveBeenCalledWith('a');
    fireEvent.keyDown(item('Beta'), { key: 'ArrowRight' });
    expect(onToggle).toHaveBeenCalledTimes(1);

    rerender(<TreeNav nodes={nodes} expandedKeys={['a']} onToggle={onToggle} />);
    item('Alpha').focus();
    fireEvent.keyDown(item('Alpha'), { key: 'ArrowRight' });
    expect(document.activeElement).toBe(item('Alpha One'));
    fireEvent.keyDown(item('Alpha One'), { key: 'ArrowLeft' });
    expect(document.activeElement).toBe(item('Alpha'));
    fireEvent.keyDown(item('Alpha'), { key: 'ArrowLeft' });
    expect(onToggle).toHaveBeenCalledTimes(2);
  });

  it('selects with Enter and Space, and ignores other keys and bubbled presses', () => {
    const onSelect = mock((_key: string) => undefined);
    render(<TreeNav nodes={nodes} expandedKeys={['a']} onSelect={onSelect} />);
    fireEvent.keyDown(item('Beta'), { key: 'Enter' });
    fireEvent.keyDown(item('Beta'), { key: ' ' });
    expect(onSelect).toHaveBeenCalledTimes(2);
    fireEvent.keyDown(item('Beta'), { key: 'x' });
    fireEvent.keyDown(screen.getByText('Alpha One'), { key: 'Enter' });
    expect(onSelect).toHaveBeenCalledTimes(2);
  });
});
