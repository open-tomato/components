import type { ClassProp } from 'class-variance-authority/types';

import { cva, type VariantProps } from 'class-variance-authority';
// @@T mol-3 begin
// @@T mol-3 end

/**
 * ConfirmPopover — THE reusable destructive/consequential confirmation
 * (the original TopbarLive demo ConfirmInline + ConfirmPopover; spec:
 * the app-shell spec "Confirmation popover"). Two flavours share one panel:
 * standalone (anchored to any trigger via Radix Popover) and inline
 * (rendered in-place, e.g. replacing a menu item during logout).
 *
 * The panel chrome is constant — the original design tints the box with the
 * danger mix regardless of the `danger` flag; only the confirm button's
 * variant switches (danger vs primary). These cvas supersede the 03c
 * stand-ins that lived in `Table.variants.ts` (confirmPanel /
 * confirmPanelMessage / confirmPanelActions), deleted with the seam swap.
 */
// @@T mol-3 begin
export const confirmPanel: (props?: ClassProp) => string = cva([
  'flex flex-col gap-2.5 rounded-md p-2.5',
  'border border-[color-mix(in_oklab,var(--danger)_30%,var(--border-soft))]',
  'bg-[color-mix(in_oklab,var(--danger)_6%,var(--surface-1))]',
]);
// @@T mol-3 end

// @@T mol-3 begin
export const confirmPanelMessage: (props?: ClassProp) => string = cva(
  'm-0 text-[13px] leading-[1.45] text-fg1',
);
// @@T mol-3 end

// @@T mol-3 begin
export const confirmPanelActions: (props?: ClassProp) => string = cva('flex justify-end gap-1.5');
// @@T mol-3 end

/** The standalone flavour's floating card (raw: width 280, padding 12). */
// @@T mol-3 begin
export const confirmPopoverContent: (props?: ClassProp) => string = cva([
  'z-popover w-[280px] rounded-md p-3',
  'bg-surface-1 border border-border-soft shadow-lg',
]);
// @@T mol-3 end

export type ConfirmPanelVariants = VariantProps<typeof confirmPanel>;
