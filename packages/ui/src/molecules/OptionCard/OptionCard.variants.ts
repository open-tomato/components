// @@T mol-3 begin
import type { ClassProp } from 'class-variance-authority/types';
// @@T mol-3 end

import { cva, type VariantProps } from 'class-variance-authority';

/**
 * OptionCard — one selectable card for both auth pickers: workspace choice
 * (centered, 20px radio) and 2FA method choice (top-aligned, 18px radio).
 */
// @@T mol-3 begin
export const optionCard: (props?: { selected?: boolean | null | undefined; align?: 'center' | 'start' | null | undefined } & ClassProp) => string = cva(
// @@T mol-3 end

  [
    'flex w-full cursor-pointer gap-3 rounded-lg border p-3.5 text-left',
    'bg-surface-1 border-border-soft transition-colors',
  ],
  {
    variants: {
      selected: {
        false: '',
        true: 'border-accent bg-[color-mix(in_oklab,var(--accent)_6%,var(--surface-1))]',
      },
      align: {
        center: 'items-center',
        start: 'items-start',
      },
    },
    defaultVariants: { selected: false, align: 'center' },
  },
);

/** Workspace titles are display-face 15px; 2FA method titles body 14px. */
// @@T mol-3 begin
export const optionCardTitle: (props?: { align?: 'center' | 'start' | null | undefined } & ClassProp) => string = cva('font-bold text-fg1', {
// @@T mol-3 end

  variants: {
    align: {
      center: 'font-display text-[15px]',
      start: 'text-sm',
    },
  },
  defaultVariants: { align: 'center' },
});

// @@T mol-3 begin
export const optionCardIndicator: (props?: { selected?: boolean | null | undefined; align?: 'center' | 'start' | null | undefined } & ClassProp) => string = cva(
// @@T mol-3 end
  'flex shrink-0 items-center justify-center rounded-full border-2',
  {
    variants: {
      selected: {
        false: 'border-border-strong bg-transparent',
        true: 'border-accent bg-accent text-on-accent',
      },
      align: {
        center: 'size-5',
        start: 'size-[18px]',
      },
    },
    defaultVariants: { selected: false, align: 'center' },
  },
);

// @@V mol-3 begin
/** The text column: title row over the description. */
export const optionCardBody: (props?: ClassProp | undefined) => string = cva('flex min-w-0 flex-1 flex-col');

/** The title with its meta companion. */
export const optionCardTitleRow: (props?: ClassProp | undefined) => string = cva('flex items-center gap-2');

/** The greyed description; top-aligned (2FA) cards sit it a little lower. */
export const optionCardDescription: (props?: { align?: 'center' | 'start' | null | undefined } & ClassProp) => string = cva('text-xs leading-normal text-fg3', {
  variants: {
    align: {
      center: 'mt-0.5',
      start: 'mt-1',
    },
  },
  defaultVariants: { align: 'center' },
});
// @@V mol-3 end

export type OptionCardVariants = VariantProps<typeof optionCard>;
