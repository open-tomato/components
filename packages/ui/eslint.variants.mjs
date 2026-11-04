import config from './eslint.config.mjs';

/**
 * The package lint config with `ot/cva-only-classname` turned on, for
 * stream V's batch check during the port:
 *
 *   bunx eslint -c eslint.variants.mjs src/atoms/Button src/atoms/Badge
 *
 * Same files and exclusions as the rule's block in `eslint.config.mjs`.
 * Removed at recombination, when that block turns the rule on itself.
 *
 * @type {import("eslint").Linter.Config[]} */
export default [
  ...config,
  {
    files: ['src/**/*.tsx'],
    ignores: ['src/templates/**', 'src/stories/**', '**/*.stories.tsx', '**/*.test.tsx'],
    rules: { 'ot/cva-only-classname': 'error' },
  },
];
