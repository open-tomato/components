// @@T mol-1 begin
import type { ClassProp } from 'class-variance-authority/types';

// @@T mol-1 end
import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Segmented — "switch a view": a controlled current index over one-of
 * options, in a sunken track.

 */
// @@T mol-1 begin
export const segmented: (props?: ClassProp) => string = cva(
// @@T mol-1 end
  'inline-flex gap-[3px] p-[3px] bg-surface-sunk rounded-md border border-border-soft',
);

// @@T mol-1 begin
export const segmentedItem: (props?: { active?: boolean | null; size?: 'sm' | 'md' | null } & ClassProp) => string = cva('rounded-sm font-body text-[13.5px]', {
// @@T mol-1 end
  variants: {
    active: {
      false: 'bg-transparent text-fg3 font-medium shadow-none',
      true: 'bg-surface-2 text-fg1 font-bold shadow-xs',
    },
    size: {
      sm: 'px-[11px] py-[5px]',
      md: 'px-[15px] py-[7px]',
    },
  },
  defaultVariants: { active: false, size: 'md' },
});

export type SegmentedItemVariants = VariantProps<typeof segmentedItem>;
