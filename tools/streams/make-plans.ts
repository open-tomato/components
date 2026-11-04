/**
 * Writes one rafa plan per batch per stream for the components port: the
 * same plan in every case except the files it examines. Reads
 * `batches.json` beside this file and writes
 * `<out>/PLAN-components-<stream>-<batch>.md`.
 *
 *   bun tools/streams/make-plans.ts                  writes into .rafa/plans
 *   bun tools/streams/make-plans.ts --out=<dir>      writes elsewhere
 *   bun tools/streams/make-plans.ts --stream=V --batch=ato-1
 *
 * Each plan checks first, fixes in chunks of components, and checks again.
 * The stream definitions below are the only place a check command, an
 * agent or a stream rule is written.
 */
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

/** One batch from `batches.json`; paths are relative to packages/ui. */
export interface Batch {
  readonly id: string;
  readonly group: string;
  readonly perTask: number;
  readonly components: readonly string[];
  readonly shared?: readonly string[];
}

/** One stream: a kind of check run over every batch. */
export interface Stream {
  readonly id: 'V' | 'T' | 'S' | 'R';
  readonly name: string;
  /** The check, run from packages/ui; `{paths}` takes the batch's paths, space-separated. */
  readonly check: string;
  /** What a fix task does to its components. */
  readonly fix: string;
  readonly fixRoute: string;
  /** Whether the stream may move a visual shot. */
  readonly movesPixels: boolean;
  /** The stream's own rules, added to the shared ones. */
  readonly rules: readonly string[];
}

const CHECK_ROUTE = 'agent=fidelity-verifier';

export const STREAMS: readonly Stream[] = [
  {
    id: 'R',
    name: 'render tests',
    check: 'bun test --coverage {paths}',
    fix: 'Add a render test beside each component in',
    fixRoute: 'agent=tdd-guide effort=medium',
    movesPixels: false,
    rules: [
      'One `<Name>.test.tsx` beside each component, under `bun test` with the happy-dom preload (`test/happy-dom.ts`). Use Testing Library queries by role and name, and render every variant a story renders.',
      'A component with behaviour (handlers, state, keyboard) gets one test per behaviour its stories show, driven with `fireEvent`.',
      'The batch is done when every component has a test and the batch\'s line coverage is at least 80%. Tests add files only: no source file changes.',
    ],
  },
  {
    id: 'T',
    name: 'types',
    check: 'bunx tsc -p tsconfig.isolated.json | grep -E "^({pathsRegex})"',
    fix: 'Give every export an explicit type for isolatedDeclarations in',
    fixRoute: 'agent=build-error-resolver effort=medium',
    movesPixels: false,
    rules: [
      'Write each type the compiler already infers: `bunx vite build` emits the inferred `.d.ts` under `dist/`, which is the draft for each annotation.',
      'Only declaration lines change. No runtime code, no class string and no story changes.',
      'Done when the check prints no error under the batch\'s paths and the built `.d.ts` of the batch is unchanged apart from formatting.',
    ],
  },
  {
    id: 'V',
    name: 'variants',
    check: 'bunx eslint -c eslint.variants.mjs {paths}',
    fix: 'Move every ad-hoc className into its .variants.ts as cva calls in',
    fixRoute: 'agent=loop-implementer effort=medium',
    movesPixels: false,
    rules: [
      'A className holds only a variants call, `cn()` over variants calls and the passthrough `className`, or the passthrough alone (`ot/cva-only-classname`).',
      'The rendered class list stays byte-identical: move strings, never change them. A new cva export carries its explicit type, so stream T never returns to it.',
      'Done when the check reports no error on the batch.',
    ],
  },
  {
    id: 'S',
    name: 'strip',
    check: 'bun ../../tools/streams/origin-words.ts {paths}',
    fix: 'Strip the project coupling from',
    fixRoute: 'agent=component-porter effort=high',
    movesPixels: true,
    rules: [
      'Reword every origin word in comments, stories and fixtures to a neutral one. A word inside an exported name (a component, a prop, a type) is a public-API rename: list it in the notes as a proposal and leave it.',
      'Preserve layout: a shell or toolbar becomes a wrapper whose layout defines slots, some required and some optional, and what fills them is the caller\'s. A template that repeats one shape with small differences (KnownEntities) becomes driven by one `kind` prop that swaps icon, colours and texts.',
      'Story titles and story names stay, so story ids keep pairing with the baselines. Shots may move: list each moved shot in the notes for the user\'s review.',
      'Done when the check prints no hit outside the listed rename proposals.',
    ],
  },
];

