---
plan: test-visual-node-check
title: Stop the visual suite early when node is not on PATH
level: none
package: @open-tomato/components
---

- scripts: test-visual.sh exits 1 naming the cause and the fix when node is missing
- docs: AGENTS.md says the visual suite needs node on PATH
