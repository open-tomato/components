// @@T tpl-1 begin
// @@S tpl-1 begin
import type { FC, ReactNode } from 'react';
// @@S tpl-1 end
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

// @@S tpl-1 begin
export interface SidebarQuotaProps {
  /** Drives the pill's copy and tone. */
  status: 'healthy' | 'unhealthy';
  /** Amount used so far in the period. */
  used: number;
  /** The period's limit. */
  limit: number;
  /** Heading slot, left of the status pill. */
  title?: ReactNode;
  /** Unit label after the limit; omitted when not given. */
  unit?: string;
  /** Hidden entirely when the rail is collapsed. */
  collapsed?: boolean;
  className?: string;
}

/**
 * The sidebar's quota widget (app-shell spec: Side Bar) — deliberately a
 * STUB for the PoC: a heading slot + a healthy/unhealthy status pill,
 * used-over-limit, and a progress bar underneath. The caller aligns it to
 * the bottom of the nav area (a flex spacer above); bottom-anchoring is
 * composition, not widget state.
 */
export const SidebarQuota: FC<SidebarQuotaProps> = ({
// @@S tpl-1 end
  status,
  used,
  limit,
  // @@S tpl-1 begin
  title = 'usage',
  unit,
  // @@S tpl-1 end
  collapsed = false,
  className,
}: SidebarQuotaProps) => {
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
            {/* @@S tpl-1 begin */}
            {title}
            {/* @@S tpl-1 end */}
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
            {/* @@S tpl-1 begin */}
            / {formatNumber(limit)}{unit
              ? ` ${unit}`
              : ''}
            {/* @@S tpl-1 end */}
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

// @@S tpl-1 begin
SidebarQuota.displayName = 'SidebarQuota';
// @@S tpl-1 end
