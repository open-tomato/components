# Changelog

## 0.2.0 — 2026-11-10, AppShell exports the brand row, page title and spacer its story composes; Centre the AppShell page title in the topbar; AppShell states its height contract and can fill the viewport; A particles level and extendVariants for shared variant blueprints; Entity stack layout: the status mark on the title line, the meta line under it; ContextSwitcher ships as an organism; The type faces are served from the package; One font list per role, and a tighter visual tolerance
<!-- rafa:fragments appshell-brand-title react-dedupe appshell-title-margin story-fixture-guard appshell-height-contract test-visual-node-check touchable-blueprint visual-review-page readme-test-scripts context-switcher-labels visual-review-batches entity-stack-layout context-switcher-organism self-hosted-fonts visual-both-themes font-roles-tidy -->

- AppShellBrand: the rail brand row, mark and wordmark, collapse-aware
- AppShellTitle: the topbar page title as h1, pushing the controls after it to the far end
- AppShellSpacer: takes a zone free space, such as pushing blocks to the rail foot
- appshell: AppShellTitle clears the base h1 margin, so the topbar centres it
- AppShell: viewport fills the viewport whatever the parent; default still fills the parent box
- docs: AppShell TSDoc, story and README say the parent must have a height
- lib: `extendVariants(baseConfig, config)` builds a component's variants over a blueprint, with cva's config shape, call signature and `VariantProps`; on a key clash the extension's options and default win
- particles: the touchable trait moved to `src/particles/touchable` as the first blueprint, exported as `touchableVariants` with its `touchableConfig`
- Touchable: the `touchable` export still resolves, as an alias of `touchableVariants`
- entity: layout="stack" keeps leading on the title line and starts the second line under it
- entity: mono sets the inline and stack title in the small mono face, for handles and model names
- entity: badge leads the second line of the stack, cell and title layouts; in stack, trailing stays on the title line as in inline
- table: the entity-stack cell type renders that layout from a column config
- variants: entityDot, entityMetaSeparator, entityMetaRef and entityMetaRefText draw the accent dot and a meta-line reference such as a branch
- stories: Session and the table item column use the stack layout with the branch glyph; the table shows owner tiles and mono avatar handles, the model rows a dot and a mono name, and the tool row leads with its badge
- stories: the AppShell fixture imports the switcher from the organisms, and the fixture guard has no excuse left
- ContextSwitcher: exported from the package entry as an organism, with its props, option type and variants, and stories of its own
- fonts: `fonts.css` loads Bricolage Grotesque, Manrope, JetBrains Mono and Sansita Swashed from woff2 files shipped in the package, so a page makes no request to Google Fonts
- fonts: the `./fonts.css` export now reaches its files by relative URL in `dist/styles/fonts/`; a bundler resolves them, and a consumer serving the CSS raw serves that folder beside it
- fonts: fonts switch like colors, by redefining the role variables `--font-display`, `--font-body`, `--font-mono` and `--font-accent`; the README's Fonts section has the recipes
- fonts: the four OFL 1.1 licence texts ship beside the files, and NOTICE names them
- fonts: the font lists live only in the theme definition; the component contract registers the `font-display`, `font-body` and `font-mono` utilities by reference, with a generic family as fallback
- fonts: the display font list drops "Sansita", a family nothing declares
- visual: the suite's Google Fonts pin and per-machine font cache are gone, since the fonts no longer come from the network
- visual: a shot now fails when more than 1 pixel moves past colour threshold 0.01, down from 20 pixels past 0.1, since text draws the same on every pass

## 0.1.2 — 2026-11-07, Publish from CI with npm trusted publishing
<!-- rafa:fragments release-publish-ci -->

- release: published from CI with npm provenance
- package: the manifest names its registry and its folder in the repository

## 0.1.1 — 2026-11-06, Stretch 1 sweep — fresh-worktree green, one tsconfig, three atom fixes; Stretch 1 sweep — neutral story fixtures and the Toolbar empty-state illustration
<!-- rafa:fragments repo-leftovers rafa-61-spec-stretch-1-sweep rafa-62-spec-stretch-1-sweep -->

- Button: `asChild` now renders its single child element with the button classes, keeping leading and trailing icons inside it instead of throwing.
- Droppable: an `accept` contract with only `ext` or only `mime` set now rejects files that match neither list.
- Sortable: dropping onto an item now places the dragged item at that item, and moving from an item onto a gap retargets the drop to the end of the list.
- stories: The Toolbar stories' empty search state shows its placeholder illustration again, and `ArtPlaceholder` is now a shared story fixture.

## 0.1.0 — 2026-11-06, The first release of the component library
<!-- rafa:fragments components-port -->

- library: the variant-first React component library, ported from its source repository and held to the source's screenshots through every step of the port
- library: atoms, molecules, organisms and templates, with CVA variants, typed props and one story per state
- cache: the caching module, with a browser entry (TanStack Query) and a server entry (Redis), each on its own subpath export
- stories: the stories use neutral sample words and a neutral brand, with the source's words and brand removed
- tests: render tests for every story, unit tests for the cache, and a local visual suite that keeps its baselines on each machine
- ci: a minimal GitHub check on every pull request (privacy, lint, types, build, unit and render tests); the visual suite stays local
