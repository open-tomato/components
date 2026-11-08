/**
 * Builds a static review page for the last visual run:
 *
 *   bun run visual:review        # from packages/ui
 *
 * Reads `visual-report.first.json` (when the run repeated) and
 * `visual-report.json`, tags each shot with `visual-stable.json`, measures
 * the diff images in `visual/__diff_output__/`, and writes
 * `visual/review/index.html` plus the same data as `review.json`. All of
 * it is gitignored and local to this machine, like the baselines.
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { decodePng, measureDiff, readFailures, SHAPES, toShot, type Failure, type Report } from './measure';
import { renderPage, type ReviewShot, type Stability } from './page';

const DIFF_DIR = join('visual', '__diff_output__');
const OUT_DIR = join('visual', 'review');
const REPORTS = ['visual-report.first.json', 'visual-report.json'];

interface Stable {
  readonly moved: readonly string[];
  readonly flaked: readonly string[];
}

function readJson<T>(path: string): T | null {
  return existsSync(path)
    ? (JSON.parse(readFileSync(path, 'utf8')) as T)
    : null;
}

function stabilityOf(title: string, stable: Stable | null): Stability {
  if (stable === null) return 'unknown';
  if (stable.moved.includes(title)) return 'moved';
  return stable.flaked.includes(title)
    ? 'flaked'
    : 'unknown';
}

const reports = REPORTS.map((path) => readJson<Report>(path)).filter((report): report is Report => report !== null);
if (reports.length === 0) {
  console.error('visual-review: no visual-report.json here; run `bun run test:visual` first, from packages/ui.');
  process.exit(1);
}

// The later report wins for a shot both reports failed: its diff image is the one on disk.
const failures = new Map<string, Failure>();
for (const report of reports) for (const failure of readFailures(report)) failures.set(failure.diffFile, failure);

const stable = readJson<Stable>('visual-stable.json');
const onDisk = existsSync(DIFF_DIR)
  ? readdirSync(DIFF_DIR).filter((file) => file.endsWith('-diff.png'))
  : [];
const shots: ReviewShot[] = [...failures.values()]
  .filter((failure) => onDisk.includes(failure.diffFile))
  .map((failure) => ({
    ...toShot(failure, measureDiff(decodePng(readFileSync(join(DIFF_DIR, failure.diffFile))))),
    stability: stabilityOf(failure.title, stable),
  }));
const missing = failures.size - shots.length;

mkdirSync(OUT_DIR, { recursive: true });
const page = renderPage({
  shots,
  generatedAt: new Date().toISOString(),
  staleDiffFiles: onDisk.filter((file) => !failures.has(file)).length,
  diffHref: '../__diff_output__',
  storybookHref: '../../storybook-static',
});
writeFileSync(join(OUT_DIR, 'index.html'), page);
writeFileSync(join(OUT_DIR, 'review.json'), `${JSON.stringify(shots, null, 2)}\n`);

const counts = SHAPES.map((shape) => `${shape} ${shots.filter((shot) => shot.shape === shape).length}`).join(', ');
console.log(`visual-review: ${shots.length} shots (${counts}) -> ${join(process.cwd(), OUT_DIR, 'index.html')}`);
if (missing > 0) console.log(`visual-review: ${missing} failed shots have no diff image on disk`);
