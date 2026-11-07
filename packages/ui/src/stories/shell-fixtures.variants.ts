import type { ClassProp } from 'class-variance-authority/types';

import { cva } from 'class-variance-authority';

/** TopbarDemo's search field width. */
export const topbarDemoSearch: (props?: ClassProp) => string = cva('w-[220px]');

/** PlaceholderPage's column of blocks. */
export const placeholderPage: (props?: ClassProp) => string = cva('flex flex-col gap-4');

/** PlaceholderPage's heading bar. */
export const placeholderPageHeading: (props?: ClassProp) => string = cva(
  'h-8 w-44 rounded-md bg-surface-sunk',
);

/** PlaceholderPage's three-column card row. */
export const placeholderPageGrid: (props?: ClassProp) => string = cva('grid grid-cols-3 gap-4');

/** One card of PlaceholderPage's three-column row. */
export const placeholderPageCard: (props?: ClassProp) => string = cva(
  'h-[120px] rounded-lg border border-border-soft bg-surface-1 shadow-xs',
);

/** PlaceholderPage's tall panel under the card row. */
export const placeholderPagePanel: (props?: ClassProp) => string = cva(
  'h-[260px] rounded-lg border border-border-soft bg-surface-1 shadow-xs',
);

/** LiveShell's framed 560px viewport the shell renders in. */
export const liveShellFrame: (props?: ClassProp) => string = cva(
  'flex h-[560px] overflow-hidden rounded-xl border border-border-strong bg-bg shadow-lg',
);
