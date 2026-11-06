import type { HTMLAttributes, ReactNode } from 'react';

import { cn } from '../../lib';
import { StrokeIcon } from '../../lib/icons';

import {
  sortableRow,
  sortableRowBody,
  sortableRowGrip,
} from './Sortable.variants';

export interface SortableRowProps extends HTMLAttributes<HTMLDivElement> {
  /** Trailing slot (e.g. a status Tag). */
  trailing?: ReactNode;
}

/** A plain drag-handle row — the convenient default renderItem chrome. */
export const SortableRow: {
  (props: SortableRowProps): import('react').JSX.Element;
  displayName: string;
} = ({
  className,
  trailing,
  children,
  ...props
}) => (
  <div className={cn(sortableRow(), className)} {...props}>
    <span className={sortableRowGrip()}>
      <StrokeIcon name="gripVertical" size={16} />
    </span>
    <div className={sortableRowBody()}>{children}</div>
    {trailing}
  </div>
);

SortableRow.displayName = 'SortableRow';
