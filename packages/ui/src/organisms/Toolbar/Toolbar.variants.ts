import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Toolbar — the controlled filter+search compound over the Table
 * (the original toolbar demo). It owns the QUERY (search text + active filters +
 * density), never the data: displayed rows are parent-derived, the Table
 * stays a pure function of them.
 *
 * One owner per frame: in the DS-default DETACHED presentation the toolbar
 * surface and the Table each own their frame; ATTACHED hands the frame to
 * this surface and the Table renders frame={false}. `ToolbarSummary
 * divided` carries the original demo's attached-mode divider (a table follows
 * inside the same surface).
 */
export const toolbarSurface: (props?: import('class-variance-authority/types').ClassProp) => string = cva(
  [
    'overflow-hidden rounded-lg bg-surface-1',
    'border border-border-soft shadow-xs',
  ],
);

/** Row 1 — search + filter dropdowns + view controls, on the sunk band. */
export const toolbarControls: (props?: import('class-variance-authority/types').ClassProp) => string = cva(
  [
    'flex flex-wrap items-center gap-2.5 px-4 py-[13px]',
    'border-b border-border-soft bg-surface-sunk',
  ],
);

/** Row 2 — result count, active-filter chips, clear-all. */
export const toolbarSummary: (props?: ({ divided?: boolean | null | undefined } & import('class-variance-authority/types').ClassProp) | undefined) => string = cva(

  'flex flex-wrap items-center gap-2 px-4 py-[11px]',
  {
    variants: {
      divided: {
        false: 'border-b-0',
        true: 'border-b border-border-soft',
      },
    },
    defaultVariants: { divided: false },
  },
);

/** The filter trigger — accent-tinted while any value is selected. */
export const filterTrigger: (props?: ({ active?: boolean | null | undefined } & import('class-variance-authority/types').ClassProp) | undefined) => string = cva(

  [
    'inline-flex h-[38px] items-center gap-2 px-3 rounded-md border',
    'text-[13.5px] font-semibold cursor-pointer',
  ],
  {
    variants: {
      active: {
        false: 'bg-surface-1 text-fg1 border-border-strong [&_svg]:text-fg3',
        true: [
          'bg-[color-mix(in_oklab,var(--accent)_12%,var(--surface-1))]',
          'text-accent border-[color-mix(in_oklab,var(--accent)_40%,transparent)]',
          '[&_svg]:text-accent',
        ],
      },
    },
    defaultVariants: { active: false },
  },
);

/** The search field control (the original toolbar demo SearchInput). */
export const searchInput: (props?: ({ clearable?: boolean | null | undefined } & import('class-variance-authority/types').ClassProp) | undefined) => string = cva(

  [
    'h-[38px] w-full rounded-md bg-surface-1 border border-border-strong',
    'font-body text-sm text-fg1 placeholder:text-fg3',
    'outline-none focus-visible:border-border-focus',
    'focus-visible:shadow-[0_0_0_2px_var(--bg),0_0_0_4px_color-mix(in_oklab,var(--leaf)_55%,transparent)]',
  ],
  {
    variants: {
      clearable: {
        false: 'pl-9 pr-3',
        true: 'px-9',
      },
    },
    defaultVariants: { clearable: false },
  },
);

export type ToolbarSummaryVariants = VariantProps<typeof toolbarSummary>;
export type FilterTriggerVariants = VariantProps<typeof filterTrigger>;

/** The filter trigger's count badge, shown while any value is selected. */
export const filterCount: (props?: import('class-variance-authority/types').ClassProp | undefined) => string = cva(
  'inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-accent px-[5px] font-mono text-[11px] font-bold text-on-accent',
);

/** A filter option's trailing checkbox, filled while the option is on. */
export const filterCheck: (props?: ({ on?: boolean | null | undefined } & import('class-variance-authority/types').ClassProp) | undefined) => string = cva(
  'inline-flex size-[17px] shrink-0 items-center justify-center rounded-[5px] border-[1.5px] transition-colors',
  {
    variants: {
      on: {
        true: 'border-accent bg-accent text-on-accent',
        false: 'border-border-strong bg-transparent',
      },
    },
    defaultVariants: { on: false },
  },
);

/** A filter option's label row: swatch and label side by side. */
export const filterOptionLabel: (props?: import('class-variance-authority/types').ClassProp | undefined) => string = cva(
  'inline-flex items-center gap-2',
);

/** The search field's wrapper, which positions the icon and clear button. */
export const searchField: (props?: import('class-variance-authority/types').ClassProp | undefined) => string = cva(
  'relative flex min-w-[190px] flex-[1_1_230px] items-center',
);

/** The search field's leading magnifier icon. */
export const searchIcon: (props?: import('class-variance-authority/types').ClassProp | undefined) => string = cva(
  'pointer-events-none absolute left-3 text-fg3',
);

/** The search field's inline clear button. */
export const searchClear: (props?: import('class-variance-authority/types').ClassProp | undefined) => string = cva(
  'absolute right-2 size-6 justify-center border-none bg-transparent text-fg3',
);

/** The vertical hairline between control clusters. */
export const toolbarSep: (props?: import('class-variance-authority/types').ClassProp | undefined) => string = cva(
  'mx-0.5 w-px self-stretch bg-border-soft',
);
