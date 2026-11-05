// @@T mol-1 begin
import type { ClassProp } from 'class-variance-authority/types';

// @@T mol-1 end
import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Select — single choice built on the Menu primitive: the
 * same anchored popover + item list, with an option checkmark and a
 * chevrons-up-down trigger.
 *
 * On Radix DropdownMenu the trigger reports menu semantics (rather than
 * listbox/option) — selection state is still announced via aria-checked
 * on the items.
 */
// @@T mol-1 begin
export const selectTrigger: (props?: { size?: 'sm' | 'md' | null } & ClassProp) => string = cva(
// @@T mol-1 end
  [
    'inline-flex min-w-0 items-center gap-2 px-[11px] rounded-md',
    'bg-surface-1 border border-border-strong text-fg1',
    'text-[13.5px] font-semibold cursor-pointer',
  ],
  {
    variants: {
      size: {
        sm: 'h-8',
        md: 'h-[38px]',
      },
    },
    defaultVariants: { size: 'md' },
  },
);

// @@V mol-1 begin
/** The trigger's leading icon and trailing chevron: fixed width, muted. */
export const selectAdornment: (props?: ClassProp) => string = cva('shrink-0 text-fg3');

/** The trigger's current label: fills the row, truncates. */
export const selectValue: (props?: ClassProp) => string = cva('min-w-0 flex-1 truncate text-left');

/** An option's label inside the dropdown: fills the row, truncates. */
export const selectItemLabel: (props?: ClassProp) => string = cva('min-w-0 flex-1 truncate');

/** The checkmark on the selected option. */
export const selectItemIndicator: (props?: ClassProp) => string = cva('shrink-0 text-primary');
// @@V mol-1 end

export type SelectTriggerVariants = VariantProps<typeof selectTrigger>;
