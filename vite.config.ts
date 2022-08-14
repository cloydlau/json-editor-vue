import type { ConfigEnv, UserConfigExport } from 'vite'
import { name } from './package.json'

// https://vitejs.dev/config/
export default ({ command }: ConfigEnv): UserConfigExport => {
  return {
    build: {
      lib: {
        name,
        entry: 'src/index.ts',
      },
      rollupOptions: {
        external: [
          'vanilla-jsoneditor',
          'vue',
          'vue-demi',
        ],
        output: {
          // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
          globals: {
            'vanilla-jsoneditor': 'JSONEditor',
            'vue': 'Vue',
            'vue-demi': 'VueDemi',
          },
        },
      },
    },
  }
}
