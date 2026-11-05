import type { ComponentProps } from 'react';

import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, mock } from 'bun:test';

import { EntityKindsProvider } from '../../molecules/KnownEntities/EntityKinds';
import { type EntityKinds } from '../../molecules/KnownEntities/entityKindsContext';

import { SearchSuggest, type SearchSuggestion } from './SearchSuggest';

// @@S mol-3 begin
const KINDS: EntityKinds = {
  worker: { icon: 'bot', tone: 'primary' },
  run: { icon: 'terminal', tone: 'accent' },
  task: { icon: 'list', tone: 'gold' },
  connector: { icon: 'cpu', tone: 'info' },
  doc: { icon: 'book', tone: 'success' },
};

const SUGGESTIONS: SearchSuggestion[] = [
  { kind: 'worker', label: 'auth-refactor', sub: 'running · stage-7d2f' },
  { kind: 'run', label: 'settings page draft', sub: '12m ago' },
  { kind: 'task', label: 'Add usage chart', sub: 'roadmap · high' },
  { kind: 'connector', label: 'github-issues', sub: 'MCP · connected', icon: 'cpu' },
  { kind: 'doc', label: 'Composting context' },
];
// @@S mol-3 end

const renderOpen = async (props: Partial<ComponentProps<typeof SearchSuggest>> = {}) => {
  await act(async () => {
    // @@S mol-3 begin
    render(
      <EntityKindsProvider kinds={KINDS}>
        <SearchSuggest suggestions={SUGGESTIONS} {...props} />
      </EntityKindsProvider>,
    );
    // @@S mol-3 end
  });
  return screen.getByRole('combobox');
};

describe('SearchSuggest', () => {
  afterEach(cleanup);

  it('renders a closed combobox by default', async () => {
    const input = await renderOpen();
    expect(input.getAttribute('aria-expanded')).toBe('false');
    expect(screen.queryByRole('listbox')).toBeNull();
    expect(screen.getByText('⌘K')).toBeTruthy();
  });

  // @@S mol-3 begin
  it('defaults the placeholder to "Search…"', async () => {
    await renderOpen();
    expect(screen.getByPlaceholderText('Search…')).toBeTruthy();
  });
  // @@S mol-3 end

  it('renders the placeholder', async () => {
    await renderOpen({ placeholder: 'Find' });
    expect(screen.getByPlaceholderText('Find')).toBeTruthy();
  });

  // @@S mol-3 begin
  it('renders all five kinds when defaultOpen', async () => {
    await renderOpen({ defaultOpen: true });
    expect(screen.getAllByRole('option').length).toBe(5);
    for (const k of ['worker', 'run', 'task', 'connector', 'doc']) {
      expect(screen.getByText(k)).toBeTruthy();
    }
    expect(screen.getByText('suggested')).toBeTruthy();
    expect(screen.getByText('running · stage-7d2f')).toBeTruthy();
  });

  it('renders no pill for a suggestion without a kind', async () => {
    await act(async () => {
      render(<SearchSuggest suggestions={[{ label: 'plain' }]} defaultOpen />);
    });
    expect(screen.getByText('plain')).toBeTruthy();
    expect(screen.getAllByRole('option').length).toBe(1);
    expect(screen.getByRole('option').textContent).toBe('plain');
  });
  // @@S mol-3 end

  it('opens on focus', async () => {
    const input = await renderOpen();
    fireEvent.focus(input);
    expect(input.getAttribute('aria-expanded')).toBe('true');
  });

  it('filters by typed text and shows the match count', async () => {
    const input = await renderOpen();
    fireEvent.change(input, { target: { value: 'github' } });
    expect(screen.getAllByRole('option').length).toBe(1);
    expect(screen.getByText('matches · 1')).toBeTruthy();
  });

  it('moves the active row with arrow keys', async () => {
    const input = await renderOpen({ defaultOpen: true });
    const opts = () => screen.getAllByRole('option');
    expect(opts()[0]!.getAttribute('aria-selected')).toBe('true');
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(opts()[1]!.getAttribute('aria-selected')).toBe('true');
    expect(input.getAttribute('aria-activedescendant')).toBe(opts()[1]!.id);
    fireEvent.keyDown(input, { key: 'ArrowUp' });
    expect(opts()[0]!.getAttribute('aria-selected')).toBe('true');
  });

  it('selects the active suggestion on Enter', async () => {
    const onSelect = mock((_s: SearchSuggestion) => {});
    const input = await renderOpen({ defaultOpen: true, onSelect });
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onSelect).toHaveBeenCalledWith(SUGGESTIONS[1]);
    expect(screen.queryByRole('listbox')).toBeNull();
    expect((input as HTMLInputElement).value).toBe('settings page draft');
  });

  it('selects on click', async () => {
    const onSelect = mock((_s: SearchSuggestion) => {});
    await renderOpen({ defaultOpen: true, onSelect });
    fireEvent.click(screen.getAllByRole('option')[2]!);
    expect(onSelect).toHaveBeenCalledWith(SUGGESTIONS[2]);
  });

  it('hover moves the active row', async () => {
    await renderOpen({ defaultOpen: true });
    const opts = screen.getAllByRole('option');
    fireEvent.mouseEnter(opts[3]!);
    expect(opts[3]!.getAttribute('aria-selected')).toBe('true');
  });

  it('falls through to onSearch on Enter with no match', async () => {
    const onSearch = mock((_q: string) => {});
    const input = await renderOpen({ onSearch });
    fireEvent.change(input, { target: { value: 'zzz' } });
    expect(screen.getByText(/No quick matches/)).toBeTruthy();
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onSearch).toHaveBeenCalledWith('zzz');
  });

  it('Search all row calls onSearch', async () => {
    const onSearch = mock((_q: string) => {});
    const input = await renderOpen({ onSearch });
    fireEvent.change(input, { target: { value: 'auth' } });
    fireEvent.click(screen.getByRole('button', { name: /Search all for/ }));
    expect(onSearch).toHaveBeenCalledWith('auth');
  });

  it('Enter does nothing special while composing', async () => {
    const onSelect = mock((_s: SearchSuggestion) => {});
    const input = await renderOpen({ defaultOpen: true, onSelect });
    fireEvent.keyDown(input, { key: 'Enter', isComposing: true });
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('Escape closes the panel', async () => {
    const input = await renderOpen({ defaultOpen: true });
    fireEvent.keyDown(input, { key: 'Escape' });
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  it('outside pointerdown closes the panel', async () => {
    await renderOpen({ defaultOpen: true });
    fireEvent.pointerDown(document.body);
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  it('Ctrl-K opens the panel when hotkey is on', async () => {
    const input = await renderOpen();
    fireEvent.keyDown(window, { key: 'k', ctrlKey: true });
    expect(input.getAttribute('aria-expanded')).toBe('true');
  });

  it('ignores Ctrl-K when hotkey is off', async () => {
    const input = await renderOpen({ hotkey: false });
    fireEvent.keyDown(window, { key: 'k', ctrlKey: true });
    expect(input.getAttribute('aria-expanded')).toBe('false');
  });
});
