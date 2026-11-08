---
plan: bun-cache-integration
title: Seed the bun cache on integration so pull requests skip the release download
level: none
---

- ci: verify runs on push to integration, and a bun-cache job saves setup-bun's cache under that ref
