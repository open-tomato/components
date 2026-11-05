// @@T org-1 begin
import type { ClassProp } from 'class-variance-authority/types';
// @@T org-1 end

import { cva, type VariantProps } from 'class-variance-authority';

/**
 * The form kit — every input is the SAME envelope (label + control +
 * hint/error) wrapped around a single interactive control; each control just
 * reads `value` and calls `onChange`. Mirrors
 * the original form-controls demo (+ the .otx-field-control
 * and .otx-range CSS from the original demo shell).
 *
 * Naming reconciliation: the original form-controls demo calls the envelope `Field`, but
 * the library already ships the original children demo Field atom (label + built-in
 * input), so the envelope is `FormField` here. The original demo's `Toggle` is the
 * shipped Switch atom — FormKit composes it rather than re-implementing.
 */

/** The focus ring every text-like control shares (.otx-field-control). */
const CONTROL_FOCUS = [
  'outline-none focus-visible:border-border-focus',
  'focus-visible:shadow-[0_0_0_2px_var(--bg),0_0_0_4px_color-mix(in_oklab,var(--leaf)_55%,transparent)]',
];

// @@T org-1 begin
export const textInput: (props?: ({ invalid?: boolean | null | undefined } & ClassProp) | undefined) => string = cva(
// @@T org-1 end
  [
    'h-[42px] w-full rounded-md bg-surface-1 border px-[13px]',
    'font-body text-[14.5px] text-fg1 placeholder:text-fg3',
    ...CONTROL_FOCUS,
  ],
  {
    variants: {
      invalid: {
        false: 'border-border-strong',
        true: 'border-danger',
      },
    },
    defaultVariants: { invalid: false },
  },
);

// @@T org-1 begin
export const textarea: (props?: ({ invalid?: boolean | null | undefined } & ClassProp) | undefined) => string = cva(
// @@T org-1 end
  [
    'w-full rounded-md bg-surface-1 border px-[13px] py-[11px] resize-y',
    'font-body text-[14.5px] leading-normal text-fg1 placeholder:text-fg3',
    ...CONTROL_FOCUS,
  ],
  {
    variants: {
      invalid: {
        false: 'border-border-strong',
        true: 'border-danger',
      },
    },
    defaultVariants: { invalid: false },
  },
);

/** The 19px checkbox square. */
// @@T org-1 begin
export const checkboxBox: (props?: ({ checked?: boolean | null | undefined } & ClassProp) | undefined) => string = cva(
// @@T org-1 end
  [
    'mt-px inline-flex size-[19px] shrink-0 items-center justify-center',
    'rounded-[5px] border-[1.5px] transition-colors',
  ],
  {
    variants: {
      checked: {
        false: 'border-border-strong bg-surface-1',
        true: 'border-primary bg-primary',
      },
    },
    defaultVariants: { checked: false },
  },
);

/** Grid the CheckGroup lays its options into. */
// @@T org-1 begin
export const checkGroup: (props?: ({ columns?: 1 | 2 | null | undefined } & ClassProp) | undefined) => string = cva('grid gap-2.5', {
// @@T org-1 end
  variants: {
    columns: {
      1: 'grid-cols-1',
      2: 'grid-cols-2',
    },
  },
  defaultVariants: { columns: 1 },
});

/** A radio option row — a bordered card that tints when selected. */
// @@T org-1 begin
export const radioOption: (props?: ({ checked?: boolean | null | undefined } & ClassProp) | undefined) => string = cva(
// @@T org-1 end
  [
    'flex w-full items-center gap-[11px] rounded-md px-[13px] py-[11px]',
    'text-left cursor-pointer border',
  ],
  {
    variants: {
      checked: {
        false: 'border-border-soft bg-surface-1',
        true: 'border-primary bg-[color-mix(in_oklab,var(--primary)_8%,var(--surface-1))]',
      },
    },
    defaultVariants: { checked: false },
  },
);

