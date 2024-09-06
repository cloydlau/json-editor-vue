/// <reference types="vitest" />

import Vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    Vue(),
  ],
  test: {
    environment: 'happy-dom',
  },
})
