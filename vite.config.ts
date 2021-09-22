import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
//import WindiCSS from 'vite-plugin-windicss'
import { name } from './package.json'
//import peerDepsExternal from 'rollup-plugin-peer-deps-external'

// https://vitejs.dev/config/
export default defineConfig({
  optimizeDeps: {
    exclude: ['vue-demi']
  },
  plugins: [
    vue(),
    //WindiCSS(),
    //peerDepsExternal(
  ],
  build: {
    lib: {
      name,
      entry: 'src/main.ts'
    },
    rollupOptions: {
      external: [
        'svelte-jsoneditor', // todo: 无效
        'vue',
        'vue-demi',
      ],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          'svelte-jsoneditor': 'JSONEditor',
          'vue': 'Vue',
          'vue-demi': 'VueDemi',
        }
      },
    }
  }
})
