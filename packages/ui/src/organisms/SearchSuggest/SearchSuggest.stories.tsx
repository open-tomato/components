import type { Meta, StoryObj } from '@storybook/react-vite';

import { useState } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';

import { Badge } from '../../atoms/Badge';

import { SearchSuggest, type SearchSuggestion } from './SearchSuggest';

// @@S org-1 begin
/**
 * A ⌘K search box with anchored suggestions. Five kinds, each with its
 * own accent puck + pill.
 * Keyboard-driven; Enter with no match falls through to the full search
 * page. Sibling of CommandPalette, not a variant of it — see the
 * component docblock for the recorded relationship decision.
 */
// @@S org-1 end
// @@T org-1 begin
const meta: Meta<typeof SearchSuggest> = {
// @@T org-1 end
  title: 'Organisms/SearchSuggest',
  component: SearchSuggest,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// @@S org-1 begin
/** Sample suggestions — one of each kind. */
// @@S org-1 end
const SUGGESTIONS: SearchSuggestion[] = [
  { kind: 'agent', label: 'auth-refactor', sub: 'running · stage-7d2f' },
  { kind: 'session', label: 'settings page draft', sub: '12m ago · sam · model-a' },
  { kind: 'task', label: 'Add per-tool usage chart to overview page', sub: 'roadmap · high' },
  { kind: 'tool', label: 'github-issues', sub: 'MCP · connected' },
  { kind: 'doc', label: 'Composting context between runs', sub: 'docs/experiments' },
];

// @@S org-1 begin
/** Resting input: search icon left, ⌘K chip right. */
// @@S org-1 end
export const Default: Story = {
  args: { suggestions: SUGGESTIONS },
};

// @@S org-1 begin
/**
 * Panel open with the five kinds, each carrying its own accent on both
 * the icon puck and the trailing kind pill.
 */
// @@S org-1 end
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
