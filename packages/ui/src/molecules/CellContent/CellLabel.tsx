import { forwardRef, type HTMLAttributes, type ForwardRefExoticComponent, type PropsWithoutRef, type RefAttributes } from 'react';

import { cn, type ChartTone } from '../../lib';

import {
  cellLabel,
  cellLabelGroup,
  cellLabelTone,
  type CellLabelVariants,
} from './CellContent.variants';

export interface CellLabelItem {
  text: string;
  /** Per-label accent; falls back to the component-level `tone`. */
  tone?: ChartTone;
}

export interface CellLabelProps
  extends HTMLAttributes<HTMLSpanElement>,
  CellLabelVariants {
  /** One label, or an array of them (spec: array support). */
  labels: string | readonly (string | CellLabelItem)[];
  /** Default accent for labels that don't carry their own. */
  tone?: ChartTone;
}

const normalize = (
  labels: CellLabelProps['labels'],
): CellLabelItem[] => (typeof labels === 'string'
  ? [{ text: labels }]
  : labels.map((l) => (typeof l === 'string'
    ? { text: l }
    : l)));

/**
 * CellLabel — accent-colored label-format text with array support (spec:
 * "CellContent → Label"; typical use: ranking labels — subtle or
 * transparent background with a simple accent color). Tones come from the
 * shared chart palette;
 * `bg="soft"` adds the subtle currentColor tint.
 */
export const CellLabel: ForwardRefExoticComponent<PropsWithoutRef<CellLabelProps> & RefAttributes<HTMLSpanElement>> = forwardRef<HTMLSpanElement, CellLabelProps>(
  ({ className, labels, tone, bg, ...props }, ref) => {
    const items = normalize(labels);
    return (
      <span ref={ref} className={cn(cellLabelGroup(), className)} {...props}>
        {items.map((item) => (
          <span
            key={item.text}
            className={cn(
              cellLabel({ bg }),
              cellLabelTone({ tone: item.tone ?? tone ?? 'accent' }),
            )}
          >
            {item.text}
          </span>
        ))}
      </span>
    );
  },
);

CellLabel.displayName = 'CellLabel';