/** The 18px radio circle. */
// @@T org-1 begin
export const radioCircle: (props?: ({ checked?: boolean | null | undefined } & ClassProp) | undefined) => string = cva(
// @@T org-1 end
  [
    'inline-flex size-[18px] shrink-0 items-center justify-center',
    'rounded-full border-2',
  ],
  {
    variants: {
      checked: {
        false: 'border-border-strong',
        true: 'border-primary',
      },
    },
    defaultVariants: { checked: false },
  },
);

/** The range input (.otx-range) — track fill driven by --pct. */
// @@T org-1 begin
export const sliderInput: (props?: ClassProp | undefined) => string = cva([
// @@T org-1 end
  'h-1.5 flex-1 cursor-pointer appearance-none rounded-full outline-none',
  'border border-border-soft',
  'bg-[linear-gradient(to_right,var(--primary)_var(--pct,50%),var(--surface-sunk)_var(--pct,50%))]',
  '[&::-webkit-slider-thumb]:appearance-none',
  '[&::-webkit-slider-thumb]:size-[18px]',
  '[&::-webkit-slider-thumb]:rounded-full',
  '[&::-webkit-slider-thumb]:bg-surface-1',
  '[&::-webkit-slider-thumb]:border-2',
  '[&::-webkit-slider-thumb]:border-solid',
  '[&::-webkit-slider-thumb]:border-primary',
  '[&::-webkit-slider-thumb]:shadow-xs',
  '[&::-webkit-slider-thumb]:cursor-pointer',
  '[&::-moz-range-thumb]:size-[18px]',
  '[&::-moz-range-thumb]:rounded-full',
  '[&::-moz-range-thumb]:bg-surface-1',
  '[&::-moz-range-thumb]:border-2',
  '[&::-moz-range-thumb]:border-solid',
  '[&::-moz-range-thumb]:border-primary',
  '[&::-moz-range-thumb]:shadow-xs',
  '[&::-moz-range-thumb]:cursor-pointer',
  'focus-visible:shadow-[0_0_0_2px_var(--bg),0_0_0_4px_color-mix(in_oklab,var(--leaf)_55%,transparent)]',
]);

/** The landed-file chip FileDrop swaps to once a file is set. */
// @@T org-1 begin
export const fileChip: (props?: ClassProp | undefined) => string = cva([
// @@T org-1 end
  'flex items-center gap-[11px] rounded-md px-[13px] py-[11px]',
  'bg-surface-1 border border-border-soft',
]);

/* ── WS03d additions ("FormKit additions") ────────── */

/**
 * VerboseOption — generalized from the original design ModelOption
 * (the original AgentEditor screen): a bordered option
 * row with radio/checkbox semantics that tints accent when selected.
 * Original uses the accent scale for selection (vs the primary-toned
 * RadioGroup above) — kept as rendered truth of the source screens.
 */
// @@T org-1 begin
export const verboseOption: (props?: ({ selected?: boolean | null | undefined } & ClassProp) | undefined) => string = cva(
// @@T org-1 end
  [
    'flex w-full items-start gap-2.5 rounded-md border px-3 py-2.5',
    'text-left cursor-pointer transition-colors',
    'disabled:opacity-50 disabled:cursor-not-allowed',
  ],
  {
    variants: {
      selected: {
        false: 'border-border-soft bg-surface-1',
        true: 'border-accent bg-[color-mix(in_oklab,var(--accent)_8%,var(--surface-1))]',
      },
    },
    defaultVariants: { selected: false },
  },
);

/** VerboseOption's leading control glyph (16px, accent when selected). */
// @@T org-1 begin
export const verboseControl: (props?: ({ mode?: 'checkbox' | 'radio' | null | undefined; selected?: boolean | null | undefined } & ClassProp) | undefined) => string = cva(
// @@T org-1 end
  [
    'relative mt-0.5 inline-flex size-4 shrink-0 items-center',
    'justify-center border-2',
  ],
  {
    variants: {
      mode: {
        radio: 'rounded-full',
        checkbox: 'rounded-[4px]',
      },
      selected: {
        false: 'border-border-strong bg-transparent',
        true: 'border-accent bg-accent text-on-accent',
      },
    },
    defaultVariants: { mode: 'radio', selected: false },
  },
);

