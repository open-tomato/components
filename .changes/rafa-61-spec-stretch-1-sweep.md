---
plan: rafa-61-spec-stretch-1-sweep
title: Stretch 1 sweep — fresh-worktree green, one tsconfig, three atom fixes
level: patch
---

- Button: `asChild` now renders its single child element with the button classes, keeping leading and trailing icons inside it instead of throwing.
- Droppable: an `accept` contract with only `ext` or only `mime` set now rejects files that match neither list.
- Sortable: dropping onto an item now places the dragged item at that item, and moving from an item onto a gap retargets the drop to the end of the list.
