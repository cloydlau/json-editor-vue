import type { ConfigEnv, UserConfigExport } from 'vite'
import dts from 'vite-plugin-dts'
import { PascalCasedName, name } from './package.json'

// https://vitejs.dev/config/
export default ({ command }: ConfigEnv): UserConfigExport => {
  return {
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
    plugins: [dts()],
  }
}
