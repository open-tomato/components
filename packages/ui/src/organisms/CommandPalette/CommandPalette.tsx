import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react';

import { Overlay } from '../../atoms/Overlay';
import { StrokeIcon } from '../../lib/icons';

import {
  // @@V org-2 begin
  paletteCount,
  paletteEmpty,
  paletteEmptyHint,
  paletteEmptyIcon,
  paletteEmptyTitle,
  paletteFooter,
  paletteGroup,
  paletteGroupLabel,
  paletteIconSlot,
  // @@V org-2 end
  paletteItem,
  paletteItemIcon,
  // @@V org-2 begin
  paletteItemLabel,
  // @@V org-2 end
  paletteKbd,
  // @@V org-2 begin
  paletteList,
  paletteOverlay,
  // @@V org-2 end
  palettePanel,
  // @@V org-2 begin
  paletteSearchInput,
  paletteSearchRow,
  // @@V org-2 end
} from './CommandPalette.variants';
import { KeyHint } from './KeyHint';

export interface Command {
  id: string;
  /** Group heading the command files under while searching. */
  group: string;
  icon?: ReactNode;
  label: string;
  /** Trailing mono chip (a shortcut like ⌘N, or a status). */
  hint?: ReactNode;
  // @@S org-2 begin
  /** Extra search terms the fuzzy filter also matches against. */
  // @@S org-2 end
  keys?: string;
}

/** Subsequence fuzzy match — the query chars must appear in order. */
// eslint-disable-next-line react-refresh/only-export-components -- fuzzy is part of the palette's public API, colocated with its only consumer
export function fuzzy(q: string, text: string): boolean {
  if (!q) return true;
  const query = q.toLowerCase();
  const hay = text.toLowerCase();
  let i = 0;
  for (const ch of hay) {
    if (ch === query[i]) i++;
    if (i === query.length) return true;
  }
  return false;
}

export interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  onRun: (command: Command) => void;
  commands: Command[];
  /**
   * Command ids surfaced as a "Recent" group while the query is empty;
   * omit to show the full grouped registry instead.
   */
  recent?: string[];
  placeholder?: string;
}

/** Delay before focusing the input, letting the portal mount (demo source: 60). */
const FOCUS_DELAY_MS = 60;
/** Breathing room kept above/below the active row while scrolling it in. */
const SCROLL_PAD_PX = 6;

const RECENT_GROUP = 'Recent';

/**
 * Inner panel, mounted fresh by the Overlay portal each time the palette
 * opens — so query and active-row state start clean without any
 * effect-driven resets.
 */
