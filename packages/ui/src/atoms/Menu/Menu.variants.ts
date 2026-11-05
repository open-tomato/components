import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Menu / Popover — Overlay's anchored, scrim-less cousin: a portal positioned
 * to its trigger, dismissed by outside click or Escape, arrow-key navigation.
 * No backdrop, no scroll-lock.
 *
 * No `fixed` on the content — Radix's popper wrapper owns positioning,
 * and a fixed Content inside it would detach from the anchor. `z-popover`
 * stays on the content (the wrapper carries no z-index of its own).
 */
// @@T ato-2 begin
export const menu:
(props?: ({ align?: 'start' | 'end' | null; size?: 'sm' | 'md' | 'lg' | null } & import('class-variance-authority/types').ClassProp) | undefined) => string = cva(
// @@T ato-2 end
  [
    'z-popover flex flex-col gap-px p-1.5 rounded-md',
    'bg-surface-1 border border-border-soft shadow-lg overflow-y-auto',
  ],
  {
    variants: {
      align: {
        start: 'origin-top-left',
        end: 'origin-top-right',
      },
      size: {
        sm: 'w-44',
        md: 'w-56',
        lg: 'w-72',
      },
    },
    defaultVariants: {
      align: 'start',
      size: 'md',
    },
  },
);

/** Item chrome (incl. hover/focus treatment). */
// @@T ato-2 begin
export const menuItem:
(props?: ({ tone?: 'accent' | 'danger' | 'default' | null } & import('class-variance-authority/types').ClassProp) | undefined) => string = cva(
// @@T ato-2 end
  [
    'flex w-full items-center gap-[9px] px-2.5 py-2 text-left',
    'rounded-sm text-[13.5px] font-medium cursor-pointer select-none',
    'outline-none data-[highlighted]:bg-surface-sunk',
    'data-[disabled]:opacity-50 data-[disabled]:pointer-events-none',
  ],
  {
    variants: {
      tone: {
        default: 'text-fg1 [&_svg]:text-fg3',
        danger: 'text-danger [&_svg]:text-danger',
        // The "See all… / New workspace" style affirmative rows in the
        // topbar menus.
        accent: 'text-accent [&_svg]:text-accent',
      },
    },
    defaultVariants: { tone: 'default' },
  },
);

export type MenuVariants = VariantProps<typeof menu>;
export type MenuItemVariants = VariantProps<typeof menuItem>;

// @@V ato-2 begin
/** Item label: takes the free width and truncates. */
export const menuItemLabel: (props?: import('class-variance-authority/types').ClassProp | undefined) => string = cva('min-w-0 flex-1 truncate');

/** Section label (mono caps). */
export const menuLabel: (props?: import('class-variance-authority/types').ClassProp | undefined) => string = cva('px-2.5 pb-[3px] pt-[5px] font-mono text-[10.5px] uppercase tracking-[0.08em] text-fg3');

/** Hairline separator between item groups. */
export const menuSep: (props?: import('class-variance-authority/types').ClassProp | undefined) => string = cva('mx-0.5 my-1 h-px bg-border-soft');
// @@V ato-2 end