/** The mono capability pill on a VerboseOption ("web", "code", …). */
// @@T org-1 begin
export const verboseCap: (props?: ClassProp | undefined) => string = cva([
// @@T org-1 end
  'rounded-full border border-border-soft bg-surface-sunk',
  'px-[7px] py-px font-mono text-[10px] text-fg3',
]);

/**
 * DecoratedToggle — generalized from the original design ToolPicker rows
 * (the original AgentEditor demo): a bordered row (decoration + title/description +
 * switch) that tints accent when on. The ROW is the switch control; the
 * Switch atom's track/thumb cvas render decoratively inside it.
 */
// @@T org-1 begin
export const decoratedToggle: (props?: ({ checked?: boolean | null | undefined } & ClassProp) | undefined) => string = cva(
// @@T org-1 end
  [
    'flex w-full items-center gap-3 rounded-md border px-3 py-2',
    'text-left cursor-pointer transition-colors',
    'disabled:opacity-50 disabled:cursor-not-allowed',
  ],
  {
    variants: {
      checked: {
        false: 'border-border-soft bg-surface-1',
        true: 'border-accent bg-[color-mix(in_oklab,var(--accent)_8%,var(--surface-1))]',
      },
    },
    defaultVariants: { checked: false },
  },
);

/** DecoratedToggleList's group header (mono label + x/y-on indicator). */
// @@T org-1 begin
export const decoratedToggleHeader: (props?: ClassProp | undefined) => string = cva([
// @@T org-1 end
  'mb-1.5 flex items-center gap-2 font-mono text-[10px]',
  'uppercase tracking-[0.1em] text-fg3',
]);

/**
 * ChipList — the chip-input container (the component spec ChipList):
 * selected chips render IN the container; in multi mode the input stays
 * below them, in single mode the chip takes over until removed.
 */
// @@T org-1 begin
export const chipListBox: (props?: ClassProp | undefined) => string = cva([
// @@T org-1 end
  'flex w-full flex-col gap-2 rounded-md border border-border-strong',
  'bg-surface-1 px-[13px] py-[9px]',
  'focus-within:border-border-focus',
  'focus-within:shadow-[0_0_0_2px_var(--bg),0_0_0_4px_color-mix(in_oklab,var(--leaf)_55%,transparent)]',
]);

/** A ChipList suggestion row. */
// @@T org-1 begin
export const chipListOption: (props?: ({ active?: boolean | null | undefined } & ClassProp) | undefined) => string = cva(
// @@T org-1 end
  [
    'flex w-full cursor-pointer items-center gap-2.5 rounded-sm',
    'border-none px-2.5 py-2 text-left text-[13px] text-fg1',
  ],
  {
    variants: {
      active: {
        false: 'bg-transparent',
        true: 'bg-surface-sunk',
      },
    },
    defaultVariants: { active: false },
  },
);

/** The anchored ChipList suggestion panel. */
// @@T org-1 begin
export const chipListPanel: (props?: ClassProp | undefined) => string = cva([
// @@T org-1 end
  'absolute inset-x-0 top-[calc(100%+6px)] z-popover overflow-hidden',
  'rounded-md border border-border-soft bg-surface-1 p-1 shadow-lg',
]);

/**
 * AvatarSelector — big avatar preview + initials input + color-swatch
 * grid (original design AvatarPicker, the original AgentEditor demo). Tones cover the original
 * AVATAR_COLORS palette.
 */
// @@T org-1 begin
export const avatarPreview: (props?: ({ tone?: 'accent' | 'primary' | 'gold' | 'info' | 'green' | 'slate' | null | undefined } & ClassProp) | undefined) => string = cva(
// @@T org-1 end
  [
    'flex size-[60px] items-center justify-center rounded-md',
    'font-display text-[28px] font-extrabold text-cream-50',
  ],
  {
    variants: {
      tone: {
        primary: 'bg-primary',
        accent: 'bg-accent',
        gold: 'bg-gold-500',
        info: 'bg-info',
        green: 'bg-green-500',
        slate: 'bg-char-200',
      },
    },
    defaultVariants: { tone: 'primary' },
  },
);

