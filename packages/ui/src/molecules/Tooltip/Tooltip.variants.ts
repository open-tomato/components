import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Tooltip — an anchored transient on hover/focus; a Popover cousin on the
 * Toast's dark chrome.
 *
 * Anchoring/hover/focus behavior is Radix's; enter/leave motion is
 * deferred to the motion pass.
 */
// @@T mol-2 begin
export const tooltip: (props?: import('class-variance-authority/types').ClassProp | undefined) => string =
// @@T mol-2 end
  cva(
    [
      'z-popover rounded-sm bg-char-800 px-2.5 py-1.5',
      'text-xs font-medium text-cream-50 whitespace-nowrap shadow-md select-none',
    ],
  );

// @@V mol-2 begin
/** The arrow, filled to match the dark chrome. */
export const tooltipArrow: (props?: import('class-variance-authority/types').ClassProp | undefined) => string = cva('fill-char-800');
// @@V mol-2 end

export type TooltipVariants = VariantProps<typeof tooltip>;
