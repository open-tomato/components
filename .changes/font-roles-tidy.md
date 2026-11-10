---
plan: font-roles-tidy
title: One font list per role, and a tighter visual tolerance
level: patch
package: @open-tomato/components
---

- fonts: the font lists live only in the theme definition; the component contract registers the `font-display`, `font-body` and `font-mono` utilities by reference, with a generic family as fallback
- fonts: the display font list drops "Sansita", a family nothing declares
- visual: a shot now fails when more than 1 pixel moves past colour threshold 0.01, down from 20 pixels past 0.1, since text draws the same on every pass
