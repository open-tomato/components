/**
 * The visual review page's measuring and rendering, over synthetic diff
 * images built the way jest-image-snapshot lays them out: three equal
 * panels, changed pixels pure red in the middle one.
 */
import { describe, expect, it } from 'bun:test';
import { PNG } from 'pngjs';

import { componentKey, componentName, groupByComponent, planAccept, runFingerprint } from '../scripts/visual-review/batches';
import {
  classify,
  FAINT_MAX_PIXELS,
  measureDiff,
  parseDiffFile,
  readFailures,
  toShot,
  type Failure,
  type Report,
} from '../scripts/visual-review/measure';
import { escapeHtml, groupBySignature, renderCrops, renderPage, type ReviewShot } from '../scripts/visual-review/page';

const PANEL = 200;
const HEIGHT = 100;

type Paint = readonly [x: number, y: number, colour: readonly [number, number, number]];

/** A diff image whose comparison panel carries the given pixels. */
function diffImage(paints: readonly Paint[]): PNG {
  const png = new PNG({ width: PANEL * 3, height: HEIGHT });
  png.data.fill(128);
  for (const [x, y, colour] of paints) {
    const index = (y * png.width + PANEL + x) * 4;
    png.data[index] = colour[0];
    png.data[index + 1] = colour[1];
    png.data[index + 2] = colour[2];
  }
  return png;
}

const RED = [255, 0, 0] as const;
const YELLOW = [255, 255, 0] as const;

/** A filled rectangle of red pixels. */
function block(x: number, y: number, width: number, height: number): Paint[] {
  return Array.from({ length: width * height }, (_, i) => [x + (i % width), y + Math.floor(i / width), RED] as const);
}

const FAILURE: Failure = {
  story: 'Atoms/Button Primary',
  title: 'Atoms/Button Primary smoke-test',
  diffFile: 'atoms-button--primary--light-diff.png',
  storyId: 'atoms-button--primary',
  theme: 'light',
  reportedPixels: 100,
  sizeChange: null,
};

describe('parseDiffFile', () => {
  it('splits the story id from the theme at the last double dash', () => {
    expect(parseDiffFile('atoms-field--with-icon--dark-diff.png')).toEqual({ storyId: 'atoms-field--with-icon', theme: 'dark' });
  });
});

describe('readFailures', () => {
  const message = (body: string): string => `Error: ${body}\n\u001B[1m\u001B[31mSee diff for details:\u001B[39m\u001B[22m \u001B[31m/x/visual/__diff_output__/atoms-field--default--light-diff.png\u001B[39m\n    at toMatchImageSnapshot`;
  const report = (messages: readonly string[], status = 'failed'): Report => ({
    testResults: [{ assertionResults: [{ fullName: 'Atoms/Field Default smoke-test', status, failureMessages: messages }] }],
  });

  it('reads the diff file and pixel count through the colour codes', () => {
    const [failure] = readFailures(report([message('was 0.04% different from snapshot (397 differing pixels).')]));
    expect(failure).toMatchObject({ story: 'Atoms/Field Default', diffFile: 'atoms-field--default--light-diff.png', theme: 'light', reportedPixels: 397, sizeChange: null });
  });

  it('reads a size change', () => {
    const [failure] = readFailures(report([message('Expected image to be the same size as the snapshot (1280x720), but was different (1280x760).')]));
    expect(failure?.sizeChange).toBe('1280x720 to 1280x760');
  });

  it('skips passed tests and failures that name no diff image', () => {
    expect(readFailures(report([message('(5 differing pixels)')], 'passed'))).toEqual([]);
    expect(readFailures(report(['Error: page crashed']))).toEqual([]);
  });
});

describe('measureDiff', () => {
  it('counts only red pixels in the middle panel, ignoring anti-aliasing', () => {
    const measured = measureDiff(diffImage([...block(10, 10, 5, 4), [50, 50, YELLOW]]));
    expect(measured.changedPixels).toBe(20);
    expect(measured.box).toEqual({ x: 10, y: 10, width: 5, height: 4 });
    expect(measured.spots).toBe(1);
  });

  it('counts far-apart areas as separate spots', () => {
    const measured = measureDiff(diffImage([...block(0, 0, 3, 3), ...block(150, 80, 3, 3)]));
    expect(measured.spots).toBe(2);
    expect(measured.box).toEqual({ x: 0, y: 0, width: 153, height: 83 });
  });

  it('reports no box for a panel without red', () => {
    expect(measureDiff(diffImage([])).box).toBeNull();
  });
});

describe('classify', () => {
  it('names a size change first, whatever the pixels', () => {
    expect(classify({ sizeChange: '1x1 to 2x2' }, measureDiff(diffImage(block(0, 0, 20, 20))))).toBe('size');
  });

  it('names a change at or under the noise floor faint', () => {
    const side = Math.floor(Math.sqrt(FAINT_MAX_PIXELS));
    expect(classify(FAILURE, measureDiff(diffImage(block(0, 0, side, side))))).toBe('faint');
  });

  it('tells one spot, a few spots and a spread change apart', () => {
    expect(classify(FAILURE, measureDiff(diffImage(block(0, 0, 10, 10))))).toBe('one-spot');
    expect(classify(FAILURE, measureDiff(diffImage([...block(0, 0, 10, 10), ...block(60, 0, 10, 10)])))).toBe('few-spots');
    // Seven blocks two grid cells apart, so no two touch.
    const many = Array.from({ length: 7 }, (_, i) => block((i % 4) * 50, Math.floor(i / 4) * 50, 10, 10)).flat();
    expect(classify(FAILURE, measureDiff(diffImage(many)))).toBe('spread');
  });
});

