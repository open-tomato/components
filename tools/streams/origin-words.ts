/**
 * Stream S's check: the words that tie a component to the project it came
 * from. Prints `path:line  word  text` for each hit under the paths given
 * (relative to packages/ui) and exits 1 when there is any.
 *
 *   bun ../../tools/streams/origin-words.ts src/atoms/EmptyState src/stories
 *
 * A hit in a comment, a story or a fixture is reworded to a neutral one. A
 * hit in an exported name (a component, a prop, a type) is a public-API
 * rename, so the strip lists it as a proposal in its notes instead of
 * renaming it.
 */
import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

/** The origin words, whole-word and case-insensitive. */
export const ORIGIN_WORDS: readonly string[] = [
  'tomato', 'agentic', 'research', 'session', 'sessions', 'agent', 'agents', 'workspace',
  'workspaces', 'hub', 'spend', 'tokens', 'lens', 'pole', 'poles', 'effort', 'loop', 'rafa', 'atlas',
];

/** The npm scope the kit publishes under, which is not a hit. */
const SCOPE = /@open-tomato\//g;

/** Source extensions the check reads. */
const READ = /\.(ts|tsx|css|mdx?)$/;

/**
 * Every word hit on one line, after removing the publishing scope: a whole
 * word in any case (`workspace`), the head of a camel-case name
 * (`tokensUsed`), or a capitalised part of one (`TokensConsumption`,
 * `useSession`).
 */
export function hitsIn(line: string): string[] {
  const text = line.replace(SCOPE, '');
  return ORIGIN_WORDS.filter((word) => {
    const capital = `${word.charAt(0).toUpperCase()}${word.slice(1)}`;
    return new RegExp(`(^|[^A-Za-z])${word}([^A-Za-z]|$)`, 'i').test(text)
      || new RegExp(`(^|[^A-Za-z])${word}(?=[A-Z])`).test(text)
      || new RegExp(`(^|[^A-Z])${capital}(?=[A-Z]|[^A-Za-z]|$)`).test(text);
  });
}

/** The readable files under `path`, recursively. */
function files(path: string): string[] {
  if (statSync(path).isFile()) return READ.test(path)
    ? [path]
    : [];
  return readdirSync(path).flatMap((entry) => files(join(path, entry)));
}

async function main(): Promise<void> {
  const report: string[] = [];
  for (const file of process.argv.slice(2).flatMap(files)) {
    const lines = (await Bun.file(file).text()).split('\n');
    lines.forEach((line, index) => {
      for (const word of hitsIn(line)) report.push(`${file}:${index + 1}  ${word}  ${line.trim().slice(0, 100)}`);
    });
  }
  if (report.length === 0) {
    console.log('origin-words: none');
    return;
  }
  console.log(report.join('\n'));
  console.log(`origin-words: ${report.length} hit(s)`);
  process.exit(1);
}

if (import.meta.main) await main();
