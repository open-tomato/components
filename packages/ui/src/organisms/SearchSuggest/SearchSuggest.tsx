import type { IconName } from '../../atoms/Icon';

import {
  useEffect,
  useId,
  useRef,
  useState,
  // @@T org-1 begin
  type FC,
  // @@T org-1 end
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react';

import { Icon } from '../../atoms/Icon';
import { cn, chartTone } from '../../lib';
import { devWarn } from '../../lib/dev';
// Deep member import, not the KnownEntities barrel (same chunking note as
// below).
import { useEntityKinds } from '../../molecules/KnownEntities/entityKindsContext';
// Deep member import, not the CommandPalette barrel — the built
// storybook's lazy-init chunking can drop barrel member inits (see the
// matching note in Table/cellTypes.tsx).
import { paletteKbd } from '../CommandPalette/CommandPalette.variants';

import {
  searchSuggestBox,
  searchSuggestKindPill,
  searchSuggestPanel,
  searchSuggestPuck,
  searchSuggestRow,
  // @@V org-1 begin
  searchSuggestAll,
  searchSuggestAllLabel,
  searchSuggestEmpty,
  searchSuggestFooter,
  searchSuggestHeader,
  searchSuggestInput,
  searchSuggestLabel,
  searchSuggestLens,
  searchSuggestRoot,
  searchSuggestSub,
  searchSuggestText,
  // @@V org-1 end
} from './SearchSuggest.variants';

// @@S mol-3 begin
export interface SearchSuggestion {
  /** Key into the `EntityKinds` map: supplies the glyph and accent, and is shown in the pill. */
  kind?: string;
  label: string;
  // @@S org-1 begin
  /** Mono context line under the label ("running · job-7d2f"). */
  // @@S org-1 end
  sub?: string;
  /** Overrides the kind's default glyph. */
  icon?: IconName;
}
// @@S mol-3 end

export interface SearchSuggestProps {
  suggestions: SearchSuggestion[];
  /** A suggestion was chosen (click or Enter). Navigation is the app's job. */
  onSelect?: (suggestion: SearchSuggestion) => void;
  /**
   * Enter without a matching suggestion — falls through to the full
   * search page (the suggest list is a shortcut, not a wall).
   */
  onSearch?: (query: string) => void;
  /** Global ⌘K / Ctrl-K focuses the input (scope switch). Default on. */
  hotkey?: boolean;
  // @@S mol-3 begin
  /** Input placeholder. Default "Search…". */
  // @@S mol-3 end
  placeholder?: string;
  /** Render with the panel open (docs/stories). */
  defaultOpen?: boolean;
  className?: string;
}

const VISIBLE_LIMIT = 5;

// @@S mol-3 begin
/**
 * SearchSuggest: search-icon input with a `⌘K` chip, globally focusable via ⌘K, suggesting
 * across the kinds of the `EntityKinds` map (supplied through
 * `EntityKindsProvider`), each with its own glyph and accent. Keyboard-driven: ↑↓ move the active row, Enter opens it, and
 * Enter with no match falls through to `onSearch` — as does the explicit
 * "Search all" row.
 *
 * RELATIONSHIP TO CommandPalette (documented decision): siblings, not
 * shared internals. Both follow the same keyboard model (active-index
 * list, ↑↓/Enter, hand-rolled rows), but SearchSuggest is an inline
 * ARIA combobox — focus stays in the input, the panel anchors to it,
 * substring filtering — while CommandPalette is a modal
 * Overlay running commands with fuzzy matching and focus capture.
 * Merging them would couple an input-anchored popup to a portal overlay
 * for no shared behavior win; what IS shared is reused directly (the
 * `paletteKbd` chip chrome for the ⌘K/↵ hints).
 */
// @@S mol-3 end
// @@T org-1 begin
export const SearchSuggest: FC<SearchSuggestProps> = ({
// @@T org-1 end
  suggestions,
  onSelect,
  onSearch,
  hotkey = true,
  // @@S mol-3 begin
  placeholder = 'Search…',
  // @@S mol-3 end
  defaultOpen = false,
  className,
}: SearchSuggestProps) => {
  // @@S mol-3 begin
  const kinds = useEntityKinds();
  // @@S mol-3 end
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(defaultOpen);
  const [idx, setIdx] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const baseId = useId();

  const needle = q.trim().toLowerCase();
  const filtered = needle
    ? suggestions.filter((s) => `${s.label} ${s.sub ?? ''}`.toLowerCase().includes(needle))
    : suggestions;
  const shown = filtered.slice(0, VISIBLE_LIMIT);

  // Global scope switch: ⌘K / Ctrl-K focuses the input wherever you are.
  useEffect(() => {
    if (!hotkey) return;
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [hotkey]);

  // Outside click dismisses the panel.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [open]);

  const select = (s: SearchSuggestion) => {
    setQ(s.label);
    setOpen(false);
    onSelect?.(s);
  };

  const searchAll = () => {
    setOpen(false);
    onSearch?.(q);
  };

  const onKeyDown = (e: ReactKeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setIdx((i) => Math.min(shown.length - 1, i + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setIdx((i) => Math.max(0, i - 1));
    } else if (e.key === 'Enter') {
      // An Enter that commits an IME composition must not navigate.
      if (e.nativeEvent.isComposing) return;
      const active = shown[idx];
      if (active) select(active);
      else searchAll();
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  const listId = `${baseId}-list`;
  const optId = (i: number) => `${baseId}-opt-${i}`;

  return (
    // @@V org-1 begin
    <div ref={wrapRef} className={cn(searchSuggestRoot(), className)}>
      {/* @@V org-1 end */}
      <div className={searchSuggestBox({ open })}>
        {/* @@V org-1 begin */}
        <Icon name="search" size={14} className={searchSuggestLens()} />
        {/* @@V org-1 end */}
        <input
          ref={inputRef}
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-activedescendant={open && shown[idx]
            ? optId(idx)
            : undefined}
          aria-autocomplete="list"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setIdx(0);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          // @@V org-1 begin
          className={searchSuggestInput()}
          // @@V org-1 end
        />
        <kbd className={paletteKbd({ size: 'sm' })}>⌘K</kbd>
      </div>

      {open && (
        <div className={searchSuggestPanel()}>
          {/* @@V org-1 begin */}
          <div className={searchSuggestHeader()}>
            {/* @@V org-1 end */}
            <span>
              {needle
                ? `matches · ${filtered.length}`
                : 'suggested'}
            </span>
            <span>↑↓ navigate · ↵ open</span>
          </div>
          <div id={listId} role="listbox" aria-label="Suggestions">
            {shown.length === 0 && (
              // @@V org-1 begin
              <div className={searchSuggestEmpty()}>
                {/* @@V org-1 end */}
                No quick matches. Press{' '}
                <kbd className={paletteKbd({ size: 'sm' })}>↵</kbd> to search
                all surfaces.
              </div>
            )}
            {shown.map((s, i) => {
              // @@S mol-3 begin
              const found = s.kind != null
                ? kinds[s.kind]
                : undefined;
              if (s.kind != null && found == null) {
                devWarn(`SearchSuggest: kind "${s.kind}" is not in the EntityKinds map — supply it through EntityKindsProvider`);
              }
              const glyph = s.icon ?? found?.icon;
              const accent = chartTone({ tone: found?.tone });
              // @@S mol-3 end
              return (
                <button
                  key={`${s.kind ?? ''}-${s.label}`}
                  type="button"
                  role="option"
                  id={optId(i)}
                  aria-selected={i === idx}
                  tabIndex={-1}
                  onMouseEnter={() => setIdx(i)}
                  onClick={() => select(s)}
                  className={searchSuggestRow({ active: i === idx })}
                >
                  {/* @@S mol-3 begin */}
                  <span className={cn(searchSuggestPuck(), accent)}>
                    {glyph != null && <Icon name={glyph} size={14} />}
                  </span>
                  {/* @@S mol-3 end */}
                  {/* @@V org-1 begin */}
                  <span className={searchSuggestText()}>
                    <span className={searchSuggestLabel()}>
                      {/* @@V org-1 end */}
                      {s.label}
                    </span>
                    {s.sub != null && (
                      // @@V org-1 begin
                      <span className={searchSuggestSub()}>
                        {/* @@V org-1 end */}
                        {s.sub}
                      </span>
                    )}
                  </span>
                  {/* @@S mol-3 begin */}
                  {s.kind != null && (
                    <span className={cn(searchSuggestKindPill(), accent)}>
                      {s.kind}
                    </span>
                  )}
                  {/* @@S mol-3 end */}
                </button>
              );
            })}
          </div>
          {needle !== '' && (
            // @@V org-1 begin
            <div className={searchSuggestFooter()}>
              {/* @@V org-1 end */}
              <button
                type="button"
                onClick={searchAll}
                // @@V org-1 begin
                className={searchSuggestAll()}
                // @@V org-1 end
              >
                <Icon name="search" size={15} />
                {/* @@V org-1 begin */}
                <span className={searchSuggestAllLabel()}>
                  {/* @@V org-1 end */}
                  Search all for &ldquo;<b>{q}</b>&rdquo;
                </span>
                <kbd className={paletteKbd({ size: 'sm' })}>↵</kbd>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

SearchSuggest.displayName = 'SearchSuggest';
