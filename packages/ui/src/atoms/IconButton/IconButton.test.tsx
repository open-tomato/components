import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, mock } from 'bun:test';

import { IconButton } from './IconButton';

afterEach(cleanup);

describe('IconButton', () => {
  it('is named by its label and renders the icon', () => {
    render(<IconButton icon={<svg data-testid="i" />} label="Copy secret" />);
    const btn = screen.getByRole('button', { name: 'Copy secret' });
    expect(btn.getAttribute('type')).toBe('button');
    expect(screen.getByTestId('i')).toBeTruthy();
  });

  it('renders the active variant', () => {
    render(<IconButton icon="d" label="Download" active className="extra" />);
    expect(screen.getByRole('button', { name: 'Download' }).className).toContain('extra');
  });

  it('calls onClick', () => {
    const onClick = mock(() => {});
    render(<IconButton icon="x" label="Go" onClick={onClick} />);
    fireEvent.click(screen.getByRole('button', { name: 'Go' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
