import type { ClassProp } from 'class-variance-authority/types';

import { cva, type VariantProps } from 'class-variance-authority';

/**
 * AppShell — the capstone (the original appshell demo). It invents almost no new behavior:
 * the 3-zone frame is pure layout (a flex row wrapping a flex column), the
 * nav is a column of NavItems, the topbar menus are the Menu primitive, and
 * collapse is ONE piece of controlled parent state threaded down.
 *
 * Widths come from the theme definition's --sidebar-w /
 * --sidebar-w-collapsed (264 ⇄ 64). Reconciliation: the chapter's usage
 * block sketches `Shell direction="row"` / `Shell.Scroll`, an API the Shell
 * atom (the original primitives demo) never had — the rendered demo is plain
 * aside/main/header flex zones, which is what ships here.
 */

/** The frame: sidebar | main, filling whatever box the parent gives it. */
export const appShell: (props?: ClassProp) => string = cva('flex h-full w-full overflow-hidden bg-bg');

/** The rail — collapse animates width; content is clipped, never squashed. */
export const appShellSidebar: (
  props?: {
    collapsed?: boolean | null | undefined;
  } & ClassProp,
) => string = cva(
  [
    'flex shrink-0 flex-col overflow-hidden',
    'bg-surface-1 border-r border-border-soft',
    'transition-[width] ease-out',
  ],
  {
    variants: {
      collapsed: {
        false: 'w-[var(--sidebar-w)]',
        true: 'w-[var(--sidebar-w-collapsed)]',
      },
    },
    defaultVariants: { collapsed: false },
  },
);

/** The main column next to the rail: topbar | scrolling content. */
export const appShellMain: (props?: ClassProp) => string = cva(
  'flex min-w-0 flex-1 flex-col overflow-hidden',
);

/** The 60px sticky band — translucent bg over a backdrop blur. */
export const appShellTopbar: (props?: ClassProp) => string = cva([
  'flex h-[60px] shrink-0 items-center gap-3.5 px-[18px]',
  'border-b border-border-soft',
  'bg-[color-mix(in_oklab,var(--bg)_80%,transparent)]',
  'backdrop-blur-[12px]',
]);

/**
 * The rail's brand row: as tall as the topbar, with the same divider, so the
 * two line up across the frame. Centred when the rail is collapsed.
 */
export const appShellBrand: (
  props?: {
    collapsed?: boolean | null | undefined;
  } & ClassProp,
) => string = cva('flex h-[60px] shrink-0 items-center gap-2.5 border-b border-border-soft', {
  variants: {
    collapsed: {
      false: 'justify-start px-[18px]',
      true: 'justify-center p-0',
    },
  },
  defaultVariants: { collapsed: false },
});

/** The brand row's wordmark, at the rail's 17px; one line, ellipsized. */
export const appShellBrandWordmark: (props?: ClassProp) => string = cva(
  'truncate font-display text-[17px] font-bold tracking-[-0.02em] text-fg1',
);

/**
 * The topbar's page title. It takes the band's free space, so what follows
 * it sits at the far end, and it ellipsizes before it pushes them out.
 */
export const appShellTitle: (props?: ClassProp) => string = cva(
  'min-w-0 flex-1 truncate font-display text-lg font-bold tracking-[-0.015em] text-fg1',
);

/** Takes the free space of a flex zone, pushing what follows to its far end. */
export const appShellSpacer: (props?: ClassProp) => string = cva('flex-1');

/** The content slot — the only scrolling element in the shell. */
export const appShellContent: (props?: ClassProp) => string = cva(
  'flex-1 overflow-y-auto bg-bg px-[22px] pb-7 pt-5',
);

/**
 * The optional content footer (app-shell spec: Main Content) —
 * copyright + general links, riding at the bottom of the scroll flow.
 */
export const appShellFooter: (props?: ClassProp) => string = cva([
  'mt-7 flex flex-wrap items-center gap-x-4 gap-y-1.5',
  'border-t border-border-soft pt-4',
  'text-xs text-fg3 [&_a]:text-fg3 [&_a:hover]:text-fg1',
]);

