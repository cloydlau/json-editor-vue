import type { ConfigEnv, UserConfigExport } from 'vite'
import dts from 'vite-plugin-dts'
import { name } from './package.json'
import { name as globalVariableName } from './src/Component'

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
            [name]: globalVariableName,
          },
        },
      },
    },
    plugins: [dts()],
  }
}