/** One color swatch in the AvatarSelector grid. */
// @@T org-1 begin
export const avatarSwatch: (props?: ({ tone?: 'accent' | 'primary' | 'gold' | 'info' | 'green' | 'slate' | null | undefined; selected?: boolean | null | undefined } & ClassProp) | undefined) => string = cva(
// @@T org-1 end
  'size-[18px] cursor-pointer rounded-full p-0 transition-shadow',
  {
    variants: {
      tone: {
        primary: 'bg-primary',
        accent: 'bg-accent',
        gold: 'bg-gold-500',
        info: 'bg-info',
        green: 'bg-green-500',
        slate: 'bg-char-200',
      },
      selected: {
        false: 'border border-border-soft',
        true: 'border-2 border-fg1 shadow-[0_0_0_2px_var(--surface-2),0_0_0_4px_var(--fg1)]',
      },
    },
    defaultVariants: { tone: 'primary', selected: false },
  },
);

// @@V org-1 begin
/* ── Ad-hoc classes moved in by stream V ────────── */

/* AvatarSelector */

/** AvatarSelector root column. */
export const avatarSelector: (props?: ClassProp | undefined) => string = cva('flex w-[60px] flex-col items-center gap-1.5');

/** AvatarSelector initials input. */
export const avatarInitialsInput: (props?: ClassProp | undefined) => string = cva('w-full rounded-sm border border-border-soft bg-surface-1 px-1.5 py-1 text-center font-mono text-xs text-fg2 outline-none focus-visible:border-border-focus');

/** AvatarSelector 3-column swatch grid. */
export const avatarSwatchGrid: (props?: ClassProp | undefined) => string = cva('grid grid-cols-3 gap-1');

/* Checkbox */

/** Checkbox row, merged over touchable. */
export const checkboxRow: (props?: ClassProp | undefined) => string = cva('w-full items-start gap-2.5 border-none bg-transparent p-0.5 text-left');

/** Checkbox check glyph wrapper. */
export const checkboxMark: (props?: ClassProp | undefined) => string = cva('text-on-primary');

/** Checkbox label/hint column. */
export const checkboxText: (props?: ClassProp | undefined) => string = cva('min-w-0');

/** Checkbox label line. */
export const checkboxLabel: (props?: ClassProp | undefined) => string = cva('block text-[13.5px] font-medium text-fg1');

/** Checkbox hint line. */
export const checkboxHint: (props?: ClassProp | undefined) => string = cva('mt-px block text-xs text-fg3');

/* ChipList */

/** ChipList root — anchors the suggestion panel. */
export const chipList: (props?: ClassProp | undefined) => string = cva('relative');

/** ChipList selected-chip row. */
export const chipListChips: (props?: ClassProp | undefined) => string = cva('flex flex-wrap gap-1.5');

/** ChipList bare input inside the box. */
export const chipListInput: (props?: ClassProp | undefined) => string = cva('w-full border-none bg-transparent font-body text-[14.5px] text-fg1 outline-none placeholder:text-fg3');

/** ChipList "No matches." row. */
export const chipListEmpty: (props?: ClassProp | undefined) => string = cva('px-2.5 py-2 text-[13px] text-fg3');

/** ChipList suggestion label. */
export const chipListOptionLabel: (props?: ClassProp | undefined) => string = cva('min-w-0 flex-1 truncate');

/** ChipList "new" tag on a creatable row. */
export const chipListNewTag: (props?: ClassProp | undefined) => string = cva('shrink-0 font-mono text-[10px] uppercase tracking-[0.08em] text-accent');

/* DecoratedToggle */