const PalettePanel = ({
  onClose,
  onRun,
  commands,
  recent,
  // @@S org-2 begin
  placeholder = 'Search commands…',
  // @@S org-2 end
}: Omit<CommandPaletteProps, 'open'>) => {
  const [q, setQ] = useState('');
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus the input shortly after the portal mounts (demo source: 60ms).
  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), FOCUS_DELAY_MS);
    return () => clearTimeout(t);
  }, []);

  // filter → ordered, grouped (group order = first appearance)
  const groups = useMemo(() => {
    const base = q
      ? commands.filter((c) => fuzzy(q, c.label) || fuzzy(q, c.keys ?? ''))
      : recent
        ? recent
          .map((id) => commands.find((c) => c.id === id))
          .filter((c): c is Command => c != null)
          .map((c) => ({ ...c, group: RECENT_GROUP }))
        : commands;
    const order: string[] = [];
    for (const c of base) if (!order.includes(c.group)) order.push(c.group);
    return order
      .map((g) => ({ group: g, items: base.filter((c) => c.group === g) }))
      .filter((g) => g.items.length > 0);
  }, [q, commands, recent]);

  const flat = useMemo(() => groups.flatMap((g) => g.items), [groups]);

  // keep the active row in view without scrollIntoView
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const el = list.querySelector<HTMLElement>(`[data-cmd-idx="${active}"]`);
    if (!el) return;
    const top = el.offsetTop;
    const bottom = top + el.offsetHeight;
    if (top < list.scrollTop) list.scrollTop = top - SCROLL_PAD_PX;
    else if (bottom > list.scrollTop + list.clientHeight)
      list.scrollTop = bottom - list.clientHeight + SCROLL_PAD_PX;
  }, [active]);

  const run = (cmd: Command | undefined) => {
    if (!cmd) return;
    onRun(cmd);
    onClose();
  };

  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => Math.min(flat.length - 1, a + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(0, a - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      run(flat[active]);
    } else if (e.key === 'Home') {
      e.preventDefault();
      setActive(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setActive(flat.length - 1);
    }
  };

  let idx = -1;
  return (
    <div className={palettePanel()}>
      {/* search row — the form kit's field, lightly dressed */}
      <div
        // @@V org-2 begin
        className={paletteSearchRow()}
        // @@V org-2 end
      >
        <span
          // @@V org-2 begin
          className={paletteIconSlot()}
          // @@V org-2 end
        >
          <StrokeIcon name="search" size={19} />
        </span>
        <input
          ref={inputRef}
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setActive(0);
          }}
          onKeyDown={onKey}
          placeholder={placeholder}
          // @@V org-2 begin
          className={paletteSearchInput()}
          // @@V org-2 end
        />
        <kbd className={paletteKbd()}>esc</kbd>
      </div>

      {/* results — the Menu behavior, keyboard-driven */}
      <div
        ref={listRef}
        // @@V org-2 begin
        className={paletteList()}
        // @@V org-2 end
      >
        {flat.length === 0
          ? (
            <div
              // @@V org-2 begin
              className={paletteEmpty()}
              // @@V org-2 end
            >
              <span
                // @@V org-2 begin
                className={paletteEmptyIcon()}
                // @@V org-2 end
              >
                <StrokeIcon name="search" size={26} />
              </span>
              <div
                // @@V org-2 begin
                className={paletteEmptyTitle()}
                // @@V org-2 end
              >
                No commands for &ldquo;{q}&rdquo;
              </div>
              <div
                // @@V org-2 begin
                className={paletteEmptyHint()}
                // @@V org-2 end
              >
                {/* @@S org-2 begin */}
                Try a page name or an action.
                {/* @@S org-2 end */}
              </div>
            </div>
          )
          : (
            groups.map((g) => (
              <div
                key={g.group}
                // @@V org-2 begin
                className={paletteGroup()}
                // @@V org-2 end
              >
                <div
                  // @@V org-2 begin
                  className={paletteGroupLabel()}
                  // @@V org-2 end
                >
                  {g.group}
                </div>
                {g.items.map((c) => {
                  idx++;
                  const i = idx;
                  const on = i === active;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      data-cmd-idx={i}
                      onMouseMove={() => setActive(i)}
                      onClick={() => run(c)}
                      className={paletteItem({ active: on })}
                    >
                      <span className={paletteItemIcon({ active: on })}>
                        {c.icon}
                      </span>
                      <span
                        // @@V org-2 begin
                        className={paletteItemLabel()}
                        // @@V org-2 end
                      >
                        {c.label}
                      </span>
                      {c.hint != null && (
                        <span className={paletteKbd({ size: 'sm' })}>
                          {c.hint}
                        </span>
                      )}
                      {on && (
                        <span
                          // @@V org-2 begin
                          className={paletteIconSlot()}
                          // @@V org-2 end
                        >
                          <StrokeIcon name="cornerDownRight" size={15} />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))
          )}
      </div>

      {/* footer key hints */}
      <div
        // @@V org-2 begin
        className={paletteFooter()}
        // @@V org-2 end
      >
        <KeyHint k="↑↓" label="navigate" />
        <KeyHint k="↵" label="run" />
        <KeyHint k="esc" label="close" />
        <span
          // @@V org-2 begin
          className={paletteCount()}
          // @@V org-2 end
        >
          {flat.length} result{flat.length === 1
            ? ''
            : 's'}
        </span>
      </div>
    </div>
  );
};

// @@T org-2 begin
export const CommandPalette: { (p: CommandPaletteProps): import('react').JSX.Element; displayName: string } = (({
  open,
  onClose,
  onRun,
  commands,
  recent,
  placeholder,
}: CommandPaletteProps) => (
  <Overlay
    open={open}
    onClose={onClose}
    position="center"
    backdrop="blur"
    dismiss="both"
    label="Command palette"
    // @@V org-2 begin
    className={paletteOverlay()}
    // @@V org-2 end
  >
    <PalettePanel
      onClose={onClose}
      onRun={onRun}
      commands={commands}
      recent={recent}
      placeholder={placeholder}
    />
  </Overlay>
)) as { (p: CommandPaletteProps): import('react').JSX.Element; displayName: string };
// @@T org-2 end

CommandPalette.displayName = 'CommandPalette';
