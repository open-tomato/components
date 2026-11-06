import type { ReactElement, ReactNode } from 'react';

import { Badge, type BadgeProps } from '../../atoms/Badge';
import { FormattedRelativeTime } from '../../atoms/Formatted/FormattedRelativeTime';
import { type DateInput } from '../../lib';
import { devWarn } from '../../lib/dev';
// Deep member imports, not the CellContent/KnownEntities barrels — the
// built storybook's lazy-init chunking can drop barrel member inits
// (renders undefined → React #130); see the matching note in
// CellValue.tsx.
import { AmountOverTime, type AmountOverTimeProps } from '../../molecules/CellContent/AmountOverTime';
import { CellBar, type CellBarProps } from '../../molecules/CellContent/CellBar';
import { CellDoubleLine, type CellDoubleLineProps } from '../../molecules/CellContent/CellDoubleLine';
import { CellLabel, type CellLabelProps } from '../../molecules/CellContent/CellLabel';
import { CellStatus, type CellStatusProps } from '../../molecules/CellContent/CellStatus';
import { CellValue, type CellValueProps } from '../../molecules/CellContent/CellValue';
import { QuotaProgress, type QuotaProgressProps } from '../../molecules/CellContent/QuotaUsage';
import { Entity, type EntityProps } from '../../molecules/KnownEntities/Entity';
import { ModelFooter, type ModelFooterProps } from '../../molecules/KnownEntities/ModelFooter';

import { RowContextAction, type RowContextActionProps } from './RowContextAction';
import { cellTypeRelativeTime, cellTypeText } from './Table.variants';

/**
 * Self-describing column types: a self-defining table grid can infer the
 * component to use if the data type for a column is of
 * `{entity}-{variant}`. Target shape: JSON table configs naming types such
 * as (`entity-cell`, `entity-inline`, `entity-title`, `quota-progress`,
 * `amount-over-time`, `badge`, `text`, `relative-time`, `context-menu`, …).
 *
 * A lightweight lookup, deliberately: one typed data contract per type
 * (`CellTypeDataMap`) and one render function per type. A config-driven
 * table resolves a column's `type` string with `isKnownCellType` and
 * renders each row through `renderCellContent(type, data)` from its
 * column `cell` — the registry never wraps or replaces the Table's own
 * column machinery. The `entity-*` types render `Entity`; the kinds they
 * can name come from the `EntityKindsProvider` the implementor mounts.
 */

export interface CellTypeDataMap {
  /* known entities */
  'entity-inline': EntityProps;
  'entity-cell': EntityProps;
  'entity-title': EntityProps;
  'model-footer': ModelFooterProps;
  /* cell-content kit */
  'value': CellValueProps;
  'double-line': CellDoubleLineProps;
  'status': CellStatusProps;
  'label': CellLabelProps;
  'bar': CellBarProps;
  'quota-progress': QuotaProgressProps;
  'amount-over-time': AmountOverTimeProps;
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
  'entity-inline': (d) => <Entity {...d} layout="inline" />,
  'entity-cell': (d) => <Entity {...d} layout="cell" />,
  'entity-title': (d) => <Entity {...d} layout="title" />,
  'model-footer': (d) => <ModelFooter {...d} />,
  'value': (d) => <CellValue {...d} />,
  'double-line': (d) => <CellDoubleLine {...d} />,
  'status': (d) => <CellStatus {...d} />,
  'label': (d) => <CellLabel {...d} />,
  'bar': (d) => <CellBar {...d} />,
  'quota-progress': (d) => <QuotaProgress {...d} />,
  'amount-over-time': (d) => <AmountOverTime {...d} />,
  'text': (d) => (
    <span
      className={cellTypeText()}
    >{d.text}</span>
  ),
  'badge': (d) => (
    <Badge tone={d.tone} size="sm" dot={d.dot}>
      {d.label}
    </Badge>
  ),
  'relative-time': (d) => (
    <span
      className={cellTypeRelativeTime()}
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
  'entity-inline': [],
  'entity-cell': [],
  'entity-title': [],
  'model-footer': ['name'],
  'value': [],
  'double-line': ['title'],
  // status/value: every key is optional (tone defaults to ok).
  'status': [],
  'label': ['labels'],
  'bar': ['ratio'],
  'quota-progress': ['used', 'quota'],
  'amount-over-time': ['amount', 'seconds', 'date'],
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
