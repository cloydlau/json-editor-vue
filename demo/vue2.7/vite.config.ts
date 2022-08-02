import type { ConfigEnv, UserConfigExport } from 'vite'
import vue from '@vitejs/plugin-vue2'

// https://vitejs.dev/config/
export default ({ command }: ConfigEnv): UserConfigExport => {
  return {
    optimizeDeps: {
      exclude: ['vue-demi'],
    },
    plugins: [
      vue(),
      {
        name: 'html-transform',
        transformIndexHtml(html: string) {
          return html.replace(/\{\{VUE_VERSION\}\}/g, '2.7')
        },
      },
    ],
  }
}
