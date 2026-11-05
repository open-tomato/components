import { forwardRef, type HTMLAttributes } from 'react';

import { Avatar } from '../../atoms/Avatar';
import { cn } from '../../lib';

import {
  // @@V mol-3 begin
  entityCellStack,
  // @@V mol-3 end
  entityTitle,
  entityTitleName,
  entityTitleSub,
} from './KnownEntities.variants';

export interface AgentTitleProps extends HTMLAttributes<HTMLDivElement> {
  /** Agent display name — bold top line, drives the avatar initials. */
  name: string;
  /** Greyed second line (role, model, instance id, …). */
  subtitle?: string;
}

/**
 * `agent-title` — avatar on the left; name (bold) over a greyed subtitle
 * on the right (spec: "Known Entities"; used by the
 * session-detail runner metadata card).
 */
// @@T mol-3 begin
export const AgentTitle: import('react').ForwardRefExoticComponent<
  AgentTitleProps & import('react').RefAttributes<HTMLDivElement>
> = forwardRef<HTMLDivElement, AgentTitleProps>(
// @@T mol-3 end
  ({ className, name, subtitle, ...props }, ref) => (
    <div ref={ref} className={cn(entityTitle(), className)} {...props}>
      <Avatar name={name} size="md" shape="rounded" status="none" />
      {/* @@V mol-3 begin */}
      <div className={entityCellStack()}>
        {/* @@V mol-3 end */}
        <span className={entityTitleName()}>{name}</span>
        {subtitle != null && (
          <span className={entityTitleSub()}>{subtitle}</span>
        )}
      </div>
    </div>
  ),
);

AgentTitle.displayName = 'AgentTitle';
