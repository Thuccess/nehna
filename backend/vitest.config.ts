import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    testTimeout: 60_000,
    hookTimeout: 120_000,
    include: ['tests/**/*.test.ts'],
    setupFiles: ['./tests/vitest.setup.ts'],
    clearMocks: false,
    restoreMocks: false,
    mockReset: false,
    isolate: false,
    fileParallelism: false,
    pool: 'threads',
    poolOptions: { threads: { singleThread: true } },
  },
});
