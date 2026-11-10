# components-library

A variant-first React component library — CVA + Tailwind 4 + Radix primitives,
organized by atomic design up to full application shells — plus a dual-entry
caching module (TanStack Query in the browser, Redis cache-aside on the
server). The repo is a single package and doubles as the component workbench:
Storybook, smoke/unit/visual test suites, and a pixel-fidelity comparator all
live here.

Peer deps: `react` / `react-dom` ^19 (and optionally `ioredis` ^5 for the
server cache).

## Authoring & origins

Created by **Marcos Tomatti**. This library was extracted from **Open Tomato**
(a private project by the same author) as a standalone package, intended for
ad-hoc apps that use a similar application shell — `AppShell`/`AuthShell`, the
auth page set, and the variant-first atoms they compose. The **design-system
extraction pipeline** (design handoff → component specs → rosetta side-by-side
comparison) still lives in the author's separate design-extraction project; this repo carries
the consuming half of that workflow — the `design/` reference-page contract,
`scripts/compare-design.mjs`, and the `component-porter` agent for landing
finished components here.

If you build on this work, keep the pointer back to it — see
[License](#license).

## Structure

```text
src/
├── atoms/          # smallest building blocks — Button, Field, Icon, Chip,
│                   # StatusIndicator, Sparkline, brand marks, …
├── molecules/      # composed controls — Modal, Drawer, Select, Toast,
│                   # Wizard, Stepper, charts, stat cards, …
├── organisms/      # app-level assemblies — CommandPalette, Table, Toolbar,
│                   # FormKit, ProfileMenu, …
├── templates/      # application shells — AppShell, AuthShell
├── pages/          # full page compositions (auth flows)
├── stories/        # shared story fixtures
├── lib/            # cn() and shared utilities (formatting lives here)
├── styles/         # the theming split — tokens.css / theme.css / fonts.css /
│                   # lib.css (published styles entry) / global.css (workbench)
└── cache/          # the caching module (./cache and ./cache/server exports)
```

Every component owns a folder with the same four files:

```text
src/<layer>/<Name>/
├── index.ts              # barrel exporter
├── <Name>.tsx            # component definition
├── <Name>.variants.ts    # CVA variant definitions
└── <Name>.stories.tsx    # Storybook stories (one per variant/state)
```

Molecules and above may colocate internal sub-components in the same folder,
exported through the parent's barrel. Layers roll up through layer barrels into
the root `src/index.tsx`. Styling is variants-only: axes live in
`<Name>.variants.ts`, call sites pass variants and flags — not class strings.

## Exports
<!-- doc-links-skip: @open-tomato/components/styles.css -- package export, not file path -->
<!-- doc-links-skip: @open-tomato/components/theme.css -- package export, not file path -->
<!-- doc-links-skip: @open-tomato/components/fonts.css -- package export, not file path -->

| Import | Contents |
| --- | --- |
| `@open-tomato/components` | every component, `cn()` |
| `@open-tomato/components/styles.css` | the styles entry: fonts + default theme + component contract + Tailwind `@source` scan |
| `@open-tomato/components/theme.css` | the default theme definition alone (semantic variables, light + dark) |
| `@open-tomato/components/fonts.css` | the default type faces alone: `@font-face` rules over the woff2 files in `dist/styles/fonts/` (see [Fonts](#fonts)) |
| `@open-tomato/components/cache` | browser cache: `useCache`, `QueryProvider`, `defaultQueryClient`, re-exported TanStack Query core |
| `@open-tomato/components/cache/server` | server cache: `createServerCache` (Redis cache-aside; `ioredis` optional peer) |

## Setup (Tailwind 4 consumers)

The package ships **no prebuilt utility CSS** — your Tailwind build generates
exactly the classes the components use. In your Tailwind CSS entry:

```css
@import "tailwindcss";
@import "@open-tomato/components/styles.css";
```

That single import brings in, layer by layer:

| Layer                  | File                                   | Role                                                                                                 |
| ---------------------- | -------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| fonts                  | `fonts.css`                            | type faces, self-hosted woff2 files shipped in the package (OFL 1.1); swappable source               |
| **theme definition**   | `tokens.css` (exported as `theme.css`) | the DEFAULT theme — semantic variables (`--bg`, `--fg1`, `--primary`, …) for light + dark            |
| **component contract** | internal `@theme` mapping              | maps semantic variables onto Tailwind utilities (`bg-primary`, `text-fg1`, …) — stable across themes |
| source scan            | `@source`                              | points your Tailwind build at the package's JS so the components' classes are generated              |

```tsx
import { Button, Touchable } from '@open-tomato/components';

<Button variant="accent" size="lg">Run agent</Button>
```

Dark mode: set `data-theme="dark"` on the document element (default follows
`prefers-color-scheme`).

## Using the shells

`AppShell` (navigation + content chrome for signed-in surfaces) and `AuthShell`
(the auth flow frame, paired with the `src/pages/auth` set) are the templates
tier — most of their composition is reusable as-is, with app-specific layouts
tweaked at the consumer. The shells take their brand through slots
(`AuthShell`'s `brand`, and `AppShellBrand` for the sidebar's brand row), and
`Monogram` is the kit's neutral mark for them. In the topbar, `AppShellTitle`
is the page title and pushes the controls after it to the far end;
`AppShellSpacer` does the same anywhere else, such as the rail's foot. Demo
content in stories uses the placeholder brand "Acme".

`AppShell` fills the box its parent gives it and scrolls only its content,
so its parent must have a height. Mounted at the page root, size the root
boxes (`html, body, #root { height: 100%; }`) or pass `viewport`, which makes
the shell fill the viewport whatever its parent. Without either, the shell is
only as tall as its content and the rail stops where its nav ends.

## Theming (v1: theme definition via CSS)

Component layout is fixed; the **variables are the theme**. A theme has two
halves, and both switch the same way: redefine the variables after the
styles import.

- **Colors**: the semantic color variables (`--bg`, `--fg1`, `--primary`, …).
- **Fonts**: four role variables (`--font-display`, `--font-body`,
  `--font-mono`, `--font-accent`) say which family each role draws with, and
  `fonts.css` declares the faces those families load from.

### Colors

Override the semantic variables after the styles import:

```css
@import "tailwindcss";
@import "@open-tomato/components/styles.css";

/* your theme definition — same contract tokens.css fulfills */
:root, [data-theme='light'] {
  --primary: #7a1fa2;
  --accent: #1d4ed8;
}
[data-theme='dark'] {
  --primary: #c084fc;
}
```

The variable→utility mapping itself is part of the components — don't override
it.

### Fonts

**The contract.** Components never name a family. They ask for a ROLE,
through a Tailwind utility, an element default or a class, and the role
variable names the family:

| Role variable | Default family | Drawn by |
| --- | --- | --- |
| `--font-display` | Bricolage Grotesque | `h1`–`h4`, the `font-display` utility |
| `--font-body` | Manrope | `html`/`body` (so all text by default), `h5`, `h6`, the `font-body` utility |
| `--font-mono` | JetBrains Mono | `code`, `kbd`, `samp`, `pre`, `.mono`, `.eyebrow`, the `font-mono` utility |
| `--font-accent` | Sansita Swashed | the `.accent-text` class |

The components ask for weights 400 to 800 (`font-normal`, `font-medium`,
`font-semibold`, `font-bold`, `font-extrabold`), and the theme defines
`--fw-light` (300) too. A family without one of those weights still draws:
the browser picks the nearest weight it has, or fakes bold.

`fonts.css` (inside `styles.css`, and exported alone as
`@open-tomato/components/fonts.css`) declares the default faces: woff2
files shipped in the package under `dist/styles/fonts/`, which it reaches
by relative `url()`. A bundler (Vite, webpack, Next.js, …) resolves those
URLs and emits the files with your build. If you serve the CSS file
yourself, with no bundler, serve the `fonts/` folder next to it. The page
makes no request to a font service.

**What a page downloads.** A browser fetches a face only when text on the
page draws with it, and only the script subsets that text needs
(`unicode-range`). Measured in a Vite + Tailwind consumer: a page with a
heading, a paragraph and a code span fetched 3 files (the latin subset of
Bricolage Grotesque, Manrope and JetBrains Mono). With the three role
variables pointed at other families it fetched none. The default files
still sit in your build output, unused.

**Switch a role to a font the system already has.** Redefine the role
variable after the styles import, like a color:

```css
@import "tailwindcss";
@import "@open-tomato/components/styles.css";

:root {
  --font-body: Georgia, "Times New Roman", serif;
  --font-mono: ui-monospace, Menlo, Consolas, monospace;
}
```

**Switch a role to your own font files.** Declare the faces, then point
the role at them. Your files resolve against your CSS file, the same way
the package's resolve against its own:

```css
@import "tailwindcss";
@import "@open-tomato/components/styles.css";

@font-face {
  font-family: "Inter";
  font-style: normal;
  font-weight: 100 900; /* a variable font: one rule covers every weight */
  font-display: swap;
  src: url("./fonts/inter-latin.woff2") format("woff2");
}

:root {
  --font-body: "Inter", system-ui, sans-serif;
  --font-display: "Inter", system-ui, sans-serif;
}
```

A font from a hosted service works the same way: its CSS `@import` goes
first in your entry, before `@import "tailwindcss"`, because CSS only
honours `@import` at the top of a file. Then point the role at the
service's family name.

**Keep the default fonts, but load them from somewhere else.** Redeclare
the four families with `@font-face` rules of your own, under the same
family names, after the styles import. Of two faces that match, the
browser uses the one declared last, so it fetches your file and never
the package's. That holds only while your face covers what the page
draws: measured with a redeclared Manrope, the browser fetched only the
consumer's file, but when that file lacked the latin glyphs it fetched
the package's file too, for the missing characters. So give your rules
the weight range and the characters your text needs.

**Keep a role's fallback list.** Each default ends in system families
(`system-ui, sans-serif`, `Menlo, Consolas, monospace`). Keep a fallback
list on your override, so text still draws while a face loads
(`font-display: swap`) or if it fails to load.

**A theme package, later.** The color variables, the role variables and
the faces are together one theme definition. A future theming package
can ship all three as one import, so a consumer switches colors and fonts
with one line. Today the role variables live in `tokens.css` (the
`./theme.css` export) and the faces in `fonts.css`.

## Caching

Browser (TanStack Query wrapper with stale-while-revalidate defaults):

```tsx
import { QueryProvider, useCache } from '@open-tomato/components/cache';

// once at the root
<QueryProvider>{children}</QueryProvider>

// in components — staleTime 60s, gcTime 5min, no refetch-on-focus by default
const { data, isLoading, refetch } = useCache(['agents', id], () => fetchAgent(id));
```

Server (Redis cache-aside; `ioredis` is an optional peer dependency):

```ts
import Redis from 'ioredis';
import { createServerCache } from '@open-tomato/components/cache/server';

const cache = createServerCache(new Redis(process.env.REDIS_URL!));
const value = await cache.get('agents:1', 300, () => fetchAgent('1'));
await cache.invalidatePattern('agents:*');
```

The build fails if `ioredis` leaks into the browser bundle.

## Development

See [AGENTS.md](AGENTS.md) for conventions, the baseline-safe verification
order, and the agent personas/skills under `.claude/` that drive component
sessions.

```bash
bun install
bun run storybook          # component workbench
bun run test               # unit project (vitest): the cache module's tests
bun run test:full          # unit + the storybook smoke project (one test per story)
bun run test:render        # render tests for every story and component (bun test)
bun run test:visual        # screenshot regression vs this machine's baselines (local only)
bun run test:visual:update # (re)seed this machine's baselines
bun run check:stories      # every story renders error-free
bun run build              # library build (dist/ — JS, d.ts, styles/)
```

Visual baselines are per-machine and untracked — each machine regenerates
its own; they are never copied between machines, and the visual suite never
runs in GitHub Actions.

### Visual diff tolerance (to revisit)

Two parameters in `.storybook/test-runner.ts` decide when a screenshot
counts as changed. Both are provisional: revisit them in a later iteration,
for example once text renders the same way on every pass.

| Parameter | Value | Meaning |
|---|---|---|
| `PIXEL_COLOR_THRESHOLD` | `0.1` | A pixel counts as changed when its colour moves past this pixelmatch threshold, about 26 of 255 brightness levels. |
| `MAX_CHANGED_PIXELS` | `20` | A shot fails when more than this many pixels changed. |

Why: Chromium draws the edges of text slightly differently from one render to
the next, so at the previous near-exact setting (threshold `0.01`, one pixel
failing a shot) a few shots failed on every run, even at rest with one test
worker. Measured on the 658 shots: a flaky shot flagged at most 12 pixels at
`0.1`, and the smallest reviewed real change flagged 85.

The trade-off: a colour shift under about 26 brightness levels, or a change of
20 pixels or fewer, passes unseen.

Pixel-fidelity against design sources:

```bash
bun run build:storybook
node scripts/compare-design.mjs atoms-button--primary Button
```

Design reference pages live under [`design/`](design/README.md).

### CI

GitHub runs a minimal check on every pull request
(`.github/workflows/verify.yml`): the privacy and control-byte gates, lint,
types, the build, and the unit and render tests.

The visual suite stays local. It never runs in GitHub Actions, and its
baselines are never committed or uploaded: each machine keeps its own.

## License

[Apache-2.0](LICENSE) — permissive: use, modify, and redistribute freely,
commercial use included. What the license **does** require (§4) is
attribution: redistributions in source or bundled form must retain the
[LICENSE](LICENSE) and the notices in [NOTICE](NOTICE) — the credit to the
original author and the origin projects (Open Tomato and the design-extraction project).
Don't strip the credit; everything else is fair game.

The fonts in `dist/styles/fonts/` are not under Apache-2.0: Bricolage
Grotesque, Manrope, JetBrains Mono and Sansita Swashed are each under the
[SIL Open Font License 1.1](https://openfontlicense.org), and each
licence text ships beside the files (`OFL-*.txt`). [NOTICE](NOTICE)
lists them.

Copyright 2026 Marcos Tomatti.
