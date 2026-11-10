---
plan: self-hosted-fonts
title: The type faces are served from the package
level: minor
package: @open-tomato/components
---

- fonts: `fonts.css` loads Bricolage Grotesque, Manrope, JetBrains Mono and Sansita Swashed from woff2 files shipped in the package, so a page makes no request to Google Fonts
- fonts: the `./fonts.css` export now reaches its files by relative URL in `dist/styles/fonts/`; a bundler resolves them, and a consumer serving the CSS raw serves that folder beside it
- fonts: fonts switch like colors, by redefining the role variables `--font-display`, `--font-body`, `--font-mono` and `--font-accent`; the README's Fonts section has the recipes
- fonts: the four OFL 1.1 licence texts ship beside the files, and NOTICE names them
- visual: the suite's Google Fonts pin and per-machine font cache are gone, since the fonts no longer come from the network
