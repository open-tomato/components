---
plan: visual-both-themes
title: Compare both themes of a story before failing it
level: none
package: @open-tomato/components
---

- test-runner: a failed light shot no longer skips the dark one; the story fails once, naming every failed theme
- scripts: the review page reads every diff image named in one failure message
- docs: AGENTS.md says both themes are compared
