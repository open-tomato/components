// @@T ato-3 begin
import type { ClassProp } from 'class-variance-authority/types';
// @@T ato-3 end

import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Divider — a horizontal rule, optionally interrupted by a mono label
 * ("or with email"). Used by the auth screens.
 */
// @@T ato-3 begin
export const divider: (props?: ClassProp) => string = cva(
// @@T ato-3 end
  'flex w-full items-center gap-3',
);

// @@T ato-3 begin
export const dividerRule: (props?: ClassProp) => string = cva(
// @@T ato-3 end
  'h-px flex-1 bg-border-soft',
);

// @@T ato-3 begin
export const dividerLabel: (props?: ClassProp) => string = cva(
// @@T ato-3 end

  'font-mono text-[10px] uppercase tracking-[0.1em] text-fg3',
);

export type DividerVariants = VariantProps<typeof divider>;
