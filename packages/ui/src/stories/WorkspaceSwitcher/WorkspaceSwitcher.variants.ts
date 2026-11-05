import type { ClassProp } from 'class-variance-authority/types';

import { cva, type VariantProps } from 'class-variance-authority';

// @@S tpl-1 begin
/**
 * Group switcher — the topbar's group pill + recent-groups menu.
 * From the topbar demo screen's "group switcher" card; app-shell spec: Top Bar.
 * The trigger is fixed/max width (truncating), and the component carries
 * no topbar-scope dependency — it may later live in the sidebar.
 */
// @@S tpl-1 end
// @@T tpl-1 begin
export const workspaceSwitcherTrigger: (props?: ClassProp) => string = cva([
// @@T tpl-1 end
  'flex max-w-[240px] cursor-pointer items-center gap-2.5',
  'rounded-md border border-border-soft bg-surface-sunk px-2.5 py-1.5',
  'font-body text-[13px] text-fg1 transition-colors hover:bg-surface-2',
]);

// @@S tpl-1 begin
/** A recent-group row (the menu's top section). */
// @@S tpl-1 end
// @@T tpl-1 begin
export const workspaceRow: (
  props?: {
    active?: boolean | null | undefined;
  } & ClassProp,
) => string = cva(
// @@T tpl-1 end
  [
    'flex w-full cursor-pointer select-none items-center gap-2.5',
    'rounded-md px-2.5 py-2 text-left outline-none',
    'data-[highlighted]:bg-surface-sunk',
  ],
  {
    variants: {
      active: {
        false: '',
        true: 'bg-surface-sunk',
      },
    },
    defaultVariants: { active: false },
  },
);

export type WorkspaceRowVariants = VariantProps<typeof workspaceRow>;
// @@V tpl-1 begin

// @@S tpl-1 begin
/** The trigger's active-group name, truncating inside the pill. */
// @@S tpl-1 end
export const workspaceSwitcherName: (props?: ClassProp) => string = cva(
  'min-w-0 truncate font-semibold',
);

/** The trigger's trailing chevron. */
export const workspaceSwitcherChevron: (props?: ClassProp) => string = cva('shrink-0 text-fg3');

/** The open menu's fixed width. */
export const workspaceSwitcherMenu: (props?: ClassProp) => string = cva('w-[300px]');

// @@S tpl-1 begin
/** The check mark trailing the active recent-group row. */
// @@S tpl-1 end
export const workspaceRowCheck: (props?: ClassProp) => string = cva('shrink-0 text-accent');

/** A recent row's body: the mark beside the name and member count. */
export const workspaceRowBody: (props?: ClassProp) => string = cva(
  'flex min-w-0 items-center gap-2.5',
);

/** A recent row's text column. */
export const workspaceRowText: (props?: ClassProp) => string = cva('min-w-0');

// @@S tpl-1 begin
/** A recent row's group name. */
// @@S tpl-1 end
export const workspaceRowName: (props?: ClassProp) => string = cva(
  'block truncate text-[13px] font-semibold',
);

/** A recent row's mono member count under the name. */
export const workspaceRowMembers: (props?: ClassProp) => string = cva(
  'block font-mono text-[11px] font-normal text-fg3',
);

// @@S tpl-1 begin
/** The "See all groups" row's trailing mono total. */
// @@S tpl-1 end
export const workspaceSwitcherTotal: (props?: ClassProp) => string = cva(
  'font-mono text-[11px] text-fg3',
);
// @@V tpl-1 end
