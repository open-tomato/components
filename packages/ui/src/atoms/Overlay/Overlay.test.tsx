import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, mock } from 'bun:test';

import { Overlay } from './Overlay';

afterEach(cleanup);

describe('Overlay', () => {
  it('renders nothing when closed', () => {
    render(<Overlay open={false} onClose={() => {}}>body</Overlay>);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('renders a labelled dialog with children when open', () => {
    render(<Overlay open onClose={() => {}} label="Settings" className="custom">body</Overlay>);
    const dialog = screen.getByRole('dialog', { name: 'Settings' });
    expect(dialog.textContent).toBe('body');
    expect(dialog.parentElement?.className).toContain('custom');
  });

  it('calls onClose on Escape', () => {
    const onClose = mock(() => {});
    render(<Overlay open onClose={onClose} label="x">body</Overlay>);
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('ignores Escape when dismiss is backdrop only', () => {
    const onClose = mock(() => {});
    render(<Overlay open onClose={onClose} dismiss="backdrop" label="x">body</Overlay>);
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
    expect(onClose).not.toHaveBeenCalled();
  });

  it('renders non-modally when focus trap is off', () => {
    render(<Overlay open onClose={() => {}} trapFocus={false} lockScroll={false} label="x">body</Overlay>);
    expect(screen.getByRole('dialog').textContent).toBe('body');
  });
});
