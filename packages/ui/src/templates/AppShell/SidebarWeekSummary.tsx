// @@T tpl-1 begin
import type { FC } from 'react';
// @@T tpl-1 end

import { Badge } from '../../atoms/Badge';
import { cn, formatNumber } from '../../lib';
// Deep member import — the built storybook's lazy-init chunking drops
// cross-tree barrel inits (see the built-storybook lazy-init chunking hazard).
import { Progress } from '../../molecules/Progress/Progress';

// @@V tpl-1 begin
import {
  weekSummary,
  weekSummaryCard,
  weekSummaryEyebrow,
  weekSummaryFigures,
  weekSummaryHeader,
  weekSummaryLimit,
  weekSummaryProgress,
  weekSummaryUsed,
} from './AppShell.variants';
// @@V tpl-1 end

export interface SidebarWeekSummaryProps {
  /** Drives the pill's copy and tone. */
  status: 'healthy' | 'unhealthy';
  /** Tokens used this week. */
  used: number;
  /** The week's token limit. */
  limit: number;
  unit?: string;
  /** Hidden entirely when the rail is collapsed. */
  collapsed?: boolean;
  className?: string;
}

/**
 * The sidebar's week-summary widget (app-shell spec: Side Bar) —
 * deliberately a STUB for the PoC: "this week" + a healthy/unhealthy
 * status pill, tokens-over-limit, and a progress bar underneath. The
 * caller aligns it to the bottom of the nav area (a flex spacer above);
 * bottom-anchoring is composition, not widget state.
 */
// @@T tpl-1 begin
export const SidebarWeekSummary: FC<SidebarWeekSummaryProps> = ({
// @@T tpl-1 end
  status,
  used,
  limit,
  unit = 'tokens',
  collapsed = false,
  className,
}: SidebarWeekSummaryProps) => {
  if (collapsed) return null;
  const pct = limit > 0
    ? (used / limit) * 100
    : 0;
  return (
    // @@V tpl-1 begin
    <div className={cn(weekSummary(), className)}>
      <div className={weekSummaryCard()}>
        {/* @@V tpl-1 end */}
        {/* @@V tpl-1 begin */}
        <div className={weekSummaryHeader()}>
          <span className={weekSummaryEyebrow()}>
            {/* @@V tpl-1 end */}
            this week
          </span>
          <Badge
            tone={status === 'healthy'
              ? 'success'
              : 'danger'}
            size="sm"
            dot
          >
            {status}
          </Badge>
        </div>
        {/* @@V tpl-1 begin */}
        <div className={weekSummaryFigures()}>
          <span className={weekSummaryUsed()}>
            {formatNumber(used)}
          </span>
          <span className={weekSummaryLimit()}>
            {/* @@V tpl-1 end */}
            / {formatNumber(limit)} {unit}
          </span>
        </div>
        <Progress
          value={pct}
          tone={status === 'healthy'
            ? 'accent'
            : 'danger'}
          // @@V tpl-1 begin
          className={weekSummaryProgress()}
          // @@V tpl-1 end
        />
      </div>
    </div>
  );
};

SidebarWeekSummary.displayName = 'SidebarWeekSummary';
