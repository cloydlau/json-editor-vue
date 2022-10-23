import type { ConfigEnv, UserConfigExport } from 'vite'
import { createVuePlugin } from 'vite-plugin-vue2'
import ScriptSetup from 'unplugin-vue2-script-setup/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { name } from '../../package.json'

// https://vitejs.dev/config/
export default ({ command }: ConfigEnv): UserConfigExport => {
  return {
    optimizeDeps: {
      exclude: ['vue-demi'],
    },
    plugins: [
      createVuePlugin(),
      ScriptSetup(),
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
          '@vue/composition-api',
          {
            vue: [
              ['default', 'Vue'],
            ],
          },
        ],
      }),
      {
        name: 'html-transform',
        transformIndexHtml(html: string) {
          return html.replace(/\{\{NAME\}\}/, name).replace(/\{\{VUE_VERSION\}\}/g, '2.6')
        },
      },
    ],
  }
}
