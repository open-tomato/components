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

export type NotificationPuckVariants = VariantProps<typeof notificationPuck>;
export type NotificationRowVariants = VariantProps<typeof notificationRow>;
