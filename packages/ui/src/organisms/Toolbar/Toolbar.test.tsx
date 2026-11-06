import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeAll, describe, expect, it, mock } from 'bun:test';
import { useState, type ReactElement } from 'react';

import { ITEMS } from '../../stories/items';

import { FilterDropdown } from './FilterDropdown';
import { SearchInput } from './SearchInput';
import {
  Toolbar,
  ToolbarControls,
  ToolbarSep,
  ToolbarSummary,
} from './Toolbar';
import { Attached, Detached } from './Toolbar.stories';

beforeAll(() => {
  class NoopResizeObserver {
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
  }
  window.ResizeObserver = NoopResizeObserver as unknown as typeof ResizeObserver;
});

afterEach(cleanup);

const OPTIONS = [
  { value: 'live', label: 'Live' },
  { value: 'done', label: 'Done' },
];

const openMenu = async (): Promise<void> => {
  await act(async () => {
    fireEvent.keyDown(screen.getByRole('button', { name: /Status/ }), { key: 'ArrowDown' });
  });
};

describe('Toolbar compound', () => {
  it('renders controls, separator and summary inside the surface', () => {
    render(
      <Toolbar data-testid="bar" className="extra">
        <ToolbarControls data-testid="controls">
          <span>a</span>
          <ToolbarSep />
        </ToolbarControls>
        <ToolbarSummary data-testid="summary">12 results</ToolbarSummary>
      </Toolbar>,
    );
    expect(screen.getByTestId('bar').className).toContain('extra');
    expect(screen.getByTestId('controls').textContent).toBe('a');
    expect(screen.getByText('12 results')).toBeTruthy();
  });

  it('renders the summary divided and undivided', () => {
    render(
      <>
        <ToolbarSummary data-testid="plain">x</ToolbarSummary>
        <ToolbarSummary data-testid="div" divided>y</ToolbarSummary>
      </>,
    );
    expect(screen.getByTestId('div').className).not.toBe(screen.getByTestId('plain').className);
  });

  it('hides the separator from assistive tech', () => {
    const { container } = render(<ToolbarSep className="sep" />);
    const el = container.firstElementChild as HTMLElement;
    expect(el.getAttribute('aria-hidden')).toBe('true');
    expect(el.className).toContain('sep');
  });
});

describe('SearchInput', () => {
  it('shows the default placeholder and no clear button when empty', () => {
    render(<SearchInput value="" onChange={() => {}} />);
    expect(screen.getByPlaceholderText('Search…')).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Clear search' })).toBeNull();
  });

  it('reports typed text through onChange', () => {
    const onChange = mock((_v: string) => {});
    render(<SearchInput value="" onChange={onChange} placeholder="Find" />);
    fireEvent.change(screen.getByPlaceholderText('Find'), { target: { value: 'abc' } });
    expect(onChange).toHaveBeenCalledWith('abc');
  });

  it('clears via the clear button', () => {
    const onChange = mock((_v: string) => {});
    render(<SearchInput value="abc" onChange={onChange} />);
    fireEvent.click(screen.getByRole('button', { name: 'Clear search' }));
    expect(onChange).toHaveBeenCalledWith('');
  });

  it('round-trips when controlled', () => {
    const Demo = () => {
      const [v, setV] = useState('');
      return <SearchInput value={v} onChange={setV} />;
    };
    render(<Demo />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'q' } });
    expect((screen.getByRole('textbox') as HTMLInputElement).value).toBe('q');
    fireEvent.click(screen.getByRole('button', { name: 'Clear search' }));
    expect((screen.getByRole('textbox') as HTMLInputElement).value).toBe('');
  });
});

describe('FilterDropdown', () => {
  it('shows no count badge when nothing is selected', () => {
    render(
      <FilterDropdown label="Status" options={OPTIONS} selected={[]} onToggle={() => {}} onClear={() => {}} />,
    );
    expect(screen.getByRole('button', { name: /Status/ })).toBeTruthy();
    expect(screen.queryByText('1')).toBeNull();
  });

  it('shows the selected count badge', () => {
    render(
      <FilterDropdown label="Status" options={OPTIONS} selected={['live', 'done']} onToggle={() => {}} onClear={() => {}} />,
    );
    expect(screen.getByText('2')).toBeTruthy();
  });

  it('toggles an option when opened', async () => {
    const onToggle = mock((_v: string) => {});
    render(
      <FilterDropdown label="Status" options={OPTIONS} selected={[]} onToggle={onToggle} onClear={() => {}} />,
    );
    await openMenu();
    expect(screen.queryByText('Clear status')).toBeNull();
    fireEvent.click(screen.getByRole('menuitem', { name: 'Done' }));
    expect(onToggle).toHaveBeenCalledWith('done');
  });

  it('offers Clear when a value is selected', async () => {
    const onClear = mock(() => {});
    render(
      <FilterDropdown label="Status" options={OPTIONS} selected={['live']} onToggle={() => {}} onClear={onClear} />,
    );
    await openMenu();
    fireEvent.click(screen.getByRole('menuitem', { name: 'Clear status' }));
    expect(onClear).toHaveBeenCalledTimes(1);
  });
});

describe.each([
  ['Detached', Detached],
  ['Attached', Attached],
])('%s story results', (_name, story) => {
  const renderStory = (): void => {
    const Story = story.render as () => ReactElement;
    render(<Story />);
  };

  it('shows the illustration in the empty state when no item matches', () => {
    renderStory();
    fireEvent.change(screen.getByPlaceholderText('Search…'), { target: { value: 'zzz-no-such-item' } });
    const title = screen.getByText('No items match');
    const mark = title.parentElement?.querySelector('span') as HTMLElement;
    expect(mark.querySelector('svg')).not.toBeNull();
    expect(screen.queryAllByRole('row')).toHaveLength(0);
  });

  it('renders a row for each item when the query is empty', () => {
    renderStory();
    expect(screen.queryByText('No items match')).toBeNull();
    expect(document.querySelectorAll('tbody tr')).toHaveLength(ITEMS.length);
  });
});
