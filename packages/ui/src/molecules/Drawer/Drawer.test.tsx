import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, mock } from 'bun:test';

import { Drawer } from './Drawer';

describe('Drawer', () => {
  it('renders nothing when closed', () => {
    render(<Drawer open={false} onClose={() => {}}>Content</Drawer>);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('renders title, eyebrow, body and footer when open', () => {
    render(
      // @@S mol-3 begin
      <Drawer open onClose={() => {}} title="Details" eyebrow="Category" footer={<button type="button">Save</button>}>
        Body text
      </Drawer>,
      // @@S mol-3 end
    );
    expect(screen.getByRole('dialog')).toBeTruthy();
    expect(screen.getByText('Details')).toBeTruthy();
    // @@S mol-3 begin
    expect(screen.getByText('Category')).toBeTruthy();
    // @@S mol-3 end
    expect(screen.getByText('Body text')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Save' })).toBeTruthy();
  });

  it('omits the header and footer without title and footer', () => {
    render(<Drawer open onClose={() => {}}>Only body</Drawer>);
    expect(screen.queryByRole('button', { name: 'Close' })).toBeNull();
    expect(screen.getByText('Only body')).toBeTruthy();
  });

  it.each(['left', 'right'] as const)('renders side %s', (side) => {
    render(<Drawer open onClose={() => {}} side={side} title="T">Body</Drawer>);
    expect(screen.getByText('Body')).toBeTruthy();
  });

  it('calls onClose from the close button and Escape', () => {
    const onClose = mock(() => {});
    render(<Drawer open onClose={onClose} title="Details">Body</Drawer>);
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(onClose).toHaveBeenCalledTimes(1);
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(2);
  });
});
