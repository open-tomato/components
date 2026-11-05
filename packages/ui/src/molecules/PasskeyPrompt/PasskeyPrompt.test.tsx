import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, mock } from 'bun:test';

import { PasskeyPrompt } from './PasskeyPrompt';

afterEach(cleanup);

describe('PasskeyPrompt', () => {
  it('renders the default copy as a status without cancel', () => {
    render(<PasskeyPrompt />);
    expect(screen.getByRole('status')).toBeTruthy();
    expect(screen.getByText(/register a passkey/)).toBeTruthy();
    expect(screen.getByText(/Touch ID/)).toBeTruthy();
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('renders custom title and description', () => {
    render(<PasskeyPrompt title="Waiting" description="Use your key" className="x" />);
    expect(screen.getByText('Waiting')).toBeTruthy();
    expect(screen.getByText('Use your key')).toBeTruthy();
  });

  it('fires onCancel from the default-labelled button', () => {
    const onCancel = mock(() => undefined);
    render(<PasskeyPrompt onCancel={onCancel} />);
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('uses a custom cancel label', () => {
    render(<PasskeyPrompt onCancel={() => undefined} cancelLabel="Back" />);
    expect(screen.getByRole('button', { name: 'Back' })).toBeTruthy();
  });
});
