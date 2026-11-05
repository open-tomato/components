import type { IconName } from '../../atoms/Icon';

import { forwardRef, type HTMLAttributes } from 'react';

import { Badge, type BadgeProps } from '../../atoms/Badge';
import { Icon } from '../../atoms/Icon';
// @@V mol-3 begin
import { cn, type ChartTone } from '../../lib';

import {
  entityMeta,
  entityMetaText,
  entityTile,
  entityTitle,
  entityTitleName,
  entityTone,
  toolTitleStack,
} from './KnownEntities.variants';
// @@V mol-3 end

export interface ToolTitleProps extends HTMLAttributes<HTMLDivElement> {
  /** Tool display name — bold top line. */
  name: string;
  /** Tool type (`MCP`, `skill`, `API`) — rendered as a small badge. */
  type: string;
  /** Tool slug id (`gh-search`), greyed mono next to the badge. */
  slug: string;
  /** Tile glyph (defaults to `wrench`). */
  icon?: IconName;
  /** Tile accent (shared chart palette). */
  tone?: ChartTone;
  /** Badge tone for the type (defaults to neutral). */
  badgeTone?: BadgeProps['tone'];
}

/**
 * `tool-title` — icon/avatar tile on the left; double line on the right:
 * bold name on top, a tool-type badge + the slug id below (spec:
 * "Known Entities").
 */
// @@T mol-3 begin
export const ToolTitle: import('react').ForwardRefExoticComponent<
  ToolTitleProps & import('react').RefAttributes<HTMLDivElement>
> = forwardRef<HTMLDivElement, ToolTitleProps>(
// @@T mol-3 end
  (
    {
      className,
      name,
      type,
      slug,
      icon = 'wrench',
      tone = 'accent',
      badgeTone = 'neutral',
      ...props
    },
    ref,
  ) => (
    <div ref={ref} className={cn(entityTitle(), className)} {...props}>
      {/* @@V mol-3 begin */}
      <span className={cn(entityTile({ size: 'md' }), entityTone({ tone }))}>
        <Icon name={icon} size={16} />
      </span>
      <div className={toolTitleStack()}>
        <span className={entityTitleName()}>{name}</span>
        <span className={entityMeta()}>
          <Badge tone={badgeTone} size="sm">{type}</Badge>
          <span className={entityMetaText()}>{slug}</span>
          {/* @@V mol-3 end */}
        </span>
      </div>
    </div>
  ),
);

ToolTitle.displayName = 'ToolTitle';
