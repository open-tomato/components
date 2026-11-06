---
plan: components-port
title: The first release of the component library
level: minor
---
- library: the variant-first React component library, ported from its source repository and held to the source's screenshots through every step of the port
- library: atoms, molecules, organisms and templates, with CVA variants, typed props and one story per state
- cache: the caching module, with a browser entry (TanStack Query) and a server entry (Redis), each on its own subpath export
- stories: the stories use neutral sample words and a neutral brand, with the source's words and brand removed
- tests: render tests for every story, unit tests for the cache, and a local visual suite that keeps its baselines on each machine
- ci: a minimal GitHub check on every pull request (privacy, lint, types, build, unit and render tests); the visual suite stays local
