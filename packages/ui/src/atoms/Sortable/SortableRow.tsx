import type { HTMLAttributes, ReactNode } from 'react';

import { cn } from '../../lib';
import { StrokeIcon } from '../../lib/icons';

// @@V ato-2 begin
import {
  sortableRow,
  sortableRowBody,
  sortableRowGrip,
} from './Sortable.variants';
// @@V ato-2 end

export interface SortableRowProps extends HTMLAttributes<HTMLDivElement> {
  /** Trailing slot (e.g. a status Tag). */
  trailing?: ReactNode;
}

/** A plain drag-handle row — the convenient default renderItem chrome. */
// @@T ato-2 begin
export const SortableRow: {
  (props: SortableRowProps): import('react').JSX.Element;
  displayName: string;
} = ({
// @@T ato-2 end
  className,
  trailing,
  children,
  ...props
}) => (
  <div className={cn(sortableRow(), className)} {...props}>
    {/* @@V ato-2 begin */}
    <span className={sortableRowGrip()}>
      {/* @@V ato-2 end */}
      <StrokeIcon name="gripVertical" size={16} />
    </span>
    {/* @@V ato-2 begin */}
    <div className={sortableRowBody()}>{children}</div>
    {/* @@V ato-2 end */}
    {trailing}
  </div>
);

SortableRow.displayName = 'SortableRow';
