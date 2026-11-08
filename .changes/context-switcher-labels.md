---
plan: context-switcher-labels
title: ContextSwitcher takes its labels, limit and meta line from the caller
level: none
package: @open-tomato/components
---

- stories: ContextSwitcher's menu text comes from `recentLabel`, `seeAllLabel` and `newLabel` (defaults "Recent", "See all", "New"), and `limit` (default 5) says how many recent options it lists
- stories: an option's `members` count becomes a free `meta` line; `contextRowMembers` is `contextRowMeta`
- stories: the switcher's and the OptionCard story's wording is neutral, and the OptionCard story `Workspace` is `Context`
