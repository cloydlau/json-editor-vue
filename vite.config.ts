import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
//import { createVuePlugin as vue } from 'vite-plugin-vue2'
import { name } from './package.json'

// https://vitejs.dev/config/
export default defineConfig({
  optimizeDeps: {
    exclude: ['vue-demi']
  },
  plugins: [
    vue(),
  ],
  build: {
    lib: {
      name,
      entry: 'src/index.ts'
    },
    rollupOptions: {
      external: [
        'vue',
        'vue-demi',
      ],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          'vue': 'Vue',
          'vue-demi': 'VueDemi',
        }
      },
    }
  }
})
