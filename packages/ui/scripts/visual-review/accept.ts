/**
 * Accepts the batches a reviewer marked green on the review page:
 *
 *   bun run visual:accept organisms-table atoms-field   # from packages/ui
 *
 * Moves each failed shot's baseline of those components into
 * `visual/__baseline_backup__/<time>/`, so the next `bun run test:visual`
 * writes it fresh from the current render. Nothing is deleted: copying the
 * backup folder back restores the old baselines.
 */
import type { ReviewShot } from './page';

import { existsSync, mkdirSync, readFileSync, renameSync } from 'node:fs';
import { join } from 'node:path';

import { planAccept } from './batches';

const REVIEW = join('visual', 'review', 'review.json');
const SNAPSHOTS = join('visual', '__image_snapshots__');
const BACKUPS = join('visual', '__baseline_backup__');

const keys = process.argv.slice(2);
if (keys.length === 0) {
  console.error('visual-accept: name the components to accept, as the review page lists them (for example organisms-table).');
  process.exit(1);
}
if (!existsSync(REVIEW)) {
  console.error('visual-accept: no visual/review/review.json here; run `bun run visual:review` first, from packages/ui.');
  process.exit(1);
}

const shots = JSON.parse(readFileSync(REVIEW, 'utf8')) as ReviewShot[];
const backupDir = join(BACKUPS, new Date().toISOString()
  .replace(/[:.]/g, '-'));
const plan = planAccept(shots, keys, SNAPSHOTS, backupDir);
if (plan.unknown.length > 0) {
  console.error(`visual-accept: the last run has no failed shot for ${plan.unknown.join(', ')}; nothing was moved.`);
  process.exit(1);
}

const present = plan.moves.filter((move) => existsSync(move.from));
mkdirSync(backupDir, { recursive: true });
for (const move of present) renameSync(move.from, move.to);

console.log(`visual-accept: moved ${present.length} baselines of ${keys.length} components to ${backupDir}`);
if (present.length < plan.moves.length) console.log(`visual-accept: ${plan.moves.length - present.length} baselines were already gone`);
console.log('visual-accept: run `bun run test:visual` to write them fresh; a plain run writes every missing baseline.');
console.log(`visual-accept: to undo, run: cp ${backupDir}/*.png ${SNAPSHOTS}/`);
