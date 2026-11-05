// @@V org-1 begin
import type { ClassProp } from 'class-variance-authority/types';
// @@V org-1 end

import { cva, type VariantProps } from 'class-variance-authority';

/**
 * NotificationsBell — ghost bell icon button + notifications popover.
 * From the original TopbarLive screen NotificationsBell
 * (the original topbar screen "Notifications" card); app-shell spec: Top Bar.
 *
 * Spec-over-original divergence (recorded): the spec groups the popover by
 * level (ok / warn / err / info); the original demo renders a flat list with
 * level-tinted pucks only. The spec wins — items render under mono level
 * labels, in ok → warn → err → info order.
 */

/** The 28px level-tinted icon puck on each row. */
// @@T org-1 begin
export const notificationPuck: (props?: ({ level?: 'ok' | 'warn' | 'err' | 'info' | null | undefined } & import('class-variance-authority/types').ClassProp) | undefined) => string = cva(
// @@T org-1 end
  'flex size-7 shrink-0 items-center justify-center rounded-full',
  {
    variants: {
      level: {
        ok: 'bg-[color-mix(in_oklab,var(--success)_14%,transparent)] text-success',
        warn: 'bg-[color-mix(in_oklab,var(--warning)_14%,transparent)] text-gold-500',
        err: 'bg-[color-mix(in_oklab,var(--danger)_14%,transparent)] text-danger',
        info: 'bg-[color-mix(in_oklab,var(--info)_14%,transparent)] text-info',
      },
    },
    defaultVariants: { level: 'info' },
  },
);

/** A notification row — unread rows carry a faint accent wash. */
// @@T org-1 begin
export const notificationRow: (props?: ({ unread?: boolean | null | undefined } & import('class-variance-authority/types').ClassProp) | undefined) => string = cva(
// @@T org-1 end
  [
    'flex w-full cursor-pointer select-none items-start gap-2.5',
    'rounded-sm px-2.5 py-2 text-left outline-none',
    'data-[highlighted]:bg-surface-sunk',
  ],
  {
    variants: {
      unread: {
        false: 'bg-transparent',
        true: 'bg-[color-mix(in_oklab,var(--accent)_4%,transparent)]',
      },
    },
    defaultVariants: { unread: false },
  },
);

/** The bell's unread dot (raw: primary red, ringed by the topbar fill). */
// @@T org-1 begin
export const notificationDot: (props?: import('class-variance-authority/types').ClassProp) => string = cva([
// @@T org-1 end
  'absolute right-1.5 top-1.5 size-2 rounded-full bg-primary',
  'shadow-[0_0_0_2px_var(--surface-2)]',
]);

// @@V org-1 begin
/* ── Ad-hoc classes moved in by stream V ────────── */

/** The bell trigger — anchors the unread dot. */
export const notificationTrigger: (props?: ClassProp | undefined) => string = cva('relative');

/** The popover surface, merged over MenuContent. */
export const notificationPopover: (props?: ClassProp | undefined) => string = cva('w-[380px] p-0');

/** Popover header row: title block + mark-all-read. */
export const notificationHeader: (props?: ClassProp | undefined) => string = cva('flex items-center justify-between border-b border-border-soft px-4 py-3');

/** Popover title line. */
export const notificationTitle: (props?: ClassProp | undefined) => string = cva('font-display text-[15px] font-bold text-fg1');

/** Unread / total count line under the title. */
export const notificationCount: (props?: ClassProp | undefined) => string = cva('font-mono text-[11px] text-fg3');

/** The mark-all-read text button. */
export const notificationMarkAll: (props?: ClassProp | undefined) => string = cva('cursor-pointer rounded-sm border-none bg-transparent text-xs font-semibold text-accent outline-none data-[disabled]:cursor-not-allowed data-[disabled]:text-fg3 data-[highlighted]:underline');

/** Scrolling list of grouped rows. */
export const notificationList: (props?: ClassProp | undefined) => string = cva('max-h-[360px] overflow-y-auto p-1.5');

/** A row's inner layout: puck, text, unread mark. */
export const notificationRowInner: (props?: ClassProp | undefined) => string = cva('flex w-full items-start gap-2.5');

/** A row's text column. */
export const notificationText: (props?: ClassProp | undefined) => string = cva('min-w-0 flex-1');

/** A row's title + time line. */
export const notificationTitleRow: (props?: ClassProp | undefined) => string = cva('flex items-baseline justify-between gap-2');

/** A row's title. */
export const notificationItemTitle: (props?: ClassProp | undefined) => string = cva('truncate text-[13px] font-semibold text-fg1');

/** A row's relative time chip. */
export const notificationTime: (props?: ClassProp | undefined) => string = cva('shrink-0 font-mono text-[10px] font-normal text-fg3');

/** A row's body text. */
export const notificationBody: (props?: ClassProp | undefined) => string = cva('mt-0.5 block whitespace-normal text-xs font-normal leading-[1.45] text-fg3');

/** A row's trailing unread mark. */
export const notificationUnreadMark: (props?: ClassProp | undefined) => string = cva('mt-2 size-2 shrink-0 rounded-full bg-accent');

/** Popover footer holding the see-all item. */
export const notificationFooter: (props?: ClassProp | undefined) => string = cva('border-t border-border-soft p-1.5');
// @@V org-1 end

export type NotificationPuckVariants = VariantProps<typeof notificationPuck>;
export type NotificationRowVariants = VariantProps<typeof notificationRow>;
