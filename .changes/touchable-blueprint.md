---
plan: touchable-blueprint
title: A particles level and extendVariants for shared variant blueprints
level: minor
package: @open-tomato/components
---

- lib: `extendVariants(baseConfig, config)` builds a component's variants over a blueprint, with cva's config shape, call signature and `VariantProps`; on a key clash the extension's options and default win
- particles: the touchable trait moved to `src/particles/touchable` as the first blueprint, exported as `touchableVariants` with its `touchableConfig`
- Touchable: the `touchable` export still resolves, as an alias of `touchableVariants`
