/**
 * Reads one or two test-storybook JSON reports and writes the shots that
 * failed in every one of them to `visual-stable.json`: a shot that fails
 * once and passes on the repeat is a flake of a loaded machine, and one
 * that fails both times moved. Exits 1 when any shot moved.
 *
 *   bun scripts/visual-stable.ts visual-report.json
 *   bun scripts/visual-stable.ts visual-report.first.json visual-report.json
 */

interface AssertionResult {
  readonly fullName: string;
  readonly status: string;
}

interface Report {
  readonly testResults: readonly { readonly assertionResults: readonly AssertionResult[] }[];
}

/** The full names of the failing tests in one report. */
async function failures(path: string): Promise<Set<string>> {
  const report = (await Bun.file(path).json()) as Report;
  const failed = report.testResults
    .flatMap((result) => result.assertionResults)
    .filter((assertion) => assertion.status !== 'passed')
    .map((assertion) => assertion.fullName);
  return new Set(failed);
}

const paths = process.argv.slice(2);
if (paths.length === 0) throw new Error('visual-stable: name one or two report files');

const sets = await Promise.all(paths.map(failures));
const [first, ...rest] = sets;
const moved = [...(first ?? [])].filter((name) => rest.every((set) => set.has(name)))
  .sort();
const flaked = [...new Set(sets.flatMap((set) => [...set]))].filter((name) => !moved.includes(name))
  .sort();

await Bun.write('visual-stable.json', `${JSON.stringify({ runs: paths.length, moved, flaked }, null, 2)}\n`);
console.log(`visual: ${moved.length} moved, ${flaked.length} flaked over ${paths.length} run(s); see visual-stable.json`);
for (const name of moved) console.log(`  moved: ${name}`);
if (moved.length > 0) process.exit(1);
