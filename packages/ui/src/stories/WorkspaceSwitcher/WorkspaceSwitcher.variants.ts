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
