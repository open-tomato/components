// @@T mol-1 begin
import { forwardRef, type HTMLAttributes, type ForwardRefExoticComponent, type PropsWithoutRef, type RefAttributes } from 'react';
// @@T mol-1 end

import { touchable } from '../../atoms/Touchable/Touchable.variants';
import { cn } from '../../lib';

// @@V mol-1 begin
import { paginationButton, paginationRoot } from './Pagination.variants';
// @@V mol-1 end

export interface PaginationProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  count: number;
  index: number;
  onChange?: (index: number) => void;
}

const Arrow = ({ left = false }: { left?: boolean }) => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d={left
      ? 'M15 18l-6-6 6-6'
      : 'M9 18l6-6-6-6'} />
  </svg>
);

// @@T mol-1 begin
export const Pagination: ForwardRefExoticComponent<PropsWithoutRef<PaginationProps> & RefAttributes<HTMLDivElement>> = forwardRef<HTMLDivElement, PaginationProps>(
// @@T mol-1 end
  ({ className, count, index, onChange, ...props }, ref) => (
    <div
      ref={ref}
      // @@V mol-1 begin
      className={cn(paginationRoot(), className)}
      // @@V mol-1 end
      {...props}
    >
      <button
        type="button"
        aria-label="Previous"
        disabled={index === 0}
        onClick={() => onChange?.(Math.max(0, index - 1))}
        // @@V mol-1 begin
        className={cn(
          touchable({ inline: true, rounded: 'md', noBrightness: false }),
          paginationButton({ active: false }),
        )}
        // @@V mol-1 end
      >
        <Arrow left />
      </button>
      {Array.from({ length: count }, (_, i) => (
        <button
          key={i}
          type="button"
          aria-current={i === index
            ? 'page'
            : undefined}
          onClick={() => onChange?.(i)}
          // @@V mol-1 begin
          className={cn(
            touchable({ inline: true, rounded: 'md', noBrightness: false }),
            paginationButton({ active: i === index }),
          )}
          // @@V mol-1 end
        >
          {i + 1}
        </button>
      ))}
      <button
        type="button"
        aria-label="Next"
        disabled={index === count - 1}
        onClick={() => onChange?.(Math.min(count - 1, index + 1))}
        // @@V mol-1 begin
        className={cn(
          touchable({ inline: true, rounded: 'md', noBrightness: false }),
          paginationButton({ active: false }),
        )}
        // @@V mol-1 end
      >
        <Arrow />
      </button>
    </div>
  ),
);

Pagination.displayName = 'Pagination';
