import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Droppable — one behavior (useDroppable), three feedback presentations.
 * Every cva below is keyed on the hook's state (idle | over | reject) —
 * the chrome is the state made visible, never caller-supplied.
 *
 * The inline variant's `radius` uses the same `rounded` scale Touchable
 * uses (default full).
 */

/** inline — invisible until a drag is over it, then ring + dim + glyph. */
export const droppableInline: (props?: ({ state?: 'idle' | 'over' | 'reject' | null | undefined; rounded?: 'full' | 'none' | 'sm' | 'md' | 'lg' | null | undefined } & import('class-variance-authority/types').ClassProp) | undefined) => string = cva(
  [
    'relative inline-flex cursor-pointer border-none bg-transparent p-0',
    'transition-shadow',
  ],
  {
    variants: {
      state: {
        idle: 'shadow-[0_0_0_0_transparent]',
        over: 'shadow-[0_0_0_3px_var(--leaf),var(--shadow-md)]',
        reject: 'shadow-[0_0_0_3px_var(--danger),var(--shadow-md)]',
      },
      rounded: {
        none: 'rounded-none',
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        full: 'rounded-full',
      },
    },
    defaultVariants: { state: 'idle', rounded: 'full' },
  },
);

/** The media inside the inline target dims while a drag is over it. */
export const droppableInlineMedia: (props?: ({ state?: 'idle' | 'over' | 'reject' | null | undefined; rounded?: 'full' | 'none' | 'sm' | 'md' | 'lg' | null | undefined } & import('class-variance-authority/types').ClassProp) | undefined) => string = cva(
  'inline-flex overflow-hidden transition-[filter]',
  {
    variants: {
      state: {
        idle: 'brightness-100',
        over: 'brightness-[0.7]',
        reject: 'brightness-100',
      },
      rounded: {
        none: 'rounded-none',
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        full: 'rounded-full',
      },
    },
    defaultVariants: { state: 'idle', rounded: 'full' },
  },
);

/** zone — a standing dashed target that intensifies under a drag. */
export const droppableZone: (props?: ({ state?: 'idle' | 'over' | 'reject' | null | undefined; compact?: boolean | null | undefined; disabled?: boolean | null | undefined } & import('class-variance-authority/types').ClassProp) | undefined) => string = cva(
  [
    'flex w-full flex-col items-center border-[1.5px] border-dashed',
    'rounded-lg text-fg2 cursor-pointer',
    'transition-[background-color,border-color]',
  ],
  {
    variants: {
      state: {
        idle: 'border-border-strong bg-surface-sunk',
        over: 'border-leaf bg-[color-mix(in_oklab,var(--leaf)_10%,var(--surface-1))]',
        reject:
          'border-danger bg-[color-mix(in_oklab,var(--danger)_8%,var(--surface-1))]',
      },
      compact: {
        false: 'gap-[9px] px-[22px] py-[26px]',
        true: 'gap-1.5 px-[18px] py-4',
      },
      disabled: {
        false: '',
        true: 'cursor-not-allowed',
      },
    },
    defaultVariants: { state: 'idle', compact: false, disabled: false },
  },
);

/** The zone's icon puck — leaf-tinted, lifts while a drag hovers. */
export const droppableZoneIcon: (props?: ({ state?: 'idle' | 'over' | 'reject' | null | undefined; compact?: boolean | null | undefined } & import('class-variance-authority/types').ClassProp) | undefined) => string = cva(
  [
    'inline-flex items-center justify-center rounded-md',
    'transition-transform ease-out',
  ],
  {
    variants: {
      state: {
        idle: 'bg-[color-mix(in_oklab,var(--leaf)_14%,transparent)] text-accent',
        over: 'bg-[color-mix(in_oklab,var(--leaf)_14%,transparent)] text-leaf -translate-y-0.5',
        reject:
          'bg-[color-mix(in_oklab,var(--danger)_14%,transparent)] text-danger',
      },
      compact: {
        false: 'size-[42px]',
        true: 'size-[34px]',
      },
    },
    defaultVariants: { state: 'idle', compact: false },
  },
);

