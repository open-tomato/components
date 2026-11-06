import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, mock } from 'bun:test';

import { ConfirmInline, ConfirmPopover } from './ConfirmPopover';

describe('ConfirmInline', () => {
  it('renders the message and named actions, wiring both handlers', () => {
    const onConfirm = mock(() => {});
    const onCancel = mock(() => {});
    render(
      <ConfirmInline
        message="Delete the item example-item?"
        confirmLabel="Yes, delete"
        danger
        onConfirm={onConfirm}
        onCancel={onCancel}
      />,
    );
    expect(screen.getByText('Delete the item example-item?')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Yes, delete' }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('uses a custom cancel label and non-danger variant', () => {
    render(
      <ConfirmInline
        message="Archive?"
        confirmLabel="Archive"
        cancelLabel="Keep"
        onConfirm={() => {}}
        onCancel={() => {}}
      />,
    );
    expect(screen.getByRole('button', { name: 'Keep' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Archive' })).toBeTruthy();
  });
});

describe('ConfirmPopover', () => {
  it('stays closed until the trigger is activated', () => {
    render(
      <ConfirmPopover message="Delete it?" confirmLabel="Yes, delete" onConfirm={() => {}}>
        <button type="button">Delete</button>
      </ConfirmPopover>,
    );
    expect(screen.queryByText('Delete it?')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));
    expect(screen.getByText('Delete it?')).toBeTruthy();
  });

  it('confirms and closes', () => {
    const onConfirm = mock(() => {});
    render(
      <ConfirmPopover defaultOpen message="Delete it?" confirmLabel="Yes, delete" onConfirm={onConfirm}>
        <button type="button">Delete</button>
      </ConfirmPopover>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Yes, delete' }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(screen.queryByText('Delete it?')).toBeNull();
  });

  it('cancels, notifies onCancel and closes', () => {
    const onCancel = mock(() => {});
    render(
      <ConfirmPopover
        defaultOpen
        message="Delete it?"
        confirmLabel="Yes, delete"
        onConfirm={() => {}}
        onCancel={onCancel}
      >
        <button type="button">Delete</button>
      </ConfirmPopover>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onCancel).toHaveBeenCalled();
    expect(screen.queryByText('Delete it?')).toBeNull();
  });
});
