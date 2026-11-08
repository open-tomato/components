---
plan: entity-stack-layout
title: Entity stack layout: the status mark on the title line, the meta line under it
level: minor
package: @open-tomato/components
---

- entity: layout="stack" keeps leading on the title line and starts the second line under it
- table: the entity-stack cell type renders that layout from a column config
- entity: mono sets the inline and stack title in the small mono face, for handles and model names
- entity: badge leads the second line of the stack, cell and title layouts; in stack, trailing stays on the title line as in inline
- variants: entityDot, entityMetaSeparator, entityMetaRef and entityMetaRefText draw the accent dot and a meta-line reference such as a branch
- stories: Session and the table item column use the stack layout with the branch glyph; the table shows owner tiles and mono avatar handles, the model rows a dot and a mono name, and the tool row leads with its badge
