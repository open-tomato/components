import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeAll, describe, expect, it } from 'bun:test';

import { Tooltip } from './Tooltip';

beforeAll(() => {
  window.ResizeObserver ??= class {
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
  } as unknown as typeof ResizeObserver;
});

afterEach(cleanup);

describe('Tooltip', () => {
  it('renders the anchor and hides the label when closed', () => {
    render(<Tooltip label="Help text"><button type="button">Anchor</button></Tooltip>);
    expect(screen.getByRole('button', { name: 'Anchor' })).toBeTruthy();
    expect(screen.queryByRole('tooltip')).toBeNull();
  });

  it.each(['top', 'right', 'bottom', 'left'] as const)('shows the label when open on %s', (side) => {
    render(
      <Tooltip label="Help text" open side={side} className="extra">
        <button type="button">Anchor</button>
      </Tooltip>,
    );
    expect(screen.getByRole('tooltip').textContent).toContain('Help text');
  });
});
