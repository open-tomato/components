import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

import { cn } from '../../lib';

import {
  entityCellStack,
  entityMeta,
  // @@V mol-3 begin
  entityMetaSeparator,
  entityMetaText,
  taskCellTag,
  // @@V mol-3 end
  taskCellTitle,
} from './KnownEntities.variants';

export interface TaskCellProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Task title/name — top line. */
  title: ReactNode;
  /** Inline text tags below (`ui · feat`, parent link, subtask count). */
  tags?: readonly string[];
}

/**
 * `task-cell` — double line: task title on top, inline text tags below
 * (spec: "Known Entities"; rendered reference: the
 * Tasks/Roadmap table task column — greyed mono tags separated by
 * middots).
 */
// @@T mol-3 begin
export const TaskCell: import('react').ForwardRefExoticComponent<
  TaskCellProps & import('react').RefAttributes<HTMLDivElement>
> = forwardRef<HTMLDivElement, TaskCellProps>(
// @@T mol-3 end
  ({ className, title, tags, ...props }, ref) => (
    <div ref={ref} className={cn(entityCellStack(), className)} {...props}>
      <span className={taskCellTitle()}>{title}</span>
      {tags != null && tags.length > 0 && (
        <span className={entityMeta()}>
          {tags.map((tag, i) => (
            // @@V mol-3 begin
            <span key={tag} className={taskCellTag()}>
              {i > 0 && <span className={entityMetaSeparator()}>·</span>}
              <span className={entityMetaText()}>{tag}</span>
              {/* @@V mol-3 end */}
            </span>
          ))}
        </span>
      )}
    </div>
  ),
);

TaskCell.displayName = 'TaskCell';
