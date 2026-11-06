import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'bun:test';

import { ArtPlaceholder, CardFiller, ContentTiles, GridTiles, Ph, ShellFiller } from './fixtures';

describe('story fixtures', () => {
  it('Ph merges className over its base', () => {
    const { container } = render(<Ph className="w-4 opacity-100" />);
    const cls = container.firstElementChild?.className ?? '';
    expect(cls).toContain('w-4');
    expect(cls).toContain('opacity-100');
    expect(cls).not.toContain('opacity-50');
  });

  it('ShellFiller and CardFiller render placeholder rows', () => {
    const shell = render(<ShellFiller />);
    expect(shell.container.querySelectorAll('span.block').length).toBe(5);
    shell.unmount();
    const card = render(<CardFiller />);
    expect(card.container.querySelectorAll('span.block').length).toBe(3);
  });

  it('ContentTiles numbers its tiles, default 3', () => {
    render(<div>{ContentTiles({})}</div>);
    expect(screen.getByText('item 3')).toBeTruthy();
    expect(screen.queryByText('item 4')).toBeNull();
  });

  it('ContentTiles cycles tones past three tiles', () => {
    render(<div>{ContentTiles({ count: 4 })}</div>);
    expect(screen.getByText('item 4').className).toBe(screen.getByText('item 1').className);
  });

  it('GridTiles renders count tiles, default 6', () => {
    const { container } = render(<div>{GridTiles({})}</div>);
    expect(container.querySelectorAll('span').length).toBe(6);
    expect(screen.getByText('6')).toBeTruthy();
  });

  it('ArtPlaceholder renders a hidden svg with a primary circle', () => {
    const { container } = render(<ArtPlaceholder />);
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('aria-hidden')).toBe('true');
    expect(svg?.querySelector('circle')?.getAttribute('class')).toBe('fill-primary');
  });
});
