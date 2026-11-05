import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, mock } from 'bun:test';

import { Modal } from './Modal';

afterEach(cleanup);

describe('Modal', () => {
  it('renders nothing when closed', () => {
    render(<Modal open={false} onClose={() => undefined}>Body</Modal>);
    expect(screen.queryByText('Body')).toBeNull();
  });

  it('renders title, eyebrow, body, footer and status when open', () => {
    render(
      <Modal
        open
        onClose={() => undefined}
        title="Delete project"
        eyebrow="Danger"
        footer={<button type="button">Confirm</button>}
        footerStatus="Unsaved"
      >
        Body
      </Modal>,
    );
    expect(screen.getByRole('heading', { name: 'Delete project' })).toBeTruthy();
    expect(screen.getByText('Danger')).toBeTruthy();
    expect(screen.getByText('Body')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Confirm' })).toBeTruthy();
    expect(screen.getByText('Unsaved')).toBeTruthy();
  });

  it('renders without a title and omits the footer row', () => {
    render(<Modal open onClose={() => undefined}>Only body</Modal>);
    expect(screen.getByText('Only body')).toBeTruthy();
    expect(screen.queryByRole('heading')).toBeNull();
    expect(screen.queryByRole('button', { name: 'Close' })).toBeNull();
  });

  it('renders the footer row with only a status', () => {
    render(<Modal open onClose={() => undefined} footerStatus="Saved">B</Modal>);
    expect(screen.getByText('Saved')).toBeTruthy();
  });

  it.each(['sm', 'md', 'lg'] as const)('renders size %s', (size) => {
    render(<Modal open onClose={() => undefined} size={size}>Sized</Modal>);
    expect(screen.getByText('Sized')).toBeTruthy();
  });

  it('calls onClose from the close button', () => {
    const onClose = mock(() => undefined);
    render(<Modal open onClose={onClose} title="T">B</Modal>);
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose on Escape', () => {
    const onClose = mock(() => undefined);
    render(<Modal open onClose={onClose} title="T">B</Modal>);
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('ignores Escape when dismiss is backdrop only', () => {
    const onClose = mock(() => undefined);
    render(<Modal open onClose={onClose} dismiss="backdrop" title="T">B</Modal>);
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
    expect(onClose).not.toHaveBeenCalled();
  });
});
