import otPlugin from '../../tools/eslint-rules/cva-only-classname.mjs';

import config from './eslint.config.mjs';

/**
 * The package lint config with the local `ot/cva-only-classname` turned on,
 * for stream V's batch check during the port:
 *
 *   bunx eslint -c eslint.variants.mjs src/atoms/Button src/atoms/Badge
 *
 * This uses the local rule in `tools/eslint-rules/`, not
 * `@open-tomato/cva-only-classname` from the cva flavor: the local rule
 * also accepts a call to any name imported from a `.variants` module
 * (`touchable(...)`), and most variants exports here carry no `Variants`
 * suffix, so the shared rule refuses over 400 valid call sites. Removed at
 * recombination, when the shared rule accepts those imports and
 * `eslint.config.mjs` drops the block that turns it off.
 *
 * @type {import("eslint").Linter.Config[]} */
export default [
  ...config,
  {
    files: ['src/**/*.tsx'],
    ignores: ['src/templates/**', 'src/pages/**', 'src/stories/**', '**/*.stories.tsx', '**/*.test.tsx'],
    plugins: { ot: otPlugin },
    rules: { 'ot/cva-only-classname': 'error' },
  },
];
