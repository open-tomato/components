import { forwardRef, type HTMLAttributes } from 'react';

import { cn } from '../../lib';

import { BranchInline } from './BranchInline';
import {
  entityCellStack,
  entityMeta,
  // @@V mol-3 begin
  entityMetaSeparator,
  sessionCellAgent,
  // @@V mol-3 end
  type SessionStatus,
} from './KnownEntities.variants';
import { SessionInline } from './SessionInline';

export interface SessionCellProps extends HTMLAttributes<HTMLDivElement> {
  /** Session name (top line, with the status dot). */
  name: string;
  status: SessionStatus;
  /** Agent instance id (`agent-7d2f`) — greyed meta line. */
  agentInstanceId: string;
  /** Branch the session runs on — rendered as a branch-inline. */
  branch?: string;
}

/**
 * `session-cell` — double line: `session-inline` on top, and
 * `{agent instance id} · {branch-inline}` greyed below (spec:
 * "Known Entities"; rendered reference: the
 * Sessions table session column).
 */
// @@T mol-3 begin
export const SessionCell: import('react').ForwardRefExoticComponent<
  SessionCellProps & import('react').RefAttributes<HTMLDivElement>
> = forwardRef<HTMLDivElement, SessionCellProps>(
// @@T mol-3 end
  ({ className, name, status, agentInstanceId, branch, ...props }, ref) => (
    <div ref={ref} className={cn(entityCellStack(), className)} {...props}>
      <SessionInline name={name} status={status} />
      <span className={entityMeta()}>
        {/* @@V mol-3 begin */}
        <span className={sessionCellAgent()}>{agentInstanceId}</span>
        {branch != null && (
          <>
            <span className={entityMetaSeparator()}>·</span>
            {/* @@V mol-3 end */}
            <BranchInline name={branch} />
          </>
        )}
      </span>
    </div>
  ),
);

SessionCell.displayName = 'SessionCell';
