// @@T ato-3 begin
import type { ClassProp } from 'class-variance-authority/types';

// @@T ato-3 end
import { cva, type VariantProps } from 'class-variance-authority';

// @@S ato-3 begin
/**
 * StatusIndicator — the standalone inline status dot (spec-driven,
 * the component spec). `Badge dot` already draws one inside a pill; this
 * is the free-floating atom for list rows, table cells, live counters.
 *
 * Tones follow the table-status scale (ok/warn/err/info/disabled); the original
 * DS pulses live dots with the pulseRing keyframes already mapped to
 * `animate-pulse-ring` in src/styles/theme.css.
 */
// @@S ato-3 end
// @@T ato-3 begin
export const statusIndicator: (
  props?: {
    tone?: 'ok' | 'warn' | 'err' | 'info' | 'disabled' | null | undefined;
    shape?: 'circle' | 'square' | null | undefined;
    size?: 'sm' | 'md' | 'lg' | null | undefined;
    pulse?: boolean | null | undefined;
  } & ClassProp,
) => string = cva(
// @@T ato-3 end

  'inline-block shrink-0',
  {
    variants: {
      tone: {
        ok: 'bg-success',
        warn: 'bg-gold-500',
        err: 'bg-danger',
        info: 'bg-info',
        disabled: 'bg-fg3/50',
      },
      shape: {
        circle: 'rounded-full',
        square: 'rounded-[3px]',
      },
      size: {
        sm: 'size-1.5',
        md: 'size-2',
        lg: 'size-2.5',
      },
      pulse: {
        false: '',
        true: 'animate-pulse-ring motion-reduce:animate-none',
      },
    },
    defaultVariants: { tone: 'ok', shape: 'circle', size: 'md', pulse: false },
  },
);

export type StatusIndicatorVariants = VariantProps<typeof statusIndicator>;
