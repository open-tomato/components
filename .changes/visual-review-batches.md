---
plan: visual-review-batches
title: Review failed visual shots in batches, one per component
level: none
package: @open-tomato/components
---

- scripts: the review page shows one batch per component, each with a green or red verdict saved in the browser for that run
- scripts: the page writes the accept command for the green batches and the list of red ones
- scripts: visual:accept moves the green batches' failed baselines to a backup folder, so the next run writes them fresh
- docs: AGENTS.md names the batches and the accept command
