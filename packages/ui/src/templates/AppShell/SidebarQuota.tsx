import type { FC, ReactNode } from 'react';

import { Badge } from '../../atoms/Badge';
import { cn, formatNumber } from '../../lib';
// Deep member import — the built storybook's lazy-init chunking drops
// cross-tree barrel inits (see the built-storybook lazy-init chunking hazard).
import { Progress } from '../../molecules/Progress/Progress';

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
  status,
  used,
  limit,
  title = 'usage',
  unit,
  collapsed = false,
  className,
}: SidebarQuotaProps) => {
  if (collapsed) return null;
  const pct = limit > 0
    ? (used / limit) * 100
    : 0;
  return (
    <div className={cn(weekSummary(), className)}>
      <div className={weekSummaryCard()}>
        <div className={weekSummaryHeader()}>
          <span className={weekSummaryEyebrow()}>
            {title}
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
        <div className={weekSummaryFigures()}>
          <span className={weekSummaryUsed()}>
            {formatNumber(used)}
          </span>
          <span className={weekSummaryLimit()}>
            / {formatNumber(limit)}{unit
              ? ` ${unit}`
              : ''}
          </span>
        </div>
        <Progress
          value={pct}
          tone={status === 'healthy'
            ? 'accent'
            : 'danger'}
          className={weekSummaryProgress()}
        />
      </div>
    </div>
  );
};

SidebarQuota.displayName = 'SidebarQuota';
