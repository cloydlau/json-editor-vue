import { defineConfig } from 'rollup'
import typescript from 'rollup-plugin-typescript2'
import dts from 'rollup-plugin-dts'
import { terser } from 'rollup-plugin-terser'
import { name, module, main } from './package.json'

export default defineConfig([
  {
    plugins: [typescript(), terser()],
    external: ['vue-demi'],
    input: 'src/main.ts',
    output: [
      {
        format: 'esm',
        file: module,
        compact: true,
        sourcemap: true,
      },
      {
        format: 'umd',
        file: main,
        name,
        compact: true,
        sourcemap: true,
        exports: 'default',
        globals: {
          'vue-demi': 'VueDemi',
        },
      },
    ],
  },
  {
    input: 'src/main.ts',
    plugins: [dts()],
    output: {
      file: 'dist/index.d.ts',
      format: 'es',
    },
  },
])