/** Rules every stream follows. */
const SHARED_RULES: readonly string[] = [
  'Run every command from `packages/ui`. Paths in this plan are relative to it.',
  'Touch only the files of this batch. A fix that needs a file outside it is reported as an `own-gap` in `out_of_scope_bugs`, naming the file.',
  'Change no style: no new classes, no token or theme edits.',
  'Other loops share this machine: never stop a process or free a port, and never reseed a baseline (`test:visual:update`). A moved shot is a finding for the notes.',
  'Wrap every hunk you write in a file another stream may also edit (a component `.tsx`, its `.variants.ts`, a barrel) in provenance markers, one per line: `// @@{stream} {batch} begin` and `// @@{stream} {batch} end`, or `{/* @@{stream} {batch} begin */}` inside JSX. New files need none. `../../tools/streams/markers.sh list` shows them.',
  'Leave everything you add in its final form: explicit types on new exports, variants calls for new classes.',
  'The visual suite is `bun run test:visual`. It waits for the shared port, and a shot only counts as moved when it fails twice; read `visual-stable.json`.',
];

/** Chunks of `size` from `items`. */
function chunks<T>(items: readonly T[], size: number): T[][] {
  const out: T[][] = [];
  for (let index = 0; index < items.length; index += size) out.push(items.slice(index, index + size));
  return out;
}

/** The inline-code list of paths. */
function codeList(paths: readonly string[]): string {
  return paths.map((path) => `\`${path}\``).join(', ');
}

/** The check command for a set of paths. */
export function checkFor(stream: Stream, paths: readonly string[]): string {
  const regex = paths.map((path) => path.replace(/[.]/g, '\\.')).join('|');
  return stream.check.replace('{paths}', paths.join(' ')).replace('{pathsRegex}', regex);
}

/** The plan text for one stream and one batch. */
export function planFor(stream: Stream, batch: Batch): string {
  const stub = `components-${stream.id}-${batch.id}`;
  const paths = [...batch.components, ...(batch.shared ?? [])];
  const notes = `.rafa/notes/${stub}.md`;
  const fill = (rule: string): string => rule.replaceAll('{stream}', stream.id).replaceAll('{batch}', batch.id);
  const visual = stream.movesPixels
    ? 'Shots may move in this stream; list every moved shot from `visual-stable.json` in the notes.'
    : 'No shot may move in this stream: `visual-stable.json` must list no moved shot.';
  const fixTasks = chunks(batch.components, batch.perTask)
    .map((group) => `- [ ] ${stream.fix} ${codeList(group)}  {${stream.fixRoute}}`);
  if (batch.shared !== undefined) fixTasks.push(`- [ ] ${stream.fix} the shared folders ${codeList(batch.shared)}  {${stream.fixRoute}}`);
  return [
    `# Plan: components port, ${stream.name}, batch ${batch.id}`,
    '',
    '```rafa:plan',
    `stub: ${stub}`,
    'release: none',
    '```',
    '',
    '```rafa:context',
    `Stream ${stream.id} (${stream.name}) of the components port, over batch ${batch.id}: ${codeList(paths)}.`,
    '',
    `The check, from \`packages/ui\`: \`${checkFor(stream, paths)}\`.`,
    '',
    ...[...SHARED_RULES, ...stream.rules].map((rule) => `- ${fill(rule)}`),
    `- ${visual}`,
    `- Notes for this plan live in \`${notes}\` (at the repository root): the check's failing list, the gate captures, and anything the merge must know.`,
    '```',
    '',
    '## Description',
    '',
    'One of 36 plans (4 streams by 9 batches) generated by `tools/streams/make-plans.ts`. The plans of other streams edit the same files on their own branches, and the merge combines them in the order R, T, V, S using the markers.',
    '',
    '# Stage: Check first',
    '',
    `- [ ] Run the ${stream.name} check on the batch and write the failing list, per component, to \`${notes}\`  {${CHECK_ROUTE}}`,
    '',
    '# Stage: Fix',
    '',
    ...fixTasks,
    '',
    '# Stage: Check again',
    '',
    `- [ ] Run the ${stream.name} check, then lint, tsc, build and the visual suite, and record the captures in \`${notes}\`  {${CHECK_ROUTE}}`,
    '',
  ].join('\n');
}

/** The value of a `--name=value` flag. */
function flag(name: string): string | undefined {
  return process.argv.find((arg) => arg.startsWith(`--${name}=`))?.slice(name.length + 3);
}

async function main(): Promise<void> {
  const root = join(import.meta.dir, '..', '..');
  const out = flag('out') ?? join(root, '.rafa', 'plans');
  const { batches } = (await Bun.file(join(import.meta.dir, 'batches.json')).json()) as { batches: Batch[] };
  const wantedStream = flag('stream');
  const wantedBatch = flag('batch');
  const streams = STREAMS.filter((stream) => wantedStream === undefined || stream.id === wantedStream);
  const picked = batches.filter((batch) => wantedBatch === undefined || batch.id === wantedBatch);
  mkdirSync(out, { recursive: true });
  for (const stream of streams) {
    for (const batch of picked) {
      await Bun.write(join(out, `PLAN-components-${stream.id}-${batch.id}.md`), planFor(stream, batch));
    }
  }
  console.log(`make-plans: wrote ${streams.length * picked.length} plan(s) to ${out}`);
}

if (import.meta.main) await main();
