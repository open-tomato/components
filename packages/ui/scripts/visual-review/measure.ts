/**
 * Measures the failed shots of a visual run from what the run leaves on
 * disk: the test-storybook JSON reports and the diff images
 * jest-image-snapshot writes to `visual/__diff_output__/`.
 *
 * A diff image is three equal panels side by side: the baseline, the
 * comparison, and the new screenshot. In the comparison panel a pixel that
 * counts as changed is pure red (255,0,0) and an anti-aliased pixel the
 * comparison ignores is pure yellow, so counting red reproduces the
 * "differing pixels" figure of the failure message exactly. Everything
 * here is measured; nothing is guessed from the picture.
 */
import { PNG } from 'pngjs';

/** The run's own floor: below this many changed pixels a reviewed change was never real (see `.storybook/test-runner.ts`). */
export const FAINT_MAX_PIXELS = 84;

/** Side of the grid cell used to count separate changed spots, in pixels. */
export const SPOT_CELL = 24;

/** Most spots, and the largest share of the panel, a change may cover and still count as "a few spots". */
export const FEW_SPOTS_MAX = 5;
export const FEW_SPOTS_MAX_SHARE = 0.25;

/** The shape of a change, in the order the review page lists them. */
export const SHAPES = ['size', 'one-spot', 'few-spots', 'spread', 'faint'] as const;
export type Shape = (typeof SHAPES)[number];

