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

export type SelectTriggerVariants = VariantProps<typeof selectTrigger>;
