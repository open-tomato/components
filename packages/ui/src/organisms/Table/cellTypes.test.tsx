import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'bun:test';

import { isKnownCellType, renderCellContent } from './cellTypes';

afterEach(cleanup);

describe('isKnownCellType', () => {
  it('recognises registered types only', () => {
    expect(isKnownCellType('badge')).toBe(true);
    expect(isKnownCellType('context-menu')).toBe(true);
    expect(isKnownCellType('entity-stack')).toBe(true);
    expect(isKnownCellType('nope')).toBe(false);
  });
});

describe('renderCellContent', () => {
  it('renders text', () => {
    render(renderCellContent('text', { text: 'plain' }));
    expect(screen.getByText('plain')).toBeTruthy();
  });

  it('renders a badge', () => {
    render(renderCellContent('badge', { label: 'Active', tone: 'success' }));
    expect(screen.getByText('Active')).toBeTruthy();
  });

  it('renders a relative time', () => {
    const { container } = render(
      renderCellContent('relative-time', {
        date: '2026-01-01T00:00:00Z',
        now: '2026-01-02T00:00:00Z',
      }),
    );
    expect(container.textContent?.length).toBeGreaterThan(0);
  });

  it('renders a context-menu trigger', () => {
    render(
      renderCellContent('context-menu', {
        entityType: 'task',
        entityName: 'ship',
        actions: [],
      }),
    );
    expect(screen.getByRole('button', { name: 'Actions for ship' })).toBeTruthy();
  });

  it('renders a value from the cell-content kit', () => {
    const { container } = render(renderCellContent('value', { children: 'v1' } as never));
    expect(container.textContent).toContain('v1');
  });
});
