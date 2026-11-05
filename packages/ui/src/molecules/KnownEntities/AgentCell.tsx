import type { IconName } from '../../atoms/Icon';

import { forwardRef, type HTMLAttributes } from 'react';

import { Icon } from '../../atoms/Icon';
// @@V mol-3 begin
import { cn, type ChartTone } from '../../lib';

import {
  entityCell,
  entityCellStack,
  entityTile,
  entityTitleName,
  entityTitleSub,
  entityTone,
} from './KnownEntities.variants';
// @@V mol-3 end

export interface AgentCellProps extends HTMLAttributes<HTMLDivElement> {
  /** Agent display name — bold top line. */
  name: string;
  /** The model it runs — greyed mono subtitle. */
  model: string;
  /** Agent accent (shared chart palette) — colors the glyph tile. */
  tone?: ChartTone;
  /** Tile glyph (defaults to the original design's `bot`). */
  icon?: IconName;
}

/**
 * `agent-cell` — the smaller agent-title with the model as subtitle
 * (spec: "Known Entities"; rendered reference: the
 * Sessions table agent·model column — a 24px accent-tinted bot tile next
 * to name over model).
 */
// @@T mol-3 begin
export const AgentCell: import('react').ForwardRefExoticComponent<
  AgentCellProps & import('react').RefAttributes<HTMLDivElement>
> = forwardRef<HTMLDivElement, AgentCellProps>(
// @@T mol-3 end
  ({ className, name, model, tone = 'primary', icon = 'bot', ...props }, ref) => (
    <div ref={ref} className={cn(entityCell(), className)} {...props}>
      {/* @@V mol-3 begin */}
      <span className={cn(entityTile({ size: 'sm' }), entityTone({ tone }))}>
        <Icon name={icon} size={13} />
      </span>
      <div className={entityCellStack()}>
        {/* @@V mol-3 end */}
        <span className={entityTitleName()}>{name}</span>
        <span className={entityTitleSub()}>{model}</span>
      </div>
    </div>
  ),
);

AgentCell.displayName = 'AgentCell';
