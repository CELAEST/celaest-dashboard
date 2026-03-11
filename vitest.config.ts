import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    // Exclude Playwright e2e tests — they require a running server and browser
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      'e2e/**',
    ],
  },
})
