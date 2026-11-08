import { forwardRef, Fragment, type HTMLAttributes } from 'react';

import { cn } from '../../lib';
import { touchableVariants } from '../../particles/touchable';

import { breadcrumb, breadcrumbItem, breadcrumbSeparator } from './Breadcrumb.variants';

export interface SelectionItem {
  key: string;
  label: string;
}

export interface BreadcrumbProps
  extends Omit<HTMLAttributes<HTMLElement>, 'onChange'> {
  items: readonly SelectionItem[];
  index: number;
  onChange?: (index: number) => void;
}

const Chevron = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={breadcrumbSeparator()}
    aria-hidden
  >
    <path d="M9 18l6-6-6-6" />
  </svg>
);

export const Breadcrumb: import('react').ForwardRefExoticComponent<BreadcrumbProps & import('react').RefAttributes<HTMLElement>> = forwardRef<
  HTMLElement, BreadcrumbProps>(
  ({ className, items, index, onChange, ...props }, ref) => (
    <nav
      ref={ref}
      aria-label="Breadcrumb"
      className={cn(breadcrumb(), className)}
      {...props}
    >
      {items.map((item, i) => (
        <Fragment key={item.key}>
          {i > 0 && <Chevron />}
          <button
            type="button"
            aria-current={i === index
              ? 'page'
              : undefined}
            onClick={() => onChange?.(i)}
            className={cn(
              touchableVariants({ inline: true, rounded: 'sm', noBrightness: false }),
              breadcrumbItem({
                state: i === index
                  ? 'current'
                  : i < index
                    ? 'past'
                    : 'upcoming',
              }),
            )}
          >
            {item.label}
          </button>
        </Fragment>
      ))}
    </nav>
  ),
);

Breadcrumb.displayName = 'Breadcrumb';
