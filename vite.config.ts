import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import { version } from 'vue'
import { parse } from 'semver'
import { PascalCasedName, name } from './package.json'

const { major, minor } = parse(version)

export default {
  optimizeDeps: {
    exclude: ['vue-demi'],
  },
  build: {
    lib: {
      name,
      entry: 'src/index.ts',
    },
    sourcemap: true,
    rollupOptions: {
      external: [
        'vanilla-jsoneditor',
        'vue',
        'vue-demi',
      ],
      output: {
        globals: {
          [name]: PascalCasedName,
          'vanilla-jsoneditor': 'JSONEditor',
          'vue': 'Vue',
          'vue-demi': 'VueDemi',
        },
      },
    },
  },
  plugins: [
    {
      name: 'html-transform',
      transformIndexHtml(html: string) {
        return html.replace(/\{\{NAME\}\}/, name).replace(/\{\{VUE_VERSION\}\}/g, String(major === 3 ? major : `${major}.${minor}`))
      },
    },
    vue(),
    dts({ rollupTypes: true }),
  ],
}
