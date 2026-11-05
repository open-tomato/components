import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, mock } from 'bun:test';

import { RowContextAction } from './RowContextAction';

afterEach(cleanup);

const setup = () => {
  const onEdit = mock(() => {});
  const onDelete = mock(() => {});
  const ui = (
    <RowContextAction
      defaultOpen
      entityType="session"
      entityName="auth-refactor"
      actions={[{ icon: 'pencil', title: 'Rename', onClick: onEdit }]}
      destructive={{ icon: 'trash-2', title: 'Delete', onClick: onDelete }}
    />
  );
  return { ui, onEdit, onDelete };
};

describe('RowContextAction', () => {
  it('renders only the labelled trigger when closed', () => {
    render(
      <RowContextAction
        entityType="task"
        entityName="t1"
        actions={[{ icon: 'pencil', title: 'Rename', onClick: () => {} }]}
      />,
    );
    expect(screen.getByRole('button', { name: 'Actions for t1' })).toBeTruthy();
    expect(screen.queryByRole('menuitem')).toBeNull();
  });

  it('uses a custom label', () => {
    render(<RowContextAction label="More" entityType="task" entityName="t1" actions={[]} />);
    expect(screen.getByRole('button', { name: 'More' })).toBeTruthy();
  });

  it('lists actions and the destructive item when open', () => {
    render(setup().ui);
    expect(screen.getByRole('menuitem', { name: 'Rename' })).toBeTruthy();
    expect(screen.getByRole('menuitem', { name: 'Delete' })).toBeTruthy();
  });

  it('fires an action handler', () => {
    const { ui, onEdit } = setup();
    render(ui);
    fireEvent.click(screen.getByRole('menuitem', { name: 'Rename' }));
    expect(onEdit).toHaveBeenCalledTimes(1);
  });

  it('gates the destructive action behind a confirmation', () => {
    const { ui, onDelete } = setup();
    render(ui);
    fireEvent.click(screen.getByRole('menuitem', { name: 'Delete' }));
    expect(onDelete).not.toHaveBeenCalled();
    expect(screen.getByText('auth-refactor')).toBeTruthy();
    fireEvent.click(screen.getByRole('menuitem', { name: 'Delete' }));
    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('menuitem')).toBeNull();
  });

  it('cancel closes without firing the destructive handler', () => {
    const { ui, onDelete } = setup();
    render(ui);
    fireEvent.click(screen.getByRole('menuitem', { name: 'Delete' }));
    fireEvent.click(screen.getByRole('menuitem', { name: 'Cancel' }));
    expect(onDelete).not.toHaveBeenCalled();
    expect(screen.queryByRole('menuitem')).toBeNull();
  });
});
