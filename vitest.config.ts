import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vitest/config';

// Separate from vite.config.ts on purpose: that file's dev-server settings (HMR/watch)
// are tuned for the agent editing environment and shouldn't be touched by test tooling.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./frontend/src/test/setup.ts'],
    // 'forks' (the default) fails to spawn workers when the repo path contains spaces,
    // which this one does (Windows). 'threads' avoids the child-process spawn entirely.
    pool: 'threads',
  },
});
