import type { ClassProp } from 'class-variance-authority/types';

import { cva, type VariantProps } from 'class-variance-authority';

// @@S tpl-1 begin
/**
 * Shared chart color vocabulary — the fixed series palette the original design uses
 * across the Usage dashboard (the model / tool / team series maps in
 * the original Usage screen), expressed as theme-aware
 * text-color utilities. Chart marks paint with `currentColor` (SVG
 * stroke/fill, or `bg-current` on divs), so a single axis colors every
 * chart component the same way and follows light/dark automatically.
 *
 * `neutral`/`muted` map to fg2/fg3 (char-200 / warm-500 in light) rather
 * than the original literals so dark mode stays legible.
 */
// @@S tpl-1 end
// @@T tpl-1 begin
export const chartTone: (
  props?: {
    tone?: 'accent' | 'primary' | 'gold' | 'info' | 'success' | 'danger' | 'neutral' | 'muted' | null | undefined;
  } & ClassProp,
) => string = cva('', {
// @@T tpl-1 end
  variants: {
    tone: {
      accent: 'text-accent',
      primary: 'text-primary',
      gold: 'text-gold-500',
      info: 'text-info',
      success: 'text-success',
      danger: 'text-danger',
      neutral: 'text-fg2',
      muted: 'text-fg3',
    },
  },
  defaultVariants: { tone: 'accent' },
});

export type ChartToneVariants = VariantProps<typeof chartTone>;
export type ChartTone = NonNullable<ChartToneVariants['tone']>;
