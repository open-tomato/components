import baseConfig from '@open-tomato/eslint-config';

/**
 * Root leaf: lints tools/ and root-level files over the shared open-tomato
 * base. Each package under packages/* carries its own config.
 *
 * @type {import("eslint").Linter.Config[]} */
export default [
  {
    ignores: [
      'packages/**',
      // Agent-harness prose and planning folders are not lint targets.
      '.plans/**',
      '.specs/**',
    ],
  },
  ...baseConfig,
];
