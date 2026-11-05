import type { ReactElement, ReactNode } from 'react';

import { Badge, type BadgeProps } from '../../atoms/Badge';
import { FormattedRelativeTime } from '../../atoms/Formatted/FormattedRelativeTime';
import { type DateInput } from '../../lib';
import { devWarn } from '../../lib/dev';
// Deep member imports, not the CellContent/KnownEntities barrels — the
// built storybook's lazy-init chunking can drop barrel member inits
// (renders undefined → React #130); see the matching note in
// CellValue.tsx.
// @@S mol-1 begin
import { AmountOverTime, type AmountOverTimeProps } from '../../molecules/CellContent/AmountOverTime';
// @@S mol-1 end
import { CellBar, type CellBarProps } from '../../molecules/CellContent/CellBar';
import { CellDoubleLine, type CellDoubleLineProps } from '../../molecules/CellContent/CellDoubleLine';
import { CellLabel, type CellLabelProps } from '../../molecules/CellContent/CellLabel';
import { CellStatus, type CellStatusProps } from '../../molecules/CellContent/CellStatus';
import { CellValue, type CellValueProps } from '../../molecules/CellContent/CellValue';
// @@S mol-1 begin
import { QuotaProgress, type QuotaProgressProps } from '../../molecules/CellContent/QuotaUsage';
// @@S mol-1 end
import { AgentCell, type AgentCellProps } from '../../molecules/KnownEntities/AgentCell';
import { AgentTitle, type AgentTitleProps } from '../../molecules/KnownEntities/AgentTitle';
import { BranchInline, type BranchInlineProps } from '../../molecules/KnownEntities/BranchInline';
import {
  ModelCell,
  ModelFooter,
  type ModelCellProps,
  type ModelFooterProps,
} from '../../molecules/KnownEntities/ModelCell';
import { SessionCell, type SessionCellProps } from '../../molecules/KnownEntities/SessionCell';
import { SessionInline, type SessionInlineProps } from '../../molecules/KnownEntities/SessionInline';
import { TaskCell, type TaskCellProps } from '../../molecules/KnownEntities/TaskCell';
import { ToolTitle, type ToolTitleProps } from '../../molecules/KnownEntities/ToolTitle';
import { UserInline, type UserInlineProps } from '../../molecules/KnownEntities/UserInline';

import { RowContextAction, type RowContextActionProps } from './RowContextAction';
// @@V org-2 begin
import { cellTypeRelativeTime, cellTypeText } from './Table.variants';
// @@V org-2 end

/**
 * Self-describing column types (spec: "Known
 * Entities" — "a self defining table grid can infer the component to use
 * if the data type for a column is of `{entity}-{variant}`"). Target
 * shape: the JSON table configs in the sessions-page spec / the roadmap-page spec
 * (`session-cell`, `agent-cell`, `quota-progress`, `amount-over-time`,
 * `user-inline`, `task-cell`, `badge`, `text`, `relative-time`,
 * `context-menu`, …).
 *
 * A lightweight lookup, deliberately: one typed data contract per type
 * (`CellTypeDataMap`) and one render function per type. A config-driven
 * table resolves a column's `type` string with `isKnownCellType` and
 * renders each row through `renderCellContent(type, data)` from its
 * column `cell` — the registry never wraps or replaces the Table's own
 * column machinery.
 */

export interface CellTypeDataMap {
  /* known entities */
  'agent-title': AgentTitleProps;
  'agent-cell': AgentCellProps;
  'session-inline': SessionInlineProps;
  'session-cell': SessionCellProps;
  'model-cell': ModelCellProps;
  'model-footer': ModelFooterProps;
  'branch-inline': BranchInlineProps;
  'user-inline': UserInlineProps;
  'task-cell': TaskCellProps;
  'tool-title': ToolTitleProps;
  /* cell-content kit */
  'value': CellValueProps;
  'double-line': CellDoubleLineProps;
  'status': CellStatusProps;
  'label': CellLabelProps;
  'bar': CellBarProps;
  // @@S mol-1 begin
  'quota-progress': QuotaProgressProps;
  'amount-over-time': AmountOverTimeProps;
  // @@S mol-1 end
  /* primitives the configs also name */
  'text': { text: ReactNode };
  'badge': { label: string; tone?: BadgeProps['tone']; dot?: boolean };
  'relative-time': { date: DateInput; now?: DateInput; locale?: string };
  'context-menu': RowContextActionProps;
}

