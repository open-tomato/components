/**
 * Splits the review into one batch per component, so a reviewer can give
 * each component a verdict, and plans the baselines an accepted batch
 * replaces. Pure: the page and the accept command do the file work.
 */
import type { ReviewShot } from './page';

import { join } from 'node:path';

import { SHAPES } from './measure';

export interface Batch {
  /** The story id's component part, such as `organisms-table`: safe in a shell. */
  readonly key: string;
  /** The component's story title, such as `Organisms/Table`. */
  readonly name: string;
  readonly shots: readonly ReviewShot[];
}

/** The component part of a story id: everything before the first `--`. */
export function componentKey(storyId: string): string {
  const cut = storyId.indexOf('--');
  return cut < 0
    ? storyId
    : storyId.slice(0, cut);
}

/** Storybook's id rule for a title: lower case, every other character a dash. */
function toId(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/** The title part of `Organisms/Table With Rows`, found as the prefix whose id is the key. */
export function componentName(story: string, key: string): string {
  for (let cut = story.indexOf(' '); cut > 0; cut = story.indexOf(' ', cut + 1)) {
    const prefix = story.slice(0, cut);
    if (toId(prefix) === key) return prefix;
  }
  return toId(story) === key
    ? story
    : key;
}

const shapeRank = (shot: ReviewShot): number => SHAPES.indexOf(shot.shape);

/** One batch per component, largest first, its shots in shape order. */
export function groupByComponent(shots: readonly ReviewShot[]): readonly Batch[] {
  const byKey = new Map<string, ReviewShot[]>();
  for (const shot of shots) {
    const key = componentKey(shot.storyId);
    byKey.set(key, [...(byKey.get(key) ?? []), shot]);
  }
  return [...byKey.entries()]
    .map(([key, group]) => ({
      key,
      name: componentName(group[0]?.story ?? key, key),
      shots: [...group].sort((a, b) => shapeRank(a) - shapeRank(b) || a.story.localeCompare(b.story)),
    }))
    .sort((a, b) => b.shots.length - a.shots.length || a.name.localeCompare(b.name));
}

/**
 * A short name for one set of failures, so verdicts saved in the browser
 * stay with the run they were given for: a page rebuilt from the same run
 * keeps them, and a new run starts clean. FNV-1a over the sorted shots.
 */
export function runFingerprint(shots: readonly ReviewShot[]): string {
  const text = shots.map((shot) => `${shot.diffFile}:${shot.signature}`).sort()
    .join('|');
  let hash = 0x811c9dc5;
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash.toString(16).padStart(8, '0');
}

export interface Move {
  readonly from: string;
  readonly to: string;
}

export interface AcceptPlan {
  readonly moves: readonly Move[];
  /** Keys the run has no failed shot for. */
  readonly unknown: readonly string[];
}

/**
 * The baselines an accepted batch replaces: only the failed shots' own
 * files. A dark shot that was never compared keeps its baseline, so the
 * next run still checks it.
 */
export function planAccept(shots: readonly ReviewShot[], keys: readonly string[], snapshotsDir: string, backupDir: string): AcceptPlan {
  const known = new Set(shots.map((shot) => componentKey(shot.storyId)));
  const wanted = new Set(keys);
  const files = [...new Set(shots.filter((shot) => wanted.has(componentKey(shot.storyId)))
    .map((shot) => `${shot.storyId}--${shot.theme}.png`))].sort();
  return {
    moves: files.map((file) => ({ from: join(snapshotsDir, file), to: join(backupDir, file) })),
    unknown: keys.filter((key) => !known.has(key)),
  };
}