describe('the review page', () => {
  const shot = (diffFile: string, paints: readonly Paint[]): ReviewShot => ({
    ...toShot({ ...FAILURE, diffFile }, measureDiff(diffImage(paints))),
    stability: 'moved',
  });

  it('groups shots that changed in exactly the same pixels', () => {
    const groups = groupBySignature([shot('a-diff.png', block(0, 0, 10, 10)), shot('b-diff.png', block(5, 5, 9, 9)), shot('c-diff.png', block(0, 0, 10, 10))]);
    expect(groups.map((group) => group.map((item) => item.diffFile))).toEqual([['a-diff.png', 'c-diff.png'], ['b-diff.png']]);
  });

  it('links each diff image and story, and escapes story names', () => {
    const page = renderPage({
      shots: [{ ...shot('atoms-button--primary--light-diff.png', block(0, 0, 10, 10)), story: 'Atoms/<Button>' }],
      generatedAt: '2026-11-08T00:00:00Z',
      staleDiffFiles: 3,
      diffHref: '../__diff_output__',
      storybookHref: '../../storybook-static',
    });
    expect(page).toContain('src="../__diff_output__/atoms-button--primary--light-diff.png"');
    expect(page).toContain('href="../../storybook-static/iframe.html?id=atoms-button--primary&viewMode=story"');
    expect(page).toContain('Atoms/&lt;Button&gt;');
    expect(page).toContain('3 older diff images');
    expect(escapeHtml('"&')).toBe('&quot;&amp;');
  });

  it('cuts zoomed crops of the change box from each of the three panels', () => {
    // A 10x10 change at 50,40 in a 200x100 panel: the crop keeps 12px around it.
    const crops = renderCrops(shot('x-diff.png', block(50, 40, 10, 10)), 'x.png');
    expect(crops).toContain('width:136px;height:136px');
    expect(crops).toContain('background-size:2400px 400px');
    expect(crops).toContain('background-position:-152px -112px');
    expect(crops).toContain('background-position:-952px -112px');
    expect(crops).toContain('background-position:-1752px -112px');
    expect(renderCrops(shot('none-diff.png', []), 'none.png')).toBe('');
  });
});

describe('component batches', () => {
  const shot = (storyId: string, story: string, paints: readonly Paint[], theme = 'light'): ReviewShot => ({
    ...toShot({ ...FAILURE, storyId, story, theme, diffFile: `${storyId}--${theme}-diff.png` }, measureDiff(diffImage(paints))),
    stability: 'moved',
  });
  const spread = Array.from({ length: 7 }, (_, i) => block((i % 4) * 50, Math.floor(i / 4) * 50, 10, 10)).flat();

  it('takes the component from the story id, and its title from the story name', () => {
    expect(componentKey('molecules-known-entities--with-rows')).toBe('molecules-known-entities');
    expect(componentName('Molecules/Known Entities With Rows', 'molecules-known-entities')).toBe('Molecules/Known Entities');
    expect(componentName('Atoms/Button', 'atoms-button')).toBe('Atoms/Button');
    expect(componentName('Odd', 'atoms-x')).toBe('atoms-x');
  });

  it('puts the largest component first, and its shots in shape order', () => {
    const batches = groupByComponent([
      shot('atoms-button--primary', 'Atoms/Button Primary', block(0, 0, 10, 10)),
      shot('organisms-table--rows', 'Organisms/Table Rows', spread),
      shot('organisms-table--empty', 'Organisms/Table Empty', block(0, 0, 10, 10)),
    ]);
    expect(batches.map((batch) => batch.name)).toEqual(['Organisms/Table', 'Atoms/Button']);
    expect(batches[0]?.shots.map((item) => item.shape)).toEqual(['one-spot', 'spread']);
  });

  it('names a run by its failures, whatever their order', () => {
    const a = shot('atoms-a--x', 'Atoms/A X', block(0, 0, 10, 10));
    const b = shot('atoms-b--x', 'Atoms/B X', block(0, 0, 10, 10));
    expect(runFingerprint([a, b])).toBe(runFingerprint([b, a]));
    expect(runFingerprint([a, b])).not.toBe(runFingerprint([a]));
  });

  it('moves only the failed baselines of accepted components, and names unknown ones', () => {
    const shots = [
      shot('atoms-button--primary', 'Atoms/Button Primary', block(0, 0, 10, 10)),
      shot('atoms-button--primary', 'Atoms/Button Primary', block(0, 0, 10, 10), 'dark'),
      shot('organisms-table--rows', 'Organisms/Table Rows', spread),
    ];
    const plan = planAccept(shots, ['atoms-button', 'atoms-nope'], 'snaps', 'backup');
    expect(plan.moves).toEqual([
      { from: 'snaps/atoms-button--primary--dark.png', to: 'backup/atoms-button--primary--dark.png' },
      { from: 'snaps/atoms-button--primary--light.png', to: 'backup/atoms-button--primary--light.png' },
    ]);
    expect(plan.unknown).toEqual(['atoms-nope']);
  });

  it('renders one section per component with verdict buttons and the run name', () => {
    const shots = [shot('organisms-table--rows', 'Organisms/Table Rows', spread)];
    const page = renderPage({ shots, generatedAt: 'now', staleDiffFiles: 0, diffHref: 'd', storybookHref: 's' });
    expect(page).toContain('id="organisms-table" data-key="organisms-table" data-name="Organisms/Table"');
    expect(page).toContain('data-verdict="green"');
    expect(page).toContain(`data-run="${runFingerprint(shots)}"`);
    expect(page).toContain('bun run visual:accept');
  });
});
