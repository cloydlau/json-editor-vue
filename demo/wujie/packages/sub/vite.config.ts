import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    open: true,
    port: 5500,
  },
  plugins: [vue()],
})