export interface Box {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

/** One failed comparison as the report states it. */
export interface Failure {
  readonly story: string;
  readonly title: string;
  readonly diffFile: string;
  readonly storyId: string;
  readonly theme: string;
  readonly reportedPixels: number | null;
  readonly sizeChange: string | null;
}

/** What the diff image's comparison panel shows. */
export interface Measurement {
  readonly panelWidth: number;
  readonly panelHeight: number;
  readonly changedPixels: number;
  readonly box: Box | null;
  readonly spots: number;
}

export interface Shot extends Failure, Measurement {
  readonly shape: Shape;
  readonly share: number;
  readonly signature: string;
}

interface AssertionResult {
  readonly fullName: string;
  readonly title?: string;
  readonly status: string;
  readonly failureMessages?: readonly string[];
}

export interface Report {
  readonly testResults: readonly { readonly assertionResults: readonly AssertionResult[] }[];
}

/** The terminal colour codes jest writes into failure messages (ESC, then `[…m`). */
const ANSI = new RegExp(`${String.fromCharCode(27)}\\[[0-9;]*m`, 'g');
const DIFF_PATH = /__diff_output__\/(\S+?-diff\.png)/;
const PIXELS = /\((\d+) differing pixels\)/;
const SIZE = /same size as the snapshot \((\d+x\d+)\), but was different \((\d+x\d+)\)/;

/** Splits `<story id>--<theme>-diff.png` into the story id and the theme. */
export function parseDiffFile(file: string): { readonly storyId: string; readonly theme: string } {
  const stem = file.replace(/-diff\.png$/, '');
  const cut = stem.lastIndexOf('--');
  return cut < 0
    ? { storyId: stem, theme: '' }
    : { storyId: stem.slice(0, cut), theme: stem.slice(cut + 2) };
}

/** Reads every failed comparison of one report, with its diff file and figures. */
export function readFailures(report: Report): readonly Failure[] {
  return report.testResults.flatMap((result) => result.assertionResults)
    .filter((assertion) => assertion.status !== 'passed')
    .flatMap((assertion) => (assertion.failureMessages ?? []).map((raw) => {
      const message = raw.replace(ANSI, '');
      const diffFile = DIFF_PATH.exec(message)?.[1];
      if (diffFile === undefined) return null;
      const pixels = PIXELS.exec(message)?.[1];
      const size = SIZE.exec(message);
      const story = assertion.fullName.replace(/ (smoke|play)-test$/, '');
      return {
        story,
        title: assertion.fullName,
        diffFile,
        ...parseDiffFile(diffFile),
        reportedPixels: pixels === undefined
          ? null
          : Number(pixels),
        sizeChange: size === null
          ? null
          : `${size[1]} to ${size[2]}`,
      };
    }))
    .filter((failure): failure is Failure => failure !== null);
}

function isChanged(data: Buffer, index: number): boolean {
  return data[index] === 255 && data[index + 1] === 0 && data[index + 2] === 0;
}

/** Counts the 8-connected groups of occupied grid cells. */
function countSpots(cells: ReadonlySet<number>, columns: number): number {
  const seen = new Set<number>();
  let spots = 0;
  for (const start of cells) {
    if (seen.has(start)) continue;
    spots += 1;
    const queue = [start];
    seen.add(start);
    while (queue.length > 0) {
      const cell = queue.pop() ?? 0;
      const row = Math.floor(cell / columns);
      const column = cell % columns;
      for (let dy = -1; dy <= 1; dy += 1) {
        for (let dx = -1; dx <= 1; dx += 1) {
          const next = (row + dy) * columns + (column + dx);
          const inside = column + dx >= 0 && column + dx < columns;
          if (inside && cells.has(next) && !seen.has(next)) {
            seen.add(next);
            queue.push(next);
          }
        }
      }
    }
  }
  return spots;
}

/** Measures the comparison panel (the middle third) of one diff image. */
export function measureDiff(png: Pick<PNG, 'width' | 'height' | 'data'>): Measurement {
  const panelWidth = Math.floor(png.width / 3);
  const columns = Math.ceil(panelWidth / SPOT_CELL);
  const cells = new Set<number>();
  let changedPixels = 0;
  let left = Infinity;
  let top = Infinity;
  let right = -1;
  let bottom = -1;
  for (let y = 0; y < png.height; y += 1) {
    for (let x = 0; x < panelWidth; x += 1) {
      if (!isChanged(png.data, (y * png.width + panelWidth + x) * 4)) continue;
      changedPixels += 1;
      left = Math.min(left, x);
      right = Math.max(right, x);
      top = Math.min(top, y);
      bottom = Math.max(bottom, y);
      cells.add(Math.floor(y / SPOT_CELL) * columns + Math.floor(x / SPOT_CELL));
    }
  }
  const box = right < 0
    ? null
    : { x: left, y: top, width: right - left + 1, height: bottom - top + 1 };
  return { panelWidth, panelHeight: png.height, changedPixels, box, spots: countSpots(cells, columns) };
}

/** Names the shape of a change from its measurement. */
export function classify(failure: Pick<Failure, 'sizeChange'>, measured: Measurement): Shape {
  if (failure.sizeChange !== null) return 'size';
  if (measured.changedPixels <= FAINT_MAX_PIXELS) return 'faint';
  if (measured.spots <= 1) return 'one-spot';
  return measured.spots <= FEW_SPOTS_MAX && shareOf(measured) <= FEW_SPOTS_MAX_SHARE
    ? 'few-spots'
    : 'spread';
}

function shareOf(measured: Measurement): number {
  const area = measured.panelWidth * measured.panelHeight;
  return measured.box === null || area === 0
    ? 0
    : (measured.box.width * measured.box.height) / area;
}

/** Combines a failure with its measurement. Shots with one signature changed in exactly the same pixels' extent. */
export function toShot(failure: Failure, measured: Measurement): Shot {
  const box = measured.box;
  const where = box === null
    ? 'none'
    : `${box.x},${box.y},${box.width}x${box.height}`;
  return {
    ...failure,
    ...measured,
    shape: classify(failure, measured),
    share: shareOf(measured),
    signature: `${measured.changedPixels}@${where}`,
  };
}

/** Decodes a PNG file's bytes. */
export function decodePng(bytes: Buffer): PNG {
  return PNG.sync.read(bytes);
}