/** DecoratedToggle leading decoration, accent when on. */
export const decoratedToggleDecoration: (props?: ({ checked?: boolean | null | undefined } & ClassProp) | undefined) => string = cva('shrink-0', {
  variants: {
    checked: {
      false: 'text-fg2',
      true: 'text-accent',
    },
  },
  defaultVariants: { checked: false },
});

/** DecoratedToggle title/description column. */
export const decoratedToggleText: (props?: ClassProp | undefined) => string = cva('min-w-0 flex-1');

/** DecoratedToggle title + meta row. */
export const decoratedToggleTitleRow: (props?: ClassProp | undefined) => string = cva('flex flex-wrap items-center gap-2');

/** DecoratedToggle title. */
export const decoratedToggleTitle: (props?: ClassProp | undefined) => string = cva('font-mono text-[13px] font-semibold text-fg1');

/** DecoratedToggle description. */
export const decoratedToggleDescription: (props?: ClassProp | undefined) => string = cva('block text-xs font-normal text-fg3');

/** DecoratedToggle switch track, merged over switchTrack. */
export const decoratedToggleSwitch: (props?: ClassProp | undefined) => string = cva('shrink-0');

/** DecoratedToggleList header separator dot. */
export const decoratedToggleHeaderDot: (props?: ClassProp | undefined) => string = cva('text-fg2');

/** DecoratedToggleList row column. */
export const decoratedToggleList: (props?: ClassProp | undefined) => string = cva('flex flex-col gap-1.5');

/* FileDrop */

/** FileDrop chip icon tile. */
export const fileChipIcon: (props?: ClassProp | undefined) => string = cva('inline-flex size-[34px] shrink-0 items-center justify-center rounded-sm bg-[color-mix(in_oklab,var(--accent)_13%,var(--surface-1))] text-accent');

/** FileDrop chip name/size column. */
export const fileChipText: (props?: ClassProp | undefined) => string = cva('min-w-0 flex-1');

/** FileDrop chip file name. */
export const fileChipName: (props?: ClassProp | undefined) => string = cva('block truncate text-[13px] font-semibold text-fg1');

/** FileDrop chip file size. */
export const fileChipSize: (props?: ClassProp | undefined) => string = cva('block font-mono text-[11.5px] text-fg3');

/** FileDrop remove button, merged over touchable. */
export const fileChipRemove: (props?: ClassProp | undefined) => string = cva('size-[30px] shrink-0 justify-center border border-border-soft bg-transparent text-fg3');

/* FormField */

/** FormField envelope column. */
export const formField: (props?: ClassProp | undefined) => string = cva('flex flex-col gap-[7px]');

/** FormField label row (label + labelEnd). */
export const formFieldLabelRow: (props?: ClassProp | undefined) => string = cva('flex items-center justify-between gap-2');

/** FormField label. */
export const formFieldLabel: (props?: ClassProp | undefined) => string = cva('inline-flex items-center gap-1 text-[13px] font-semibold text-fg1');

/** FormField required asterisk. */
export const formFieldRequired: (props?: ClassProp | undefined) => string = cva('text-danger');

/** FormField hint, above or below the control. */
export const formFieldHint: (props?: ({ placement?: 'above' | 'below' | null | undefined } & ClassProp) | undefined) => string = cva('', {
  variants: {
    placement: {
      above: '-mt-0.5 text-xs leading-normal text-fg3',
      below: 'text-xs text-fg3',
    },
  },
  defaultVariants: { placement: 'below' },
});

/** FormField error message. */
export const formFieldError: (props?: ClassProp | undefined) => string = cva('inline-flex items-center gap-[5px] text-xs text-danger');

/* RadioGroup */

/** RadioGroup option column. */
export const radioGroup: (props?: ClassProp | undefined) => string = cva('flex flex-col gap-[9px]');

/** RadioGroup selected dot. */
export const radioDot: (props?: ClassProp | undefined) => string = cva('size-[9px] rounded-full bg-primary');

/** RadioGroup label/hint column. */
export const radioText: (props?: ClassProp | undefined) => string = cva('min-w-0');

/** RadioGroup option label. */
export const radioLabel: (props?: ClassProp | undefined) => string = cva('block text-[13.5px] font-semibold text-fg1');

