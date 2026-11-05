import type { Column } from './Table';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { useState } from 'react';

// @@S org-2 begin
import { makeColumns, SESSIONS as ITEMS, type Session as Item } from '../../stories/sessions';
// @@S org-2 end

import { renderCellContent } from './cellTypes';
import { RowContextAction } from './RowContextAction';
import { Table } from './Table';

// @@T org-2 begin
// @@S org-2 begin
const TypedTable: typeof Table<Item> = Table<Item>;
// @@S org-2 end
// @@T org-2 end

// @@T org-2 begin
const meta: Meta<typeof TypedTable> = {
// @@T org-2 end
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
    // @@S org-2 begin
    data: ITEMS,
    getRowId: (r: Item) => r.id,
    // @@S org-2 end
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
      // @@S org-2 begin
      data={ITEMS}
      // @@S org-2 end
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
  // @@S org-2 begin
  const [rows, setRows] = useState<readonly Item[]>(ITEMS);
  // @@S org-2 end
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

// @@S org-2 begin
const ITEM_ACTIONS = {
  actions: [
    { icon: 'eye' as const, title: 'Open', onClick: () => {} },
    { icon: 'git-branch' as const, title: 'Fork item', onClick: () => {} },
    { icon: 'copy' as const, title: 'Copy item ID', onClick: () => {} },
    // @@S org-2 end
    { icon: 'download' as const, title: 'Export transcript', onClick: () => {} },
  ],
  destructive: { icon: 'archive' as const, title: 'Archive', onClick: () => {} },
};

/**
 * Spec: context action — `ellipsis-vertical` icon button opening the row
 * // @@S org-2 begin
 * menu from the `{actions[], destructive}` contract (the page spec's
 * table actions); the destructive item swaps to an inline confirmation
 * // @@S org-2 end
 * naming action + entity. Shown open for the docs; in a table it rides a
 * trailing untitled column (see ConfigDriven).
 */
export const ContextAction: Story = {
  parameters: { layout: 'centered' },
  render: () => (
    <div className="flex min-h-[320px] items-start justify-center pt-2">
      <RowContextAction
        // @@S org-2 begin
        {...ITEM_ACTIONS}
        entityType="item"
        // @@S org-2 end
        entityName="auth-refactor"
        defaultOpen
      />
    </div>
  ),
};

/* ── self-describing table (registry: cellTypes.tsx) ── */

// @@S org-2 begin
interface ItemRow {
// @@S org-2 end
  id: string;
  name: string;
  status: 'running' | 'waiting' | 'done' | 'failed';
  // @@S org-2 begin
  owner: string;
  model: string;
  tone: 'primary' | 'gold' | 'info' | 'success' | 'accent';
  by: string;
  used: number;
  // @@S org-2 end
  quota: number;
  cost: number;
  seconds: number;
  date: Date;
}

/** Deterministic reference clock for the relative-time cells. */
const REF_NOW = new Date(2026, 6, 22, 15, 0, 0);

// @@S org-2 begin
const ITEM_ROWS: ItemRow[] = [
  { id: 'item-7d2f', name: 'auth-refactor', status: 'done', owner: 'the-refactorer', model: 'sonnet-4-5', tone: 'primary', by: 'sam', used: 38120, quota: 50000, cost: 0.42, seconds: 437, date: new Date(2026, 6, 22, 12, 4, 0) },
  { id: 'item-93af', name: 'perf-investigate', status: 'waiting', owner: 'the-profiler', model: 'opus-4-5', tone: 'gold', by: 'ren', used: 19800, quota: 80000, cost: 0.61, seconds: 1380, date: new Date(2026, 6, 22, 11, 48, 0) },
  { id: 'item-22b1', name: 'docs-typos', status: 'running', owner: 'the-editor', model: 'haiku-4-5', tone: 'info', by: 'kai', used: 5320, quota: 15000, cost: 0.04, seconds: 540, date: new Date(2026, 6, 22, 11, 52, 0) },
  { id: 'item-58c0', name: 'rate-limit-bug', status: 'failed', owner: 'the-investigator', model: 'sonnet-4-5', tone: 'primary', by: 'sam', used: 27450, quota: 50000, cost: 0.31, seconds: 407, date: new Date(2026, 6, 22, 10, 33, 0) },
  { id: 'item-0118', name: 'image-pipeline', status: 'done', owner: 'the-refactorer', model: 'opus-4-5', tone: 'accent', by: 'kai', used: 62100, quota: 80000, cost: 1.92, seconds: 1104, date: new Date(2026, 6, 21, 16, 20, 0) },
];
// @@S org-2 end

const STATUS_BADGE = {
  running: { tone: 'success', dot: true },
  waiting: { tone: 'warning', dot: false },
  done: { tone: 'info', dot: false },
  failed: { tone: 'danger', dot: false },
} as const;

// @@S org-2 begin
/** The page spec's table config, resolved through the registry. */
const CONFIG_COLUMNS: Column<ItemRow>[] = [
  {
    key: 'item',
    header: 'Item',
    // @@S org-2 end
    cell: (r) => renderCellContent('session-cell', {
      name: r.name,
      status: r.status,
      agentInstanceId: r.id,
      branch: `feat/${r.name}`,
    }),
  },
  {
    // @@S org-2 begin
    key: 'owner',
    header: 'Owner · Model',
    // @@S org-2 end
    width: 170,
    cell: (r) => renderCellContent('agent-cell', {
      // @@S org-2 begin
      name: r.owner,
      // @@S org-2 end
      model: r.model,
      tone: r.tone,
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
    // @@S org-2 begin
    key: 'used',
    header: 'Usage',
    // @@S org-2 end
    width: 130,
    cell: (r) => renderCellContent('tokens-progress', {
      // @@S org-2 begin
      used: r.used,
      // @@S org-2 end
      quota: r.quota,
      locale: 'en-US',
    }),
  },
  {
    // @@S org-2 begin
    key: 'cost',
    header: 'Cost · Time',
    // @@S org-2 end
    width: 148,
    cell: (r) => renderCellContent('spend-over-time', {
      cost: r.cost,
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
    cell: (r) => renderCellContent('user-inline', { handle: r.by }),
  },
  {
    key: 'menu',
    header: '',
    width: 52,
    align: 'end',
    cell: (r) => renderCellContent('context-menu', {
      // @@S org-2 begin
      ...ITEM_ACTIONS,
      entityType: 'item',
      // @@S org-2 end
      entityName: r.name,
    }),
  },
];

// @@S org-2 begin
const ConfigTable = Table<ItemRow>;
// @@S org-2 end

/**
 * // @@S org-2 begin
 * The self-describing table: every column resolves its renderer
 * from the `{entity}-{variant}` type registry, mirroring the JSON table
 * config in the page spec (item cell / owner cell / badge /
 * usage progress / cost over time / user-inline / context-menu).
 * Fidelity source: the original screen's table region, captured
 * light+dark during the one-time port fidelity check. Spec-over-original
 * divergences: the usage bar colors by consumption thresholds, not
 * item status; the header band keeps the library Table chrome.
 * // @@S org-2 end
 * Intl-vs-original deltas: the compact quota renders `50K` (Intl compact)
 * where the original page hand-writes `50k`, and times are locale-formatted
 * (`12:04 PM` in en-US) where the original page hard-codes 24h strings.
 */
export const ConfigDriven: Story = {
  render: () => (
    <ConfigTable
      columns={CONFIG_COLUMNS}
      // @@S org-2 begin
      data={ITEM_ROWS}
      // @@S org-2 end
      getRowId={(r) => r.id}
    />
  ),
};
