import type { UserConfigExport, ConfigEnv } from 'vite'
import vue from '@vitejs/plugin-vue2'

// https://vitejs.dev/config/
export default ({ command }: ConfigEnv): UserConfigExport => {
  return {
    server: {
      port: 3002
    },
    optimizeDeps: {
      exclude: ['vue-demi']
    },
    plugins: [
      vue(),
      {
        name: 'html-transform',
        transformIndexHtml (html: string) {
          return html.replace(/{{.*}}/, `/demo/vue2/index.ts`)
        },
      },
    ],
  }
}
