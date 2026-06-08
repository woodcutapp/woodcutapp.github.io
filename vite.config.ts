import babel from '@rolldown/plugin-babel'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import wasm from 'vite-plugin-wasm'

import { fileURLToPath } from 'url'

export default defineConfig(({ mode }) => ({
  build: {
    sourcemap: mode === 'development',
  },
  envDir: 'env',
  logLevel: 'error',
  plugins: [
    wasm(),
    tanstackRouter({ autoCodeSplitting: true }),
    babel({
      presets: [reactCompilerPreset()],
    }),
    react(),
  ],
  resolve: {
    alias: [
      {
        find: '@',
        replacement: fileURLToPath(new URL('./src', import.meta.url)),
      },
    ],
  },
  server: { port: 4200 },
}))
