// @@T mol-1 begin
import { forwardRef, type ForwardRefExoticComponent, type PropsWithoutRef, type RefAttributes } from 'react';
// @@T mol-1 end

import { UsageBar, type UsageBarProps } from './UsageBar';

export type CellBarStroke = 'mini' | 'regular';

export interface CellBarProps extends Omit<UsageBarProps, 'size'> {
  /** Stroke weight — `mini` (5px, in-cell) or `regular` (10px). */
  stroke?: CellBarStroke;
}

/**
 * CellBar — the in-cell bar indicator (spec: the component spec
 * "CellContent → Bar indicator"). A thin alias over the UsageChart's
 * UsageBar — exported from there for exactly this reuse — exposing the
 * spec's stroke vocabulary: `mini` maps to the 5px bar, `regular` to the
 * 10px one. Everything else (ratio semantics, >100% overflow treatment,
 * `track` for progress backgrounds, tones) is UsageBar verbatim.
 */
// @@T mol-1 begin
export const CellBar: ForwardRefExoticComponent<PropsWithoutRef<CellBarProps> & RefAttributes<HTMLDivElement>> = forwardRef<HTMLDivElement, CellBarProps>(
// @@T mol-1 end
  ({ stroke = 'regular', ...props }, ref) => (
    <UsageBar
      ref={ref}
      size={stroke === 'mini'
        ? 'sm'
        : 'md'}
      {...props}
    />
  ),
);

CellBar.displayName = 'CellBar';
