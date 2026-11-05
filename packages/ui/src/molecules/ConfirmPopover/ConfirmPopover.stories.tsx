import type { Meta, StoryObj } from '@storybook/react-vite';

import { useState } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';

import { Badge } from '../../atoms/Badge';
import { Button } from '../../atoms/Button';
import { Icon } from '../../atoms/Icon';
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuSep,
  MenuTrigger,
} from '../../atoms/Menu';

import { ConfirmInline, ConfirmPopover } from './ConfirmPopover';

// @@S mol-3 begin
/**
 * The reusable confirmation ("Confirmation popover" card; app-shell spec).
 * Two flavours: standalone (anchored to any
 * trigger) and inline (in-place, e.g. replacing a menu item). The message
 * always names the action and its object — never a bare "are you sure?" —
 * and the confirm button names it again ("Yes, delete", never OK).
 */
// @@S mol-3 end
// @@T mol-3 begin
const meta: Meta<typeof ConfirmPopover> = {
// @@T mol-3 end
  title: 'Molecules/ConfirmPopover',
  component: ConfirmPopover,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

const noop = () => {};

// @@S mol-3 begin
/**
 * Standalone flavour, destructive: the "Delete item…" example.
 * Open by default for the docs; focus lands on Cancel (the panel's first
 * focusable), so Enter never destroys by accident.
 */
// @@S mol-3 end
export const StandaloneDanger: Story = {
  args: {
    message: '',
    confirmLabel: 'Yes, delete',
    onConfirm: noop,
    children: null,
  },
  render: () => (
    <div className="flex min-h-[240px] items-start justify-center pt-2">
      <ConfirmPopover
        message={(
          <>
            {/* @@S mol-3 begin */}
            Delete the item <b>example-item</b>? This removes 9
            related records too.
            {/* @@S mol-3 end */}
          </>
        )}
        confirmLabel="Yes, delete"
        cancelLabel="Keep it"
        danger
        onConfirm={noop}
        defaultOpen
      >
        <Button variant="danger" iconLeading={<Icon name="trash-2" size={15} />}>
          {/* @@S mol-3 begin */}
          Delete item…
          {/* @@S mol-3 end */}
        </Button>
      </ConfirmPopover>
    </div>
  ),
};

/**
 * Standalone flavour, consequential-but-not-destructive: the confirm
 * button stays primary; the panel chrome is the same (the original design
 * tints the box identically for both).
 */
export const StandaloneNeutral: Story = {
  args: {
    message: '',
    confirmLabel: 'Archive',
    onConfirm: noop,
    children: null,
  },
  render: () => (
    <div className="flex min-h-[240px] items-start justify-center pt-2">
      <ConfirmPopover
        // @@S mol-3 begin
        message="Archive this group? Members keep access but no new items can be started."
        // @@S mol-3 end
        confirmLabel="Archive"
        onConfirm={noop}
        defaultOpen
      >
        <Button variant="secondary" iconLeading={<Icon name="package" size={15} />}>
          {/* @@S mol-3 begin */}
          Archive group…
          {/* @@S mol-3 end */}
        </Button>
      </ConfirmPopover>
    </div>
  ),
};

/** Inline flavour on its own — the panel as it renders in-place. */
export const InlinePanel: Story = {
  args: {
    message: '',
    confirmLabel: 'Yes, log out',
    onConfirm: noop,
    children: null,
  },
  render: () => (
    <div className="w-[260px]">
      <ConfirmInline
        message="Log out of Acme?"
        confirmLabel="Yes, log out"
        danger
        onConfirm={noop}
        onCancel={noop}
      />
    </div>
  ),
};

const InMenuDemo = () => {
  const [open, setOpen] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [confirmed, setConfirmed] = useState(0);
  return (
    <div className="flex min-h-[260px] flex-col items-center gap-3 pt-2">
      <Menu
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (!next) setConfirming(false);
        }}
      >
        <MenuTrigger asChild>
          {/* @@S mol-3 begin */}
          <Button variant="secondary">Item actions</Button>
          {/* @@S mol-3 end */}
        </MenuTrigger>
        <MenuContent size="md">
          {confirming
            ? (
              <ConfirmInline
                host="menu"
                message={(
                  <>
                    {/* @@S mol-3 begin */}
                    This action will <strong>archive</strong> the item
                    {/* @@S mol-3 end */}
                    {' '}
                    <strong className="font-mono text-xs">auth-refactor</strong>
                    {' '}
                    — do you want to proceed?
                  </>
                )}
                confirmLabel="Archive"
                danger
                onConfirm={() => {
                  setConfirmed((c) => c + 1);
                  setOpen(false);
                  setConfirming(false);
                }}
                onCancel={() => setConfirming(false)}
              />
            )
            : (
              <>
                <MenuItem icon={<Icon name="eye" size={15} />}>Open</MenuItem>
                <MenuSep />
                <MenuItem
                  tone="danger"
                  icon={<Icon name="archive" size={15} />}
                  onSelect={(e) => {
                    e.preventDefault();
                    setConfirming(true);
                  }}
                >
                  Archive
                </MenuItem>
              </>
            )}
        </MenuContent>
      </Menu>
      {confirmed > 0 && <Badge tone="info">confirmed · {confirmed}</Badge>}
    </div>
  );
};

/**
 * Inline flavour hosted in a Radix menu — the RowContextAction /
 * ProfileMenu shape. The Cancel/Confirm buttons are `DropdownMenu.Item
 * asChild`, so they join the menu's roving tabindex; the play() drives
 * the whole path with real keyboard events: arrow to the destructive
 * item, Enter to swap in the confirmation, arrow between Cancel and
 * Confirm, Enter on Confirm.
 */
export const InlineInMenuKeyboard: Story = {
  args: {
    message: '',
    confirmLabel: 'Archive',
    onConfirm: noop,
    children: null,
  },
  render: () => <InMenuDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    // The menu opens rendered; arrow down to the destructive item.
    const archiveItem = await body.findByRole('menuitem', { name: 'Archive' });
    archiveItem.focus();
    await userEvent.keyboard('{Enter}');
    // The confirmation swaps in; Cancel takes focus.
    const cancel = await body.findByRole('menuitem', { name: 'Cancel' });
    await waitFor(() => expect(cancel).toHaveFocus());
    // Arrow keys rove between the confirm panel's items.
    await userEvent.keyboard('{ArrowDown}');
    const confirm = body.getByRole('menuitem', { name: 'Archive' });
    await waitFor(() => expect(confirm).toHaveFocus());
    // Enter activates the focused Confirm item.
    await userEvent.keyboard('{Enter}');
    await expect(await canvas.findByText('confirmed · 1')).toBeVisible();
  },
};