/** RadioGroup option hint. */
export const radioHint: (props?: ClassProp | undefined) => string = cva('mt-px block text-xs text-fg3');

/* Slider */

/** Slider row (track + readout). */
export const slider: (props?: ClassProp | undefined) => string = cva('flex items-center gap-[13px]');

/** Slider mono readout. */
export const sliderReadout: (props?: ClassProp | undefined) => string = cva('min-w-16 text-right font-mono text-[13px] font-semibold text-fg1');

/* TextInput */

/** TextInput wrapper anchoring the slots. */
export const textInputWrap: (props?: ClassProp | undefined) => string = cva('relative flex items-center');

/** TextInput leading slot: a mono text prefix or an icon. */
export const textInputPrefix: (props?: ({ kind?: 'text' | 'icon' | null | undefined } & ClassProp) | undefined) => string = cva('pointer-events-none absolute left-3', {
  variants: {
    kind: {
      text: 'font-mono text-[13px] text-fg3',
      icon: 'inline-flex items-center text-fg3',
    },
  },
  defaultVariants: { kind: 'text' },
});

/** TextInput padding that clears an icon prefix or a suffix (12px inset + 14px glyph + 8px gap). */
export const textInputPad: (props?: ({ iconPrefix?: boolean | null | undefined; suffix?: boolean | null | undefined } & ClassProp) | undefined) => string = cva('', {
  variants: {
    iconPrefix: {
      false: '',
      true: 'pl-[34px]',
    },
    suffix: {
      false: '',
      true: 'pr-[34px]',
    },
  },
  defaultVariants: { iconPrefix: false, suffix: false },
});

/** TextInput trailing slot. */
export const textInputSuffix: (props?: ClassProp | undefined) => string = cva('absolute right-3 inline-flex items-center text-fg3');

/* VerboseOption */

/** VerboseOption radio dot. */
export const verboseRadioDot: (props?: ClassProp | undefined) => string = cva('absolute inset-[3px] rounded-full bg-surface-2');

/** VerboseOption text column. */
export const verboseText: (props?: ClassProp | undefined) => string = cva('min-w-0 flex-1');

/** VerboseOption label + badges row. */
export const verboseTitleRow: (props?: ClassProp | undefined) => string = cva('flex flex-wrap items-center gap-2');

/** VerboseOption label. */
export const verboseLabel: (props?: ClassProp | undefined) => string = cva('font-mono text-[13px] font-semibold text-fg1');

/** VerboseOption non-string badge wrapper. */
export const verboseBadge: (props?: ClassProp | undefined) => string = cva('inline-flex');

/** VerboseOption description. */
export const verboseDescription: (props?: ClassProp | undefined) => string = cva('mt-1 block text-xs font-normal leading-[1.45] text-fg3');

/** VerboseOption meta line. */
export const verboseMeta: (props?: ClassProp | undefined) => string = cva('mt-1 block font-mono text-[11px] font-normal text-fg3');

/** VerboseOptionList column. */
export const verboseOptionList: (props?: ClassProp | undefined) => string = cva('flex flex-col gap-1.5');
// @@V org-1 end

export type VerboseOptionVariants = VariantProps<typeof verboseOption>;
export type VerboseControlVariants = VariantProps<typeof verboseControl>;
export type DecoratedToggleVariants = VariantProps<typeof decoratedToggle>;
export type ChipListOptionVariants = VariantProps<typeof chipListOption>;
export type AvatarSelectorTone = NonNullable<
  VariantProps<typeof avatarPreview>['tone']
>;

export type TextInputVariants = VariantProps<typeof textInput>;
export type TextareaVariants = VariantProps<typeof textarea>;
export type CheckGroupVariants = VariantProps<typeof checkGroup>;
// @@V org-1 begin
export type FormFieldHintVariants = VariantProps<typeof formFieldHint>;
export type TextInputPrefixVariants = VariantProps<typeof textInputPrefix>;
// @@V org-1 end
