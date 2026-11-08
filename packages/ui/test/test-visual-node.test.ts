/**
 * `scripts/test-visual.sh` stops before anything else runs when node is not
 * on PATH, because `bun x` would otherwise run the Storybook test runner
 * under Bun, where Jest cannot load. Each case runs the real script with a
 * PATH built for it, so no build, serve or browser ever starts.
 */
import { chmodSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { describe, expect, it } from 'bun:test';

const SCRIPT = join(import.meta.dir, '..', 'scripts', 'test-visual.sh');
const BASH = Bun.which('bash') ?? '/bin/bash';
const MISSING_NODE = 'test-visual: node is not on PATH';

interface ScriptRun {
  readonly exitCode: number;
  readonly stderr: string;
}

/** Runs the script with `path` as its whole PATH. */
async function runWithPath(path: string): Promise<ScriptRun> {
  const child = Bun.spawn([BASH, SCRIPT], {
    env: { PATH: path, HOME: tmpdir() },
    stdout: 'pipe',
    stderr: 'pipe',
  });
  const [exitCode, stderr] = await Promise.all([child.exited, new Response(child.stderr).text()]);
  return { exitCode, stderr };
}

/** An empty directory, so a PATH of it finds no command at all. */
function emptyDir(): string {
  return mkdtempSync(join(tmpdir(), 'test-visual-path-'));
}

describe('test-visual.sh node check', () => {
  it('exits 1 naming the cause and the fix when node is not on PATH', async () => {
    const run = await runWithPath(emptyDir());
    expect(run.exitCode).toBe(1);
    expect(run.stderr).toContain(`${MISSING_NODE}; bun x would run the Storybook test runner under Bun, which cannot load Jest.`);
    expect(run.stderr).toContain('put node on PATH (for example by running through a login shell) and retry.');
  });

  it('passes the check when node is on PATH', async () => {
    // A stand-in node and nothing else: the script gets past the check and
    // then stops at its next command, `dirname`, which this PATH lacks.
    const dir = emptyDir();
    const node = join(dir, 'node');
    writeFileSync(node, '#!/bin/sh\nexit 0\n');
    chmodSync(node, 0o755);
    const run = await runWithPath(dir);
    expect(run.stderr).not.toContain(MISSING_NODE);
    expect(run.stderr).toContain('dirname');
    expect(run.exitCode).not.toBe(0);
  });
});
