import type { ClassProp } from 'class-variance-authority/types';

import { cva, type VariantProps } from 'class-variance-authority';

/**
 * WorkspaceSwitcher — the topbar's workspace pill + recent-workspaces menu.
 * From the original TopbarLive screen WorkspaceSwitcher
 * (the original topbar screen "Workspace switcher" card); app-shell spec: Top Bar.
 * The trigger is fixed/max width (truncating), and the component carries
 * no topbar-scope dependency — it may later live in the sidebar.
 */
// @@T tpl-1 begin
export const workspaceSwitcherTrigger: (props?: ClassProp) => string = cva([
// @@T tpl-1 end
  'flex max-w-[240px] cursor-pointer items-center gap-2.5',
  'rounded-md border border-border-soft bg-surface-sunk px-2.5 py-1.5',
  'font-body text-[13px] text-fg1 transition-colors hover:bg-surface-2',
]);

/** A recent-workspace row (the menu's top section). */
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

/** The trigger's active-workspace name, truncating inside the pill. */
export const workspaceSwitcherName: (props?: ClassProp) => string = cva(
  'min-w-0 truncate font-semibold',
);

/** The trigger's trailing chevron. */
export const workspaceSwitcherChevron: (props?: ClassProp) => string = cva('shrink-0 text-fg3');

/** The open menu's fixed width. */
export const workspaceSwitcherMenu: (props?: ClassProp) => string = cva('w-[300px]');

/** The check mark trailing the active recent-workspace row. */
export const workspaceRowCheck: (props?: ClassProp) => string = cva('shrink-0 text-accent');

/** A recent row's body: the mark beside the name and member count. */
export const workspaceRowBody: (props?: ClassProp) => string = cva(
  'flex min-w-0 items-center gap-2.5',
);

/** A recent row's text column. */
export const workspaceRowText: (props?: ClassProp) => string = cva('min-w-0');

/** A recent row's workspace name. */
export const workspaceRowName: (props?: ClassProp) => string = cva(
  'block truncate text-[13px] font-semibold',
);

/** A recent row's mono member count under the name. */
export const workspaceRowMembers: (props?: ClassProp) => string = cva(
  'block font-mono text-[11px] font-normal text-fg3',
);

/** The "See all workspaces" row's trailing mono total. */
export const workspaceSwitcherTotal: (props?: ClassProp) => string = cva(
  'font-mono text-[11px] text-fg3',
);
// @@V tpl-1 end
