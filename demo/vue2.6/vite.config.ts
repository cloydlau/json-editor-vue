import type { ConfigEnv, UserConfigExport } from 'vite'
import { createVuePlugin } from 'vite-plugin-vue2'
import ScriptSetup from 'unplugin-vue2-script-setup/vite'
import AutoImport from 'unplugin-auto-import/vite'

// https://vitejs.dev/config/
export default ({ command }: ConfigEnv): UserConfigExport => {
  return {
    optimizeDeps: {
      exclude: ['vue-demi'],
    },
    plugins: [
      AutoImport(),
      createVuePlugin(),
      ScriptSetup(),
      {
        name: 'html-transform',
        transformIndexHtml(html: string) {
          return html.replace(/\{\{VUE_VERSION\}\}/g, '2.6')
        },
      },
    ],
  }
}
