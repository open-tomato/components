import type { Meta, StoryObj } from '@storybook/react-vite';

import { useState } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';

import { Badge } from '../../atoms/Badge';
// @@S mol-3 begin
import { EntityKindsProvider } from '../../molecules/KnownEntities/EntityKinds';
import { type EntityKinds } from '../../molecules/KnownEntities/entityKindsContext';
// @@S mol-3 end

import { SearchSuggest, type SearchSuggestion } from './SearchSuggest';

// @@S mol-3 begin
/**
 * The topbar's ⌘K search box with anchored suggestions (app-shell spec: Top
 * Bar). Each suggestion's `kind` is a key into the `EntityKinds` map — here a
 * neutral demo map of five kinds, each with its own accent puck + pill.
 * Keyboard-driven; Enter with no match falls through to the full search
 * page. Sibling of CommandPalette, not a variant of it — see the
 * component docblock for the recorded relationship decision.
 */
// @@S mol-3 end
// @@T org-1 begin
const meta: Meta<typeof SearchSuggest> = {
// @@T org-1 end
  title: 'Organisms/SearchSuggest',
  component: SearchSuggest,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  // @@S mol-3 begin
  decorators: [
    (Story) => (
      <EntityKindsProvider kinds={DEMO_KINDS}>
        <Story />
      </EntityKindsProvider>
    ),
  ],
  // @@S mol-3 end
};

export default meta;
type Story = StoryObj<typeof meta>;

// @@S mol-3 begin
/** A neutral demo map — the kit ships no kinds; an implementor supplies its own. */
const DEMO_KINDS: EntityKinds = {
  worker: { icon: 'bot', tone: 'primary' },
  run: { icon: 'terminal', tone: 'accent' },
  task: { icon: 'list', tone: 'gold' },
  connector: { icon: 'cpu', tone: 'info' },
  doc: { icon: 'book', tone: 'success' },
};

/** Demo suggestions — one of each kind. */
const SUGGESTIONS: SearchSuggestion[] = [
  { kind: 'worker', label: 'auth-refactor', sub: 'running · worker-7d2f' },
  { kind: 'run', label: 'settings page draft', sub: '12m ago · sam' },
  { kind: 'task', label: 'Add per-connector usage chart to usage page', sub: 'roadmap · high' },
  { kind: 'connector', label: 'github-issues', sub: 'MCP · connected' },
  { kind: 'doc', label: 'Composting context between runs', sub: 'docs/experiments' },
];
// @@S mol-3 end

/** Resting input: magnifier icon left, ⌘K chip right. */
export const Default: Story = {
  args: { suggestions: SUGGESTIONS },
};

/**
 * Panel open with the five kinds, each carrying its own accent (worker→
 * primary, run→accent, task→gold, connector→info, doc→success) on both the
 * icon puck and the trailing kind pill.
 */
export const Open: Story = {
  args: {
    suggestions: SUGGESTIONS,
    defaultOpen: true,
    className: 'w-[380px]',
  },
  render: (args) => (
    <div className="flex min-h-[420px] items-start justify-center pt-2">
      <SearchSuggest {...args} />
    </div>
  ),
};

const KeyboardDemo = () => {
  const [picked, setPicked] = useState('');
  const [searched, setSearched] = useState('');
  return (
    <div className="flex min-h-[420px] flex-col items-center gap-3 pt-2">
      <SearchSuggest
        suggestions={SUGGESTIONS}
        className="w-[380px]"
        onSelect={(s) => setPicked(s.label)}
        onSearch={(q) => setSearched(q)}
      />
      {picked && <Badge tone="info">picked · {picked}</Badge>}
      {searched && <Badge tone="warning">searched · {searched}</Badge>}
    </div>
  );
};

/**
 * The keyboard path, driven by real events: typing filters (substring
 * over label + sub), ↑↓ move aria-activedescendant, Enter opens the
 * active suggestion; with no matches Enter falls through to onSearch.
 */
export const KeyboardNavigation: Story = {
  args: { suggestions: SUGGESTIONS },
  render: () => <KeyboardDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('combobox');
    // Type to filter: "ag" matches several; arrow to the second match.
    await userEvent.type(input, 'ag');
    await waitFor(() => expect(input).toHaveAttribute('aria-expanded', 'true'));
    const options = canvas.getAllByRole('option');
    await expect(options.length).toBeGreaterThan(1);
    await expect(options[0]).toHaveAttribute('aria-selected', 'true');
    await userEvent.keyboard('{ArrowDown}');
    await waitFor(() => expect(options[1]).toHaveAttribute('aria-selected', 'true'));
    await userEvent.keyboard('{ArrowUp}');
    await waitFor(() => expect(options[0]).toHaveAttribute('aria-selected', 'true'));
    // Enter opens the active suggestion.
    await userEvent.keyboard('{Enter}');
    await expect(await canvas.findByText(/picked ·/)).toBeVisible();
    // No matches → Enter falls through to the full-search callback.
    await userEvent.clear(input);
    await userEvent.type(input, 'zzz-no-match');
    await userEvent.keyboard('{Enter}');
    await expect(
      await canvas.findByText('searched · zzz-no-match'),
    ).toBeVisible();
  },
};

/** Empty-match state: the fall-through hint replaces the rows. */
export const NoMatches: Story = {
  args: { suggestions: SUGGESTIONS },
  render: function NoMatchesDemo(args) {
    return (
      <div className="flex min-h-[220px] items-start justify-center pt-2">
        <SearchSuggest {...args} className="w-[380px]" defaultOpen />
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('combobox');
    await userEvent.type(input, 'xyzzy');
    await expect(await canvas.findByText(/No quick matches/)).toBeVisible();
  },
};
