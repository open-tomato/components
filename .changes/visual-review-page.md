---
plan: visual-review-page
title: A static review page for failed visual shots
level: none
package: @open-tomato/components
---

- scripts: visual:review builds visual/review/index.html from the run's reports and diff images, sorted by the shape of each change
- scripts: test-visual.sh builds the page after a failing run
- docs: AGENTS.md names the page and its command
