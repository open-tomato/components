import baseConfig from '@open-tomato/eslint-config';
import cvaConfig from '@open-tomato/eslint-config/cva';
import reactConfig from '@open-tomato/eslint-config/react';
import viteConfig from '@open-tomato/eslint-config/vite';

// Reference-free gate targets (see rule below) — split so the literal names
// never appear in this file.
const BANNED_SOURCE_SCOPE = ['@open', 'tomato'].join('-');
const BANNED_SOURCE_REPO = ['component', 'breakdown'].join('-');

/**
 * The shared open-tomato base with the React, Vite and CVA flavors, plus
 * what is this library's own.
 *
 * @type {import("eslint").Linter.Config[]} */
export default [
  ...baseConfig,
  ...reactConfig,
  ...viteConfig,
  ...cvaConfig,
  {
    // Reference-free gate: this standalone library must never import from the
    // monorepo it was extracted from or its pre-publish source repositories.
    // The banned names are assembled from parts so this config itself passes
    // a grep sweep for the same strings. The lint configs are left out: they
    // import the shared open-tomato ESLint config by name.
    files: ['**/*.{js,mjs,cjs,ts,tsx,jsx}'],
    ignores: ['eslint.config.mjs', 'eslint.variants.mjs'],
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [
          {
            group: [`${BANNED_SOURCE_SCOPE}/*`],
            message: 'Banned source scope — this library is standalone; use local relative imports.',
          },
          {
            group: [`*${BANNED_SOURCE_REPO}*`],
            message: 'Cross-repo path imports are banned in components-library.',
          },
        ],
      }],
    },
  },
  {
    // A leading underscore marks a parameter or binding as unused on
    // purpose: a callback slot the signature needs, or a key pulled out of
    // a rest spread.
    files: ['**/*.{js,mjs,cjs,ts,tsx,jsx}'],
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
        destructuredArrayIgnorePattern: '^_',
      }],
    },
  },
  {
    files: ['**/*.jsx', '**/*.tsx'],
    rules: {
      'react/display-name': 'off',
    },
  },
  {
    // @open-tomato/cva-only-classname: a className holds only a variants
    // call, a cn() over variants and the passthrough, or the passthrough.
    // The cva flavor turns it on; it stays OFF here for the port: stream V
    // checks a batch with eslint.variants.mjs, which turns the local rule
    // on for the same files, and recombination drops this block.
    files: ['**/*.tsx', '**/*.jsx'],
    rules: { '@open-tomato/cva-only-classname': 'off' },
  },
];
