import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';

import { describe, expect, it } from 'bun:test';

/**
 * Guards `src/stories` against component chrome hiding in story fixtures.
 *
 * A fixture whose classes change with a prop is the shape that hid the
 * AppShell brand row: it varied with the sidebar's `collapsed`, so the story
 * looked right through classes no consumer could import. Every `variants:`
 * block in a story fixture therefore fails, unless the export's doc comment
 * carries `@storyData <what it follows>`, naming the demo data the variant
 * follows (a row's empty usage, a filler pill's shape). A variant that
 * follows a component's own state belongs to the component instead.
 */

const STORIES_DIR = import.meta.dir;

/** The tag that marks a fixture variant as following demo data. */
const STORY_DATA_TAG = /@storyData[ \t]+\w/;

/**
 * Fixtures that follow a component state and wait on a decision elsewhere,
 * keyed `<file>#<export>`. The test fails when an entry no longer matches a
 * varying fixture, so the list cannot outlive what it excuses.
 */
const AWAITING_DECISION: Readonly<Record<string, string>> = {
  'ContextSwitcher/ContextSwitcher.variants.ts#contextRow':
    'the ContextSwitcher rename issue decides whether ContextSwitcher becomes an export',
};

interface VaryingExport {
  readonly name: string;
  readonly tagged: boolean;
}

/** Lists each `export const` in `source` whose body holds a `variants:` block. */
export function findVaryingExports(source: string): readonly VaryingExport[] {
  const exportPattern = /export const (\w+)/g;
  const starts = [...source.matchAll(exportPattern)];
  return starts.flatMap((match, index) => {
    const start = match.index ?? 0;
    const end = starts[index + 1]?.index ?? source.length;
    if (!source.slice(start, end).includes('variants:')) return [];
    const before = source.slice(0, start).trimEnd();
    const doc = before.endsWith('*/')
      ? before.slice(before.lastIndexOf('/**'))
      : '';
    return [{ name: match[1] ?? '', tagged: STORY_DATA_TAG.test(doc) }];
  });
}

function listVariantFiles(dir: string): readonly string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return listVariantFiles(path);
    return entry.name.endsWith('.variants.ts')
      ? [path]
      : [];
  });
}

function untaggedFixtures(): readonly string[] {
  return listVariantFiles(STORIES_DIR).flatMap((path) => {
    const file = relative(STORIES_DIR, path);
    return findVaryingExports(readFileSync(path, 'utf8'))
      .filter((found) => !found.tagged)
      .map((found) => `${file}#${found.name}`);
  });
}

describe('findVaryingExports', () => {
  it('flags a fixture that varies with a prop and carries no tag', () => {
    const source = [
      '/** The brand row. */',
      'export const brand = cva(\'h-[60px]\', {',
      '  variants: { collapsed: { false: \'px-4\', true: \'p-0\' } },',
      '});',
    ].join('\n');
    expect(findVaryingExports(source)).toEqual([{ name: 'brand', tagged: false }]);
  });

  it('accepts a varying fixture whose doc names the demo data it follows', () => {
    const source = [
      '/**',
      ' * A demo tile.',
      ' *',
      ' * @storyData the tone each demo tile is given',
      ' */',
      'export const tile = cva(\'\', { variants: { tone: { a: \'x\' } } });',
    ].join('\n');
    expect(findVaryingExports(source)).toEqual([{ name: 'tile', tagged: true }]);
  });

  it('rejects a bare tag with no reason after it', () => {
    const source = '/** @storyData */\nexport const tile = cva(\'\', { variants: {} });';
    expect(findVaryingExports(source)).toEqual([{ name: 'tile', tagged: false }]);
  });

  it('ignores static fixtures and reads each export on its own', () => {
    const source = [
      '/** Static. */\nexport const title = cva(\'font-bold\');',
      '/** Varies. */\nexport const row = cva(\'\', { variants: { on: {} } });',
    ].join('\n');
    expect(findVaryingExports(source)).toEqual([{ name: 'row', tagged: false }]);
  });
});

describe('story fixtures', () => {
  it('vary only with demo data, marked @storyData', () => {
    const unexplained = untaggedFixtures().filter((key) => !(key in AWAITING_DECISION));
    expect(
      unexplained,
      'A story fixture that varies with a component prop is chrome: export it from the component, or tag the demo data it follows with @storyData.',
    ).toEqual([]);
  });

  it('keeps every awaiting-decision entry matched to a varying fixture', () => {
    const untagged = new Set(untaggedFixtures());
    const stale = Object.keys(AWAITING_DECISION).filter((key) => !untagged.has(key));
    expect(stale).toEqual([]);
  });
});
