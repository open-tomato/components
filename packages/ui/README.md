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
│                   # FormKit, ProfileMenu, WorkspaceSwitcher, …
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
| `@open-tomato/components/fonts.css` | the type-face layer alone |
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
| fonts                  | `fonts.css`                            | type faces (Google Fonts today; swappable source)                                                    |
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
(`AuthShell`'s `brand`, the sidebar's brand row), and `Monogram` is the kit's
neutral mark for them. Demo content in stories uses the placeholder brand
"Acme".

## Theming (v1: theme definition via CSS)

Component layout is fixed; the **token variables are the theme**. Override the
semantic variables after the styles import:

```css
@import "tailwindcss";
@import "components-library/styles.css";

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
bun run test               # unit (cache) + smoke layer (one test per story)
bun run test:visual        # screenshot regression vs this machine's baselines
bun run test:visual:update # (re)seed this machine's baselines
bun run check:stories      # every story renders error-free
bun run build              # library build (dist/ — JS, d.ts, styles/)
```

Visual baselines are per-environment and untracked — each machine (and CI)
regenerates its own; they are never copied between environments.

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

Copyright 2026 Marcos Tomatti.