/** region — a full-area overlay floated over wrapped content on drag. */
export const droppableRegionOverlay: (props?: ({ state?: 'idle' | 'over' | 'reject' | null | undefined } & import('class-variance-authority/types').ClassProp) | undefined) => string = cva(
  [
    'absolute inset-0 z-[5] flex flex-col items-center justify-center gap-3',
    'rounded-lg border-2 border-dashed text-white',
    'pointer-events-none backdrop-blur-[2px] transition-opacity',
  ],
  {
    variants: {
      state: {
        idle: 'opacity-0 border-leaf bg-[color-mix(in_oklab,var(--leaf)_16%,color-mix(in_oklab,var(--char-900)_24%,transparent))]',
        over: 'opacity-100 border-leaf bg-[color-mix(in_oklab,var(--leaf)_16%,color-mix(in_oklab,var(--char-900)_24%,transparent))]',
        reject:
          'opacity-100 border-danger bg-[color-mix(in_oklab,var(--danger)_16%,color-mix(in_oklab,var(--char-900)_30%,transparent))]',
      },
    },
    defaultVariants: { state: 'idle' },
  },
);

/** The region overlay's glyph puck. */
export const droppableRegionIcon: (props?: ({ state?: 'idle' | 'over' | 'reject' | null | undefined } & import('class-variance-authority/types').ClassProp) | undefined) => string = cva(
  'flex size-14 items-center justify-center rounded-full shadow-lg',
  {
    variants: {
      state: {
        idle: 'bg-[color-mix(in_oklab,var(--leaf)_80%,transparent)]',
        over: 'bg-[color-mix(in_oklab,var(--leaf)_80%,transparent)]',
        reject: 'bg-[color-mix(in_oklab,var(--danger)_80%,transparent)]',
      },
    },
    defaultVariants: { state: 'idle' },
  },
);

/** The inline target's glyph layer, shown only while a drag hovers. */
export const droppableInlineGlyph: (props?: ({ visible?: boolean | null | undefined } & import('class-variance-authority/types').ClassProp) | undefined) => string = cva(
  'pointer-events-none absolute inset-0 flex items-center justify-center text-white transition-opacity',
  {
    variants: {
      visible: {
        true: 'opacity-100',
        false: 'opacity-0',
      },
    },
  },
);

/** The zone's label: smaller when compact, danger-toned on reject. */
export const droppableZoneLabel: (props?: ({ compact?: boolean | null | undefined; rejected?: boolean | null | undefined } & import('class-variance-authority/types').ClassProp) | undefined) => string = cva(
  'font-semibold',
  {
    variants: {
      compact: {
        true: 'text-[13px]',
        false: 'text-sm',
      },
      rejected: {
        true: 'text-danger',
        false: 'text-fg1',
      },
    },
  },
);

/** The zone's hint line under the label. */
export const droppableZoneHint: (props?: import('class-variance-authority/types').ClassProp | undefined) => string = cva('font-mono text-[11.5px] text-fg3');

/** region — the wrapper the overlay is positioned against. */
export const droppableRegion: (props?: import('class-variance-authority/types').ClassProp | undefined) => string = cva('relative rounded-lg');

/** The region overlay's label. */
export const droppableRegionLabel: (props?: import('class-variance-authority/types').ClassProp | undefined) => string = cva('font-display text-lg font-bold [text-shadow:0_1px_3px_rgba(0,0,0,0.3)]');

/** The region overlay's hint line under the label. */
export const droppableRegionHint: (props?: import('class-variance-authority/types').ClassProp | undefined) => string = cva('text-[13px] opacity-85 [text-shadow:0_1px_3px_rgba(0,0,0,0.3)]');

/** The hidden file input behind click-to-pick. */
export const droppableFileInput: (props?: import('class-variance-authority/types').ClassProp | undefined) => string = cva('hidden');

export type DroppableInlineVariants = VariantProps<typeof droppableInline>;
export type DroppableZoneVariants = VariantProps<typeof droppableZone>;
