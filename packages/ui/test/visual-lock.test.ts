/**
 * The shared-port lock (`scripts/visual-lock.sh`): two runs take turns, a
 * lock whose owner is gone is taken over, and a run gives up after its
 * wait. Each case drives real bash processes against a lock in a fresh
 * temporary directory.
 */
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { describe, expect, it } from 'bun:test';

const PACKAGE = join(import.meta.dir, '..');

/** A bash process that takes the lock, prints in/out around a hold, and exits. */
function holder(lock: string, name: string, holdSeconds: number, waitSeconds = 30) {
  return Bun.spawn(['bash', '-c', `PORT=1; source scripts/visual-lock.sh; take_lock; echo "${name} in $(date +%s%N)"; sleep ${holdSeconds}; echo "${name} out $(date +%s%N)"`], {
    cwd: PACKAGE,
    env: { ...process.env, VISUAL_LOCK_DIR: lock, VISUAL_LOCK_POLL_SECONDS: '1', VISUAL_LOCK_WAIT_SECONDS: String(waitSeconds) },
    stdout: 'pipe',
    stderr: 'pipe',
  });
}

/** The nanosecond stamp printed on the line starting with `prefix`. */
function stamp(output: string, prefix: string): bigint {
  const line = output.split('\n').find((entry) => entry.startsWith(prefix));
  if (line === undefined) throw new Error(`no "${prefix}" line in: ${output}`);
  return BigInt(line.split(' ').at(-1) ?? '0');
}

function freshLock(): string {
  return join(mkdtempSync(join(tmpdir(), 'visual-lock-')), 'lock');
}

describe('the shared-port lock', () => {
  it('makes a second run wait until the first releases', async () => {
    const lock = freshLock();
    const first = holder(lock, 'A', 2);
    await Bun.sleep(300);
    const second = holder(lock, 'B', 0);
    const [a, b] = await Promise.all([new Response(first.stdout).text(), new Response(second.stdout).text()]);

    expect(await first.exited).toBe(0);
    expect(await second.exited).toBe(0);
    expect(stamp(b, 'B in')).toBeGreaterThan(stamp(a, 'A out'));
  }, 20_000);

  it('takes over a lock whose owner is gone', async () => {
    const lock = freshLock();
    const gone = Bun.spawn(['true']);
    await gone.exited;
    mkdirSync(lock);
    writeFileSync(join(lock, 'pid'), String(gone.pid));
    const run = holder(lock, 'C', 0);
    const output = await new Response(run.stdout).text();

    expect(await run.exited).toBe(0);
    expect(output).toContain('is gone, taking the lock');
    expect(output).toContain('C in');
  }, 20_000);

  it('gives up with exit code 75 after its wait', async () => {
    const lock = freshLock();
    mkdirSync(lock);
    writeFileSync(join(lock, 'pid'), String(process.pid));
    const run = holder(lock, 'D', 0, 2);

    expect(await run.exited).toBe(75);
    expect(await new Response(run.stderr).text()).toContain('giving up');
  }, 20_000);
});
