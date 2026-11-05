import type { SelectionItem } from '../Breadcrumb';

// @@T mol-1 begin
import { forwardRef, type HTMLAttributes, type ForwardRefExoticComponent, type PropsWithoutRef, type RefAttributes } from 'react';
// @@T mol-1 end

import { touchable } from '../../atoms/Touchable/Touchable.variants';
import { cn } from '../../lib';

import { segmented, segmentedItem } from './Segmented.variants';

export interface SegmentedProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  items: readonly SelectionItem[];
  index: number;
  onChange?: (index: number) => void;
  size?: 'sm' | 'md';
}

// @@T mol-1 begin
export const Segmented: ForwardRefExoticComponent<PropsWithoutRef<SegmentedProps> & RefAttributes<HTMLDivElement>> = forwardRef<HTMLDivElement, SegmentedProps>(
// @@T mol-1 end
  ({ className, items, index, onChange, size = 'md', ...props }, ref) => (
    <div
      ref={ref}
      role="tablist"
      className={cn(segmented(), className)}
      {...props}
    >
      {items.map((item, i) => (
        <button
          key={item.key}
          type="button"
          role="tab"
          aria-selected={i === index}
          onClick={() => onChange?.(i)}
          className={cn(
            touchable({ inline: true, rounded: 'sm', noBrightness: false }),
            segmentedItem({ active: i === index, size }),
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  ),
);

Segmented.displayName = 'Segmented';
