import { defineConfig, type ViteUserConfig } from 'vitest/config';

// Two suites:
//  - "unit": jsdom tests (the cache module's hook + server cache tests)
//  - "storybook": one browser smoke test per story via @storybook/addon-vitest
const config: ViteUserConfig = defineConfig({
  test: {
    projects: ['./vitest.unit.config.ts', './vitest.storybook.config.ts'],
  },
});

export default config;