/**
 * The sidebar's quota card (app-shell spec: Side Bar) — a
 * stub for now: status pill + used-over-limit progress underneath.
 */
export const weekSummaryCard: (props?: ClassProp) => string = cva([
  'flex flex-col gap-1.5 rounded-md border border-border-soft',
  'bg-surface-sunk px-3 py-2.5',
]);

/** A rail nav entry — active is a tone, collapse is a prop, not its state. */
export const navItem: (
  props?: {
    active?: boolean | null | undefined;
    collapsed?: boolean | null | undefined;
  } & ClassProp,
) => string = cva(
  [
    'flex w-full items-center gap-[11px] rounded-md border-none',
    'text-left text-sm cursor-pointer',
    'transition-[background-color]',
  ],
  {
    variants: {
      active: {
        false: 'bg-transparent font-medium text-fg2 [&_svg]:text-fg2',
        true: 'bg-surface-sunk font-semibold text-fg1 [&_svg]:text-primary',
      },
      collapsed: {
        false: 'justify-start px-[11px] py-[9px]',
        true: 'justify-center p-[9px]',
      },
    },
    defaultVariants: { active: false, collapsed: false },
  },
);

/** The topbar's sidebar toggle — pulled flush to the band's left padding. */
export const appShellToggle: (props?: ClassProp) => string = cva('-ml-1 shrink-0');

/** A nav entry's leading icon slot — never shrinks under a long label. */
export const navItemIcon: (props?: ClassProp) => string = cva('shrink-0');

/** A nav entry's label — one line, ellipsized. */
export const navItemLabel: (props?: ClassProp) => string = cva('truncate');

/** The data-driven nav column — the collapsed rail tightens its inset. */
export const sidebarNav: (
  props?: {
    collapsed?: boolean | null | undefined;
  } & ClassProp,
) => string = cva('flex flex-col gap-0.5 pt-1', {
  variants: {
    collapsed: {
      false: 'px-3',
      true: 'px-2',
    },
  },
  defaultVariants: { collapsed: false },
});

/** The bordered quick-access band at the rail's foot. */
export const sidebarQuickAccess: (
  props?: {
    collapsed?: boolean | null | undefined;
  } & ClassProp,
) => string = cva('flex flex-col gap-0.5 border-t border-border-soft', {
  variants: {
    collapsed: {
      false: 'px-3 pb-3 pt-2',
      true: 'p-2',
    },
  },
  defaultVariants: { collapsed: false },
});

/** A quick-access external link's text override, merged last over navItem. */
export const quickAccessLink: (props?: ClassProp) => string = cva('!text-fg2 !no-underline');

/** The quota widget's outer inset around its card. */
export const weekSummary: (props?: ClassProp) => string = cva('px-3 py-2');

/** The card's first row: eyebrow left, status pill right. */
export const weekSummaryHeader: (props?: ClassProp) => string = cva('flex items-center justify-between');

/** The heading eyebrow. */
export const weekSummaryEyebrow: (props?: ClassProp) => string = cva(
  'font-mono text-[10px] uppercase tracking-[0.08em] text-fg3',
);

/** The used-over-limit row, aligned on the text baseline. */
export const weekSummaryFigures: (props?: ClassProp) => string = cva('flex items-baseline gap-1.5');

/** The amount-used figure. */
export const weekSummaryUsed: (props?: ClassProp) => string = cva(
  'font-display text-[22px] font-bold tracking-[-0.01em] text-fg1',
);

/** The "/ limit unit" trailer. */
export const weekSummaryLimit: (props?: ClassProp) => string = cva('text-xs text-fg3');

/** The thin progress bar under the figures. */
export const weekSummaryProgress: (props?: ClassProp) => string = cva('h-1');

export type AppShellSidebarVariants = VariantProps<typeof appShellSidebar>;
export type AppShellBrandVariants = VariantProps<typeof appShellBrand>;
export type NavItemVariants = VariantProps<typeof navItem>;
