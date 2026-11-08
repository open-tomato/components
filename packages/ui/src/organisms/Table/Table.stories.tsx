import type { Column } from './Table';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { useState } from 'react';

import { Avatar } from '../../atoms/Avatar';
import { Icon } from '../../atoms/Icon';
import { StatusIndicator } from '../../atoms/StatusIndicator';
import { cn } from '../../lib';
import {
  ACTIVITY_STATUS_TONE,
  entityMetaRef,
  entityMetaRefText,
  entityMetaSeparator,
  entityTile,
  entityTone,
} from '../../molecules/KnownEntities/KnownEntities.variants';
import { makeColumns, ITEMS, type Item } from '../../stories/items';

import { renderCellContent } from './cellTypes';
import { RowContextAction } from './RowContextAction';
import { Table } from './Table';

const TypedTable: typeof Table<Item> = Table<Item>;

const meta: Meta<typeof TypedTable> = {
  title: 'Organisms/Table',
  component: TypedTable,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    layout: { control: 'select', options: ['fit', 'scroll'] },
    density: { control: 'select', options: ['comfortable', 'compact'] },
  },
  args: {
    columns: makeColumns('clamp'),
    data: ITEMS,
    getRowId: (r: Item) => r.id,
    initialSort: { key: 'updated', dir: 'asc' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/** The original demo's defaults: scroll layout, totals footer, 2-line clamp. */
export const Default: Story = {
  args: {
    layout: 'scroll',
    maxHeight: 360,
    stickyFooter: true,
  },
};

/** fit — natural height, no scroll gutter, no footer. */
export const Fit: Story = {};

export const Compact: Story = {
  args: { ...Default.args, density: 'compact' },
};

/** goal column truncating to one line (hover a clipped cell for the tip). */
export const Truncate: Story = {
  args: { ...Default.args, columns: makeColumns('truncate') },
};

/** frame=false — a wrapper (e.g. the Toolbar) owns the border and radius. */
export const Unframed: Story = {
  args: { frame: false },
  decorators: [
    (Story) => (
      <div className="overflow-hidden rounded-lg border border-border-soft bg-surface-1 shadow-xs">
        <Story />
      </div>
    ),
  ],
};

/* ── TableRow modifiers (spec-defined) ── */

/** Spec: odd/even row styling via the `striped` prop. */
export const Striped: Story = {
  args: { striped: true },
};

const SelectableDemo = () => {
  const [ids, setIds] = useState<string[]>(['ses_4f09', 'ses_2c77']);
  return (
    <TypedTable
      columns={makeColumns('clamp')}
      data={ITEMS}
      getRowId={(r) => r.id}
      selectable
      selectedIds={ids}
      onSelectionChange={setIds}
      isRowSelectable={(r) => r.status !== 'running'}
    />
  );
};

/**
 * Spec: checkbox column — always the first column; header shows the
 * all/partial state. DECISION (documented in TableModifiers.tsx): the
 * table renders the boxes and emits one controlled
 * `onSelectionChange(ids)`; the parent owns the selection state. Running
 * rows opt out via `isRowSelectable` to show the disabled box.
 */
export const Selectable: Story = {
  render: () => <SelectableDemo />,
};

const ReorderableDemo = () => {
  const [rows, setRows] = useState<readonly Item[]>(ITEMS);
  return (
    <TypedTable
      columns={makeColumns('clamp')}
      data={rows}
      getRowId={(r) => r.id}
      reorderable
      onReorder={setRows}
      isRowReorderable={(r) => r.status !== 'running'}
    />
  );
};

/**
 * Spec: SortHandle — first-column grip, Droppable/Sortable drag pattern
 * (midpoint decides above/below, accent insert line). Row order IS the
 * data order, so column sorting is disabled while reorderable; running
 * rows opt out via `isRowReorderable` and show the inert grip.
 * DOCUMENTED A11Y GAP: reordering is drag-only (no keyboard path,
 * mirroring the Sortable atom); the planned fallback is a focusable grip
 * with ArrowUp/Down move actions — until then expose explicit
 * move-up/move-down row actions where an accessible path is required.
 */
export const Reorderable: Story = {
  render: () => <ReorderableDemo />,
};

const ITEM_ACTIONS = {
  actions: [
    { icon: 'eye' as const, title: 'Open', onClick: () => {} },
    { icon: 'git-branch' as const, title: 'Fork item', onClick: () => {} },
    { icon: 'copy' as const, title: 'Copy item ID', onClick: () => {} },
    { icon: 'download' as const, title: 'Export transcript', onClick: () => {} },
  ],
  destructive: { icon: 'archive' as const, title: 'Archive', onClick: () => {} },
};

/**
 * Spec: context action — `ellipsis-vertical` icon button opening the row
 * menu from the `{actions[], destructive}` contract (the page spec's
 * table actions); the destructive item swaps to an inline confirmation
 * naming action + entity. Shown open for the docs; in a table it rides a
 * trailing untitled column (see ConfigDriven).
 */
export const ContextAction: Story = {
  parameters: { layout: 'centered' },
  render: () => (
    <div className="flex min-h-[320px] items-start justify-center pt-2">
      <RowContextAction
        {...ITEM_ACTIONS}
        entityType="item"
        entityName="auth-refactor"
        defaultOpen
      />
    </div>
  ),
};

/* ── self-describing table (registry: cellTypes.tsx) ── */

interface ItemRow {
  id: string;
  name: string;
  status: 'running' | 'waiting' | 'done' | 'failed';
  owner: string;
  model: string;
  tone: 'primary' | 'gold' | 'info' | 'success' | 'accent';
  by: string;
  used: number;
  quota: number;
  amount: number;
  seconds: number;
  date: Date;
}

/** Deterministic reference clock for the relative-time cells. */
const REF_NOW = new Date(2026, 6, 22, 15, 0, 0);

const ITEM_ROWS: ItemRow[] = [
  { id: 'item-7d2f', name: 'auth-refactor', status: 'done', owner: 'the-refactorer', model: 'sonnet-4-5', tone: 'primary', by: 'sam', used: 38120, quota: 50000, amount: 0.42, seconds: 437, date: new Date(2026, 6, 22, 12, 4, 0) },
  { id: 'item-93af', name: 'perf-investigate', status: 'waiting', owner: 'the-profiler', model: 'opus-4-5', tone: 'gold', by: 'ren', used: 19800, quota: 80000, amount: 0.61, seconds: 1380, date: new Date(2026, 6, 22, 11, 48, 0) },
  { id: 'item-22b1', name: 'docs-typos', status: 'running', owner: 'the-editor', model: 'haiku-4-5', tone: 'info', by: 'kai', used: 5320, quota: 15000, amount: 0.04, seconds: 540, date: new Date(2026, 6, 22, 11, 52, 0) },
  { id: 'item-58c0', name: 'rate-limit-bug', status: 'failed', owner: 'the-investigator', model: 'sonnet-4-5', tone: 'primary', by: 'sam', used: 27450, quota: 50000, amount: 0.31, seconds: 407, date: new Date(2026, 6, 22, 10, 33, 0) },
  { id: 'item-0118', name: 'image-pipeline', status: 'done', owner: 'the-refactorer', model: 'opus-4-5', tone: 'accent', by: 'kai', used: 62100, quota: 80000, amount: 1.92, seconds: 1104, date: new Date(2026, 6, 21, 16, 20, 0) },
];

const STATUS_BADGE = {
  running: { tone: 'success', dot: true },
  waiting: { tone: 'warning', dot: false },
  done: { tone: 'info', dot: false },
  failed: { tone: 'danger', dot: false },
} as const;

/** The meta line's `{id} · {branch}`: a quiet separator and the branch glyph. */
const BranchMeta = ({ id, branch }: { id: string; branch: string }) => (
  <>
    {id}
    <span className={entityMetaSeparator()}>·</span>
    <span className={entityMetaRef()}>
      <Icon name="git-branch" size={10} />
      <span className={entityMetaRefText()}>{branch}</span>
    </span>
  </>
);

/** The page spec's table config, resolved through the registry. */
const CONFIG_COLUMNS: Column<ItemRow>[] = [
  {
    key: 'item',
    header: 'Item',
    cell: (r) => renderCellContent('entity-stack', {
      leading: (
        <StatusIndicator
          tone={ACTIVITY_STATUS_TONE[r.status]}
          pulse={r.status === 'running'}
          label={r.status}
        />
      ),
      title: r.name,
      subtitle: <BranchMeta id={r.id} branch={`feat/${r.name}`} />,
    }),
  },
  {
    key: 'owner',
    header: 'Owner · Model',
    width: 170,
    cell: (r) => renderCellContent('entity-cell', {
      leading: (
        <span className={cn(entityTile({ size: 'sm' }), entityTone({ tone: r.tone }))}>
          <Icon name="bot" size={13} />
        </span>
      ),
      title: r.owner,
      subtitle: r.model,
    }),
  },
  {
    key: 'status',
    header: 'Status',
    width: 104,
    cell: (r) => renderCellContent('badge', {
      label: r.status,
      ...STATUS_BADGE[r.status],
    }),
  },
  {
    key: 'used',
    header: 'Usage',
    width: 130,
    cell: (r) => renderCellContent('quota-progress', {
      used: r.used,
      quota: r.quota,
      locale: 'en-US',
    }),
  },
  {
    key: 'amount',
    header: 'Amount · Time',
    width: 148,
    cell: (r) => renderCellContent('amount-over-time', {
      amount: r.amount,
      seconds: r.seconds,
      date: r.date,
      now: REF_NOW,
      locale: 'en-US',
    }),
  },
  {
    key: 'by',
    header: 'By',
    width: 96,
    cell: (r) => renderCellContent('entity-inline', {
      leading: <Avatar name={r.by} size="sm" status="none" />,
      title: r.by,
      mono: true,
    }),
  },
  {
    key: 'menu',
    header: '',
    width: 52,
    align: 'end',
    cell: (r) => renderCellContent('context-menu', {
      ...ITEM_ACTIONS,
      entityType: 'item',
      entityName: r.name,
    }),
  },
];

const ConfigTable = Table<ItemRow>;

/**
 * The self-describing table: every column resolves its renderer
 * from the `{entity}-{variant}` type registry, mirroring the JSON table
 * config in the page spec (entity-stack / entity-cell / badge /
 * quota-progress / amount-over-time / entity-inline / context-menu).
 * Fidelity source: the original screen's table region, captured
 * light+dark during the one-time port fidelity check. Spec-over-original
 * divergences: the usage bar colors by consumption thresholds, not
 * item status; the header band keeps the library Table chrome.
 * Intl-vs-original deltas: the compact quota renders `50K` (Intl compact)
 * where the original page hand-writes `50k`, and times are locale-formatted
 * (`12:04 PM` in en-US) where the original page hard-codes 24h strings.
 */
export const ConfigDriven: Story = {
  render: () => (
    <ConfigTable
      columns={CONFIG_COLUMNS}
      data={ITEM_ROWS}
      getRowId={(r) => r.id}
    />
  ),
};