export type KnownCellType = keyof CellTypeDataMap;

type CellRegistry = {
  [K in KnownCellType]: (data: CellTypeDataMap[K]) => ReactElement;
};

const registry: CellRegistry = {
  'agent-title': (d) => <AgentTitle {...d} />,
  'agent-cell': (d) => <AgentCell {...d} />,
  'session-inline': (d) => <SessionInline {...d} />,
  'session-cell': (d) => <SessionCell {...d} />,
  'model-cell': (d) => <ModelCell {...d} />,
  'model-footer': (d) => <ModelFooter {...d} />,
  'branch-inline': (d) => <BranchInline {...d} />,
  'user-inline': (d) => <UserInline {...d} />,
  'task-cell': (d) => <TaskCell {...d} />,
  'tool-title': (d) => <ToolTitle {...d} />,
  'value': (d) => <CellValue {...d} />,
  'double-line': (d) => <CellDoubleLine {...d} />,
  'status': (d) => <CellStatus {...d} />,
  'label': (d) => <CellLabel {...d} />,
  'bar': (d) => <CellBar {...d} />,
  // @@S mol-1 begin
  'quota-progress': (d) => <QuotaProgress {...d} />,
  'amount-over-time': (d) => <AmountOverTime {...d} />,
  // @@S mol-1 end
  'text': (d) => (
    <span
      // @@V org-2 begin
      className={cellTypeText()}
      // @@V org-2 end
    >{d.text}</span>
  ),
  'badge': (d) => (
    <Badge tone={d.tone} size="sm" dot={d.dot}>
      {d.label}
    </Badge>
  ),
  'relative-time': (d) => (
    <span
      // @@V org-2 begin
      className={cellTypeRelativeTime()}
      // @@V org-2 end
    >
      <FormattedRelativeTime date={d.date} now={d.now} locale={d.locale} />
    </span>
  ),
  'context-menu': (d) => <RowContextAction {...d} />,
};

/**
 * Dev-only required-key spot checks for the dynamic (JSON-config) path,
 * where `data` arrives untyped. Deliberately PoC-light — one or two
 * load-bearing keys per type, not a schema: full payload validation is
 * the consuming app's job at its config boundary.
 */
const REQUIRED_KEYS: Record<KnownCellType, string[]> = {
  'agent-title': ['name'],
  'agent-cell': ['name', 'model'],
  'session-inline': ['name', 'status'],
  'session-cell': ['name', 'status', 'agentInstanceId'],
  'model-cell': ['name'],
  'model-footer': ['name'],
  'branch-inline': ['name'],
  'user-inline': ['handle'],
  'task-cell': ['title'],
  'tool-title': ['name', 'type', 'slug'],
  'value': [],
  'double-line': ['title'],
  // status/value: every key is optional (tone defaults to ok).
  'status': [],
  'label': ['labels'],
  'bar': ['ratio'],
  // @@S mol-1 begin
  'quota-progress': ['used', 'quota'],
  'amount-over-time': ['amount', 'seconds', 'date'],
  // @@S mol-1 end
  'text': ['text'],
  'badge': ['label'],
  'relative-time': ['date'],
  'context-menu': ['actions', 'entityType', 'entityName'],
};

export const isKnownCellType = (type: string): type is KnownCellType => type in registry;

export const renderCellContent = <K extends KnownCellType>(
  type: K,
  data: CellTypeDataMap[K],
): ReactElement => {
  const missing = REQUIRED_KEYS[type].filter(
    (key) => (data as Record<string, unknown>)[key] == null,
  );
  if (missing.length > 0) {
    devWarn(
      `renderCellContent("${type}"): data is missing required key(s) ${missing.join(', ')} — check the column config against CellTypeDataMap`,
    );
  }
  return registry[type](data);
};
