/**
 * The privacy gate: refuses personal and private data in what this public
 * repository tracks. The rules live in `./rules.ts`; this file picks what
 * to read and reports.
 *
 *   bun tools/privacy-gate/privacy-gate.ts            tracked and untracked-not-ignored files
 *   bun tools/privacy-gate/privacy-gate.ts --staged   the index blobs (the pre-commit hook)
 *   bun tools/privacy-gate/privacy-gate.ts --history  every blob and commit identity in every ref
 *
 * `--staged` judges the index, not the worktree, so a value staged and
 * then cleaned up locally still blocks. `--history` is the check before a
 * first push: a value removed by a later commit is still published by the
 * earlier one.
 *
 * A finding that is meant (the author's address in `package.json`, say)
 * goes in `./allow.json` with its path glob, rule and the sha256 of its
 * evidence, so every exception is written down and reviewed in a diff
 * without the allowlist spelling the value.
 */
import { join } from 'node:path';

import { type Finding, scan, sha256 } from './rules';

/**
 * One reviewed exception: a glob of paths, a rule, and the sha256 of the
 * exact evidence, so the allowlist never spells the value it allows.
 */
interface Allowance {
  readonly path: string;
  readonly rule: string;
  readonly sha256: string;
  readonly why: string;
}

/** A file to judge: where it is named from, and its text. */
interface Source {
  readonly name: string;
  readonly path: string;
  readonly text: string;
}

/** Bytes read from each file; larger files are judged on this prefix. */
const MAX_BYTES = 2_000_000;

/** A NUL in the first bytes marks a binary file, which is skipped. */
const BINARY_PROBE = 8000;

/** Run git and answer its stdout, failing loudly on a nonzero exit. */
function git(args: string[], cwd: string): Buffer {
  const result = Bun.spawnSync(['git', ...args], { cwd, maxBuffer: 512 * 1024 * 1024 });
  if (result.exitCode !== 0) throw new Error(`git ${args.join(' ')} failed: ${result.stderr.toString()}`);
  return result.stdout;
}

/** The text of a blob, or null for a binary one. */
function textOf(bytes: Uint8Array): string | null {
  if (bytes.subarray(0, BINARY_PROBE).includes(0)) return null;
  return new TextDecoder().decode(bytes.subarray(0, MAX_BYTES));
}

/** Split NUL-separated git output into its entries. */
function entries(output: Buffer): string[] {
  return output.toString().split('\0')
    .filter((entry) => entry !== '');
}

/** The tracked files and the untracked ones git would track. */
async function treeSources(root: string): Promise<Source[]> {
  const sources: Source[] = [];
  for (const path of entries(git(['ls-files', '-z', '--cached', '--others', '--exclude-standard'], root))) {
    const file = Bun.file(join(root, path));
    if (!(await file.exists())) continue;
    const text = textOf(new Uint8Array(await file.slice(0, MAX_BYTES).arrayBuffer()));
    if (text !== null) sources.push({ name: path, path, text });
  }
  return sources;
}

/** The index blobs of the files a commit would add or change. */
function stagedSources(root: string): Source[] {
  const sources: Source[] = [];
  for (const path of entries(git(['diff', '--cached', '--name-only', '-z', '--diff-filter=ACMR'], root))) {
    const text = textOf(git(['show', `:${path}`], root));
    if (text !== null) sources.push({ name: `${path} (staged)`, path, text });
  }
  return sources;
}

/** Every blob reachable from any ref, each under the first path it was seen at, plus commit identities and messages. */
function historySources(root: string): Source[] {
  const sources: Source[] = [];
  const seen = new Set<string>();
  for (const line of git(['rev-list', '--objects', '--all'], root).toString()
    .split('\n')) {
    const [sha, ...rest] = line.split(' ');
    const path = rest.join(' ');
    if (sha === undefined || path === '' || seen.has(sha)) continue;
    seen.add(sha);
    if (git(['cat-file', '-t', sha], root).toString()
      .trim() !== 'blob') continue;
    const text = textOf(git(['cat-file', 'blob', sha], root));
    if (text !== null) sources.push({ name: `${path} @ ${sha.slice(0, 8)}`, path, text });
  }
  const log = git(['log', '--all', '--format=%h%x00%an <%ae>%x00%cn <%ce>%x00%B%x00%x01'], root).toString();
  for (const record of log.split('\x01')) {
    const [hash, author, committer, body] = record.replace(/^\n/, '').split('\0');
    if (hash === undefined || hash === '') continue;
    sources.push({ name: `commit ${hash}`, path: '.git/COMMIT', text: [author, committer, body].join('\n') });
  }
  return sources;
}

/** The reviewed exceptions, from `allow.json` beside this file. */
async function allowances(): Promise<Allowance[]> {
  const file = Bun.file(join(import.meta.dir, 'allow.json'));
  if (!(await file.exists())) return [];
  return (await file.json()) as Allowance[];
}

/** Whether a finding in `path` is one of the reviewed exceptions. */
function isAllowed(path: string, finding: Finding, allowed: Allowance[]): boolean {
  return allowed.some((allowance) => allowance.rule === finding.rule
    && allowance.sha256 === sha256(finding.evidence)
    && new Bun.Glob(allowance.path).match(path));
}

/** Judge the sources and answer the report lines. */
export async function judge(sources: Source[]): Promise<string[]> {
  const allowed = await allowances();
  const report: string[] = [];
  for (const source of sources) {
    for (const finding of scan(source.path, source.text)) {
      if (isAllowed(source.path, finding, allowed)) continue;
      report.push(`${source.name}:${finding.line}  ${finding.rule}  ${finding.evidence}`);
    }
  }
  return report;
}

async function main(): Promise<void> {
  const argv = process.argv.slice(2);
  const root = git(['rev-parse', '--show-toplevel'], process.cwd()).toString()
    .trim();
  const mode = argv.includes('--staged')
    ? 'staged'
    : argv.includes('--history')
      ? 'history'
      : 'tree';
  const sources = mode === 'staged'
    ? stagedSources(root)
    : mode === 'history'
      ? historySources(root)
      : await treeSources(root);
  const report = await judge(sources);
  if (report.length === 0) {
    console.log(`privacy-gate: ${sources.length} ${mode} sources, no findings`);
    return;
  }
  console.error(`privacy-gate: ${report.length} findings in ${mode} sources\n${report.join('\n')}`);
  console.error('\nRemove each value, replace it with a reserved example, or add a reviewed entry to tools/privacy-gate/allow.json\n(its evidence as sha256: bun -e \'console.log(new Bun.CryptoHasher("sha256").update(process.argv[1]).digest("hex"))\' \'<evidence>\').');
  process.exit(1);
}

if (import.meta.main) await main();
