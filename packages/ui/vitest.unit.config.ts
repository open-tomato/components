import { defineConfig, type ViteUserConfig } from 'vitest/config';

const config: ViteUserConfig = defineConfig({
  test: {
    name: 'unit',
    environment: 'jsdom',
    include: ['src/**/__tests__/**/*.test.{ts,tsx}'],
  },
});

export default config;
