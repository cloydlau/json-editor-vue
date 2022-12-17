import { fileURLToPath } from 'node:url'
import { defineNuxtModule } from '@nuxt/kit'

export default defineNuxtModule({
  hooks: {
    'components:dirs': function (dirs) {
      dirs.push({
        path: fileURLToPath(new URL('./dist', import.meta.url)),
      })
    },
  },
})
