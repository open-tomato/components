/**
 * The stream tools: the marker script finds and strips only marker lines,
 * the origin-word check finds whole words and camel-case parts but not the
 * publishing scope, and the plan generator writes a plan per stream and
 * batch with the batch's paths and markers in it.
 */
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { describe, expect, it } from 'bun:test';

import { type Batch, checkFor, planFor, STREAMS } from './make-plans';
import { hitsIn } from './origin-words';

const ROOT = join(import.meta.dir, '..', '..');
const MARKERS = join(import.meta.dir, 'markers.sh');

const SAMPLE = [
  'import { cva } from \'class-variance-authority\';',
  '// @@V mol-2 begin',
  'export const title = cva(\'font-medium\');',
  '// @@V mol-2 end',
  '// a comment that mentions @@V mol-2 begin in prose stays',
  '  {/* @@S org-2 begin */}',
  '  <Slot />',
  '  {/* @@S org-2 end */}',
].join('\n');

function sampleDir(): string {
  const dir = mkdtempSync(join(tmpdir(), 'markers-'));
  writeFileSync(join(dir, 'Sample.tsx'), SAMPLE);
  return dir;
}

describe('markers.sh', () => {
  it('lists marker lines and exits 1 when there are any', () => {
    const run = Bun.spawnSync(['bash', MARKERS, 'list', sampleDir()], { cwd: ROOT });

    expect(run.exitCode).toBe(1);
    expect(run.stdout.toString().split('\n')
      .filter((line) => line.includes('@@'))).toHaveLength(4);
  });

  it('strips only the marker lines', () => {
    const dir = sampleDir();
    const run = Bun.spawnSync(['bash', MARKERS, 'strip', dir], { cwd: ROOT });
    const text = readFileSync(join(dir, 'Sample.tsx'), 'utf8');

    expect(run.exitCode).toBe(0);
    expect(text).toContain('export const title');
    expect(text).toContain('<Slot />');
    expect(text).toContain('in prose stays');
    expect(text.match(/@@/g)).toHaveLength(1);
  });
});

describe('origin words', () => {
  it('finds a whole word and a camel-case part', () => {
    expect(hitsIn('the workspace switcher')).toContain('workspace');
    expect(hitsIn('export function TokensConsumption()')).toContain('tokens');
  });

  it('ignores the publishing scope and words that only contain one', () => {
    expect(hitsIn('import { Button } from \'@open-tomato/components\';')).toEqual([]);
    expect(hitsIn('const hubris = loophole;')).toEqual([]);
  });
});

describe('make-plans', () => {
  const batch: Batch = { id: 'mol-2', group: 'molecules', perTask: 2, components: ['src/molecules/Toast', 'src/molecules/Tooltip', 'src/molecules/Modal'] };

  it('writes one fix task per chunk and the two check tasks', () => {
    const plan = planFor(STREAMS.find((stream) => stream.id === 'V')!, batch);
    const tasks = plan.split('\n').filter((line) => line.startsWith('- [ ] '));

    expect(tasks).toHaveLength(4);
    expect(tasks[0]).toContain('{agent=fidelity-verifier}');
    expect(tasks[1]).toContain('`src/molecules/Toast`, `src/molecules/Tooltip`');
    expect(plan).toContain('stub: components-V-mol-2');
    expect(plan).toContain('`// @@V mol-2 begin`');
  });

  it('builds a scoped check per stream', () => {
    const types = STREAMS.find((stream) => stream.id === 'T')!;

    expect(checkFor(types, ['src/a/B', 'src/a/C'])).toContain('grep -E "^(src/a/B|src/a/C)"');
    expect(STREAMS.map((stream) => stream.id)).toEqual(['R', 'T', 'V', 'S']);
  });
});
