import type { ClassProp } from 'class-variance-authority/types';

import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Drawer — Overlay + an edge-anchored, full-height panel with a flat outer
 * edge (rounded only toward the page). Same behavior as Modal, different
 * decoration.

 */
export const drawerPanel: (props?: ({ side?: 'right' | 'left' | null | undefined; size?: 'sm' | 'md' | 'lg' | null | undefined } & ClassProp)) => string = cva(
  'flex h-dvh flex-col overflow-hidden bg-surface-1 shadow-lg',
  {
    variants: {
      side: {
        right: 'border-l border-border-soft rounded-l-xl',
        left: 'border-r border-border-soft rounded-r-xl',
      },
      size: {
        sm: 'w-[min(300px,calc(100vw-56px))]',
        md: 'w-[min(400px,calc(100vw-56px))]',
        lg: 'w-[min(520px,calc(100vw-56px))]',
      },
    },
    defaultVariants: { side: 'right', size: 'md' },
  },
);

/** The scrolling body row. */
export const drawerBody: (props?: ClassProp | undefined) => string = cva('flex-1 overflow-y-auto p-5 text-sm leading-relaxed text-fg2');

/** The footer row holding the actions. */
export const drawerFooter: (props?: ClassProp | undefined) => string = cva('flex shrink-0 justify-end gap-2.5 border-t border-border-soft bg-surface-sunk px-5 py-3.5');

export type DrawerPanelVariants = VariantProps<typeof drawerPanel>;
