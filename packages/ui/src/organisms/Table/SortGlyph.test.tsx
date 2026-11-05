import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'bun:test';

import { SortGlyph } from './SortGlyph';

afterEach(cleanup);

describe('SortGlyph', () => {
  it('renders nothing when the column is not sortable', () => {
    const { container } = render(<SortGlyph active={false} dir="asc" />);
    expect(container.firstChild).toBeNull();
  });

  it('renders the faint hint when sortable and inactive', () => {
    const { container } = render(<SortGlyph sortable active={false} dir="asc" />);
    expect(container.querySelector('span.opacity-25')).toBeTruthy();
  });

  it.each(['asc', 'desc'] as const)('renders the accent arrow when active (%s)', (dir) => {
    const { container } = render(<SortGlyph sortable active dir={dir} />);
    expect(container.querySelector('span.text-accent')).toBeTruthy();
    expect(container.querySelector('span.opacity-25')).toBeNull();
  });
});
