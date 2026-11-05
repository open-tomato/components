import type { HTMLAttributes } from 'react';

import { cn } from '../../lib';

// @@V ato-2 begin
import {
  passwordStrength,
  passwordStrengthLabel,
  passwordStrengthSegment,
} from './PasswordStrength.variants';
// @@V ato-2 end

/** Meter colors by score: 1 danger, 2–3 gold, 4–5 success. */
const FILL_BY_SCORE = ['danger', 'gold', 'gold', 'success', 'success'] as const;

export interface PasswordStrengthProps extends HTMLAttributes<HTMLDivElement> {
  /** 0 (empty) … 5 — from passwordStrength() in src/lib. */
  score: number;
  label: string;
}

// @@T ato-2 begin
export const PasswordStrength: {
  (props: PasswordStrengthProps): import('react').JSX.Element;
  displayName: string;
} = ({
// @@T ato-2 end
  className,
  score,
  label,
  ...props
}) => (
  // @@V ato-2 begin
  <div className={cn(passwordStrength(), className)} {...props}>
    {/* @@V ato-2 end */}
    {[1, 2, 3, 4, 5].map((i) => (
      <span
        key={i}
        className={passwordStrengthSegment({
          fill: i <= score
            ? FILL_BY_SCORE[score - 1]
            : 'empty',
        })}
      />
    ))}
    {/* @@V ato-2 begin */}
    <span className={passwordStrengthLabel()}>{label}</span>
    {/* @@V ato-2 end */}
  </div>
);

PasswordStrength.displayName = 'PasswordStrength';
