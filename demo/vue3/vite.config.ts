import type { ConfigEnv, UserConfigExport } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import { name } from '../../package.json'

// https://vitejs.dev/config/
export default ({ command }: ConfigEnv): UserConfigExport => {
  return {
    optimizeDeps: {
      exclude: ['vue-demi'],
    },
    plugins: [
      AutoImport({
        // targets to transform
        include: [
          /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
          /\.vue$/, /\.vue\?vue/, // .vue
          /\.md$/, // .md
        ],
        // global imports to register
        imports: [
          // presets
          'vue',
        ],
      }),
      vue(),
      {
        name: 'html-transform',
        transformIndexHtml(html: string) {
          return html.replace(/\{\{NAME\}\}/, name).replace(/\{\{VUE_VERSION\}\}/g, '3')
        },
      },
    ],
  }
}
