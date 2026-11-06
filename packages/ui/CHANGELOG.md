# Changelog

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
