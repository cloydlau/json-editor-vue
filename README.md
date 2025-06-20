<h1 align="center">
  <a href="https://npmjs.com/package/json-editor-vue" target="_blank" rel="noopener noreferrer">
    JSON Editor Vue <sup><img alt="version" src="https://img.shields.io/npm/v/json-editor-vue.svg?style=flat-square&color=white&label="></sup>
  </a>
</h1>

<p align="center">
  Vue and Nuxt 2/3 isomorphic JSON editor, viewer, formatter and validator.
  <br>
  English | <a href="./docs/README.zh-CN.md">简体中文</a>
</p>

<p align="center">
  <a href="https://npmjs.com/package/json-editor-vue"><img alt="npm version" src="https://img.shields.io/npm/v/json-editor-vue.svg?labelColor=cb3837&color=1C404E"></a>
  <a href="https://jsr.io/@cloydlau"><img alt="JSR Scope" src="https://jsr.io/badges/@cloydlau"></a>
  <br>
  <a href="https://cloydlau.github.io/playground/json-editor-vue/"><img alt="playground" src="https://img.shields.io/badge/Playground-blue?color=9BE4E0&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxZW0iIGhlaWdodD0iMWVtIiB2aWV3Qm94PSIwIDAgMjQgMjQiPjxnIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzNiNDAzZiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBzdHJva2Utd2lkdGg9IjIiPjxwYXRoIGQ9Ik0xMiA1aDMuNWE1IDUgMCAwIDEgMCAxMEgxMGwtNC4wMTUgNC4yMjdhMi4zIDIuMyAwIDAgMS0zLjkyMy0yLjAzNWwxLjYzNC04LjE3M0E1IDUgMCAwIDEgOC42IDV6Ii8+PHBhdGggZD0ibTE0IDE1bDQuMDcgNC4yODRhMi4zIDIuMyAwIDAgMCAzLjkyNS0yLjAyM2wtMS42LTguMjMyTTggOXYybS0xLTFoMm01IDBoMiIvPjwvZz48L3N2Zz4="></a>
  <a href="https://deepwiki.com/cloydlau/json-editor-vue"><img src="https://img.shields.io/badge/DeepWiki-cloydlau%2Fjson--editor--vue-blue.svg?logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAyCAYAAAAnWDnqAAAAAXNSR0IArs4c6QAAA05JREFUaEPtmUtyEzEQhtWTQyQLHNak2AB7ZnyXZMEjXMGeK/AIi+QuHrMnbChYY7MIh8g01fJoopFb0uhhEqqcbWTp06/uv1saEDv4O3n3dV60RfP947Mm9/SQc0ICFQgzfc4CYZoTPAswgSJCCUJUnAAoRHOAUOcATwbmVLWdGoH//PB8mnKqScAhsD0kYP3j/Yt5LPQe2KvcXmGvRHcDnpxfL2zOYJ1mFwrryWTz0advv1Ut4CJgf5uhDuDj5eUcAUoahrdY/56ebRWeraTjMt/00Sh3UDtjgHtQNHwcRGOC98BJEAEymycmYcWwOprTgcB6VZ5JK5TAJ+fXGLBm3FDAmn6oPPjR4rKCAoJCal2eAiQp2x0vxTPB3ALO2CRkwmDy5WohzBDwSEFKRwPbknEggCPB/imwrycgxX2NzoMCHhPkDwqYMr9tRcP5qNrMZHkVnOjRMWwLCcr8ohBVb1OMjxLwGCvjTikrsBOiA6fNyCrm8V1rP93iVPpwaE+gO0SsWmPiXB+jikdf6SizrT5qKasx5j8ABbHpFTx+vFXp9EnYQmLx02h1QTTrl6eDqxLnGjporxl3NL3agEvXdT0WmEost648sQOYAeJS9Q7bfUVoMGnjo4AZdUMQku50McDcMWcBPvr0SzbTAFDfvJqwLzgxwATnCgnp4wDl6Aa+Ax283gghmj+vj7feE2KBBRMW3FzOpLOADl0Isb5587h/U4gGvkt5v60Z1VLG8BhYjbzRwyQZemwAd6cCR5/XFWLYZRIMpX39AR0tjaGGiGzLVyhse5C9RKC6ai42ppWPKiBagOvaYk8lO7DajerabOZP46Lby5wKjw1HCRx7p9sVMOWGzb/vA1hwiWc6jm3MvQDTogQkiqIhJV0nBQBTU+3okKCFDy9WwferkHjtxib7t3xIUQtHxnIwtx4mpg26/HfwVNVDb4oI9RHmx5WGelRVlrtiw43zboCLaxv46AZeB3IlTkwouebTr1y2NjSpHz68WNFjHvupy3q8TFn3Hos2IAk4Ju5dCo8B3wP7VPr/FGaKiG+T+v+TQqIrOqMTL1VdWV1DdmcbO8KXBz6esmYWYKPwDL5b5FA1a0hwapHiom0r/cKaoqr+27/XcrS5UwSMbQAAAABJRU5ErkJggg==" alt="DeepWiki"></a>
  <br>
  <a href="https://www.npmjs.com/package/json-editor-vue?activeTab=versions"><img alt="created at" src="https://img.shields.io/github/created-at/cloydlau/json-editor-vue?&color=1C404E&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxZW0iIGhlaWdodD0iMWVtIiB2aWV3Qm94PSIwIDAgNDggNDgiPjxnIGZpbGw9Im5vbmUiPjxwYXRoIGQ9Ik04IDQwaDMyVjI0SDh6Ii8+PHBhdGggc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS13aWR0aD0iNCIgZD0iTTQwIDQwSDhtMzIgMEg0aDRtMzIgMGg0bS00IDBWMjRIOHYxNiIvPjxwYXRoIHN0cm9rZT0iI2ZmZmZmZiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBzdHJva2Utd2lkdGg9IjQiIGQ9Im00MCAzNGwtNC0ybC00IDJsLTQtMmwtNCAybC00LTJsLTQgMmwtNC0ybC00IDJtMjQtMTB2LTltLTggOXYtOW0tOCA5di05bTE2LTVWOG0tOCAyVjhtLTggMlY4TTggMjR2MTZtMzItMTZ2MTYiLz48L2c+PC9zdmc+"></a>
  <a href="https://github.com/cloydlau/json-editor-vue/actions/workflows/ci.yml"><img alt="build status" src="https://github.com/cloydlau/json-editor-vue/actions/workflows/ci.yml/badge.svg?branch=main"></a>
  <a href="https://app.fossa.com/projects/git%2Bgithub.com%2Fcloydlau%2Fjson-editor-vue?ref=badge_shield&issueType=license" alt="FOSSA Status"><img src="https://app.fossa.com/api/projects/git%2Bgithub.com%2Fcloydlau%2Fjson-editor-vue.svg?type=shield&issueType=license"/></a>
  <a href="https://bundlephobia.com/package/json-editor-vue"><img alt="minzipped size" src="https://img.shields.io/bundlephobia/minzip/json-editor-vue"></a>
  <br>
  <a href="https://github.com/antfu/eslint-config"><img alt="code style" src="https://antfu.me/badge-code-style.svg"></a>
  <a href="https://conventionalcommits.org"><img alt="conventional commits" src="https://img.shields.io/badge/commits-Conventional-FE5196.svg?logo=conventionalcommits"></a>
  <a href="https://semantic-release.gitbook.io"><img alt="semantic release" src="https://img.shields.io/badge/release-semantic-e10079?logo=semantic-release"></a>
  <a href="https://arethetypeswrong.github.io/?p=json-editor-vue"><img alt="attw" src="https://img.shields.io/badge/are_the_types_wrong%3F-analyze-3178C6?logo=typescript&logoColor=white"></a>
  <a href="https://pr.new/https://github.com/cloydlau/json-editor-vue"><img src="https://developer.stackblitz.com/img/start_pr_dark_small.svg" alt="Start new PR in StackBlitz Codeflow"></a>
</p>

<img width="48.5%" src="https://raw.githubusercontent.com/cloydlau/json-editor-vue/main/docs/text-mode.png" alt="text mode">&nbsp;<img width="48.5%" src="https://raw.githubusercontent.com/cloydlau/json-editor-vue/main/docs/tree-mode.png" alt="table mode">

<br>

## Features

- 🚀 Performant
  - Handle large JSON documents up to 512 MB
  - Deserialize with [destr](https://github.com/unjs/destr) by default, up to 35.96x faster than `JSON.parse`
- 💪 Powerful
  - View, edit, format, validate, compact, sort, query, filter, transform, repair, highlight JSON
  - 7 primitive data types including [BigInt](#bigint) and `Symbol`
  - 3 edit modes: text mode & tree mode & table mode
  - 2 themes: light theme & dark theme
  - 2-way binding: [parsed or stringified JSON](#parsed-json-vs-stringified-json)
- 🤸 Flexible
  - Vue 2.6/2.7/3 isomorphic
  - Support SSR, Nuxt 2/3 isomorphic
  - Support Vite, Vue CLI, webpack, CDN...
  - Support microfrontends
  - Support PC & mobile devices
  - Local registration & configuration, or global registration & configuration (Powered by [vue-global-config](https://github.com/cloydlau/vue-global-config))

<br>

## Cases

<table>
  <tr align="center">
    <td>
      <a href="https://github.com/nuxt/devtools">
        <img height="30" valign="middle" src="./docs/cases/nuxt.svg" />
      </a>
    </td>
    <td>
      <a href="https://github.com/google/litmus">
        <img height="40" valign="middle" src="./docs/cases/google.svg" />
      </a>
    </td>
    <td>
      <a href="https://github.com/mozilla-ai/lumigator">
        <img height="35" valign="middle" src="./docs/cases/mozilla.svg" />
      </a>
    </td>
  </tr>
  <tr align="center">
    <td>
      <a href="https://github.com/TencentBlueKing/blueking-paas">
        <img height="20" valign="middle" src="./docs/cases/tencent.png" />
      </a>
    </td>
    <td>
      <a href="https://github.com/MRC-Epid-it24/intake24">
        <img height="30" valign="middle" src="./docs/cases/mrc_tu_cambridge.png" />
      </a>
    </td>
    <td>
      <a href="https://github.com/RockChinQ/LangBot"><img height="35" valign="middle" src="./docs/cases/langbot.png" /></a>
      <a href="https://github.com/RockChinQ/LangBot"> LangBot</a>
    </td>
  </tr>
  <tr align="center">
    <td>
      <a href="https://github.com/mealie-recipes/mealie"><img height="30" valign="middle" src="./docs/cases/mealie.png" /></a>
      <a href="https://github.com/mealie-recipes/mealie"> Mealie</a>
    </td>
  </tr>
</table>

> [!Important]
>
> json-editor-vue had surpassed [2 million downloads](https://npm.chart.dev/json-editor-vue): <a href="https://npm-stat.com/charts.html?package=json-editor-vue&from=2020-07-15"><img alt="npm downloads" src="https://img.shields.io/npm/dm/json-editor-vue?label=npm&color=cb3837"></a> <a href="https://www.jsdelivr.com/package/npm/json-editor-vue"><img alt="jsDelivr downloads" src="https://data.jsdelivr.com/v1/package/npm/json-editor-vue/badge?period=all&style=rounded"></a>
>
> While having a extremely dismal number of Stars: <a href="https://github.com/cloydlau/json-editor-vue/stargazers"><img alt="GitHub Stars" src="https://img.shields.io/github/stars/cloydlau/json-editor-vue?color=9f7be1&logo=github&style=flat"></a>
>
> Please consider [starring ⭐](https://github.com/cloydlau/json-editor-vue) or [donating](#donate) to support our ongoing maintenance if it helps: <a href="https://github.com/cloydlau/json-editor-vue/issues?q=is%3Aissue+is%3Aclosed"><img alt="GitHub issues closed" src="https://img.shields.io/github/issues-closed/cloydlau/json-editor-vue?logo=github"></a>

<br>

## Install

### Vue 3

```shell
npm i json-editor-vue
```

#### Local Registration

```vue
<script setup>
import JsonEditorVue from 'json-editor-vue'

const value = ref()
</script>

<template>
  <JsonEditorVue
    v-model="value"
    v-bind="{/* local props & attrs */}"
  />
</template>
```

#### Global Registration

```ts
import JsonEditorVue from 'json-editor-vue'
import { createApp } from 'vue'

createApp()
  .use(JsonEditorVue, {
    // global props & attrs (one-way data flow)
  })
  .mount('#app')
```

#### CDN + ESM

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
  </head>

  <body>
    <div id="app">
      <json-editor-vue v-model="value"></json-editor-vue>
    </div>

    <script type="importmap">
      {
        "imports": {
          "vue": "https://cdn.jsdelivr.net/npm/vue/dist/vue.esm-browser.prod.js",
          "vue-demi": "https://cdn.jsdelivr.net/npm/vue-demi/lib/v3/index.mjs",
          "vanilla-jsoneditor": "https://cdn.jsdelivr.net/npm/vanilla-jsoneditor",
          "json-editor-vue": "https://cdn.jsdelivr.net/npm/json-editor-vue@0.18/dist/json-editor-vue.mjs"
        }
      }
    </script>
    <script type="module">
      import { createApp, ref } from 'vue'
      import JsonEditorVue from 'json-editor-vue'

      createApp({
        setup: () => ({
          value: ref(),
        }),
      })
        .use(JsonEditorVue)
        .mount('#app')
    </script>
  </body>
</html>
```

#### CDN + IIFE

> [!Warning]
>
> Not yet supported because vanilla-jsoneditor does not export IIFE or UMD,
>
> please leave a message [here](https://github.com/josdejong/svelte-jsoneditor/discussions/196) if you need it.

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
  </head>

  <body>
    <div id="app">
      <json-editor-vue v-model="value"></json-editor-vue>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/vue"></script>
    <script src="https://cdn.jsdelivr.net/npm/vue-demi"></script>
    <!-- TODO -->
    <script src="./vanilla-jsoneditor.umd.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/json-editor-vue@0.18"></script>
    <script>
      const { createApp, ref } = Vue

      createApp({
        setup: () => ({
          value: ref(),
        }),
      })
        .use(JsonEditorVue)
        .mount('#app')
    </script>
  </body>
</html>
```

<br>

### Vue 2.7

```shell
npm i json-editor-vue
```

#### Local Registration

```vue
<script setup>
import JsonEditorVue from 'json-editor-vue'

const value = ref()
</script>

<template>
  <JsonEditorVue
    v-model="value"
    v-bind="{/* local props & attrs */}"
  />
</template>
```

#### Global Registration

```ts
import JsonEditorVue from 'json-editor-vue'
import Vue from 'vue'

Vue.use(JsonEditorVue, {
  // global props & attrs (one-way data flow)
})
```

#### CDN + ESM

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
  </head>

  <body>
    <div id="app">
      <json-editor-vue v-model="value"></json-editor-vue>
    </div>

    <script type="importmap">
      {
        "imports": {
          "vue": "https://cdn.jsdelivr.net/npm/vue@2/dist/vue.esm.browser.min.js",
          "vue-demi": "https://cdn.jsdelivr.net/npm/vue-demi/lib/v2.7/index.mjs",
          "vanilla-jsoneditor": "https://cdn.jsdelivr.net/npm/vanilla-jsoneditor",
          "json-editor-vue": "https://cdn.jsdelivr.net/npm/json-editor-vue@0.18/dist/json-editor-vue.mjs"
        }
      }
    </script>
    <script type="module">
      import Vue from 'vue'
      import JsonEditorVue from 'json-editor-vue'

      new Vue({
        components: { JsonEditorVue },
        data() {
          return {
            value: undefined,
          }
        },
      }).$mount('#app')
    </script>
  </body>
</html>
```

#### CDN + IIFE

> [!Warning]
>
> Not yet supported because vanilla-jsoneditor does not export IIFE or UMD,
>
> please leave a message [here](https://github.com/josdejong/svelte-jsoneditor/discussions/196) if you need it.

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
  </head>

  <body>
    <div id="app">
      <json-editor-vue v-model="value"></json-editor-vue>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/vue@2"></script>
    <script src="https://cdn.jsdelivr.net/npm/vue-demi"></script>
    <!-- TODO -->
    <script src="./vanilla-jsoneditor.umd.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/json-editor-vue@0.18"></script>
    <script>
      new Vue({
        components: { JsonEditorVue },
        data() {
          return {
            value: undefined,
          }
        },
      }).$mount('#app')
    </script>
  </body>
</html>
```

<br>

### Vue 2.6 or Earlier

```shell
npm i @vue/composition-api json-editor-vue
```

#### Local Registration

```vue
<script>
import VCA from '@vue/composition-api'
import JsonEditorVue from 'json-editor-vue'
import Vue from 'vue'

Vue.use(VCA)

export default {
  components: { JsonEditorVue },
  data() {
    return {
      value: undefined,
    }
  },
}
</script>

<template>
  <JsonEditorVue
    v-model="value"
    v-bind="{/* local props & attrs */}"
  />
</template>
```

#### Global Registration

```ts
import VCA from '@vue/composition-api'
import JsonEditorVue from 'json-editor-vue'
import Vue from 'vue'

Vue.use(VCA)
Vue.use(JsonEditorVue, {
  // global props & attrs (one-way data flow)
})
```

#### CDN + ESM

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
  </head>

  <body>
    <div id="app">
      <json-editor-vue v-model="value"></json-editor-vue>
    </div>

    <script>
      window.process = { env: { NODE_ENV: 'production' } }
    </script>
    <script type="importmap">
      {
        "imports": {
          "vue": "https://cdn.jsdelivr.net/npm/vue@2.6/dist/vue.esm.browser.min.js",
          "@vue/composition-api": "https://cdn.jsdelivr.net/npm/@vue/composition-api/dist/vue-composition-api.mjs",
          "@vue/composition-api/dist/vue-composition-api.mjs": "https://cdn.jsdelivr.net/npm/@vue/composition-api/dist/vue-composition-api.mjs",
          "vue-demi": "https://cdn.jsdelivr.net/npm/vue-demi/lib/v2/index.mjs",
          "vanilla-jsoneditor": "https://cdn.jsdelivr.net/npm/vanilla-jsoneditor",
          "json-editor-vue": "https://cdn.jsdelivr.net/npm/json-editor-vue@0.18/dist/json-editor-vue.mjs"
        }
      }
    </script>
    <script type="module">
      import { createApp, ref } from '@vue/composition-api'
      import JsonEditorVue from 'json-editor-vue'

      const app = createApp({
        setup: () => ({
          value: ref(),
        }),
      })

      app.use(JsonEditorVue)
      app.mount('#app')
    </script>
  </body>
</html>
```

#### CDN + IIFE

> [!Warning]
>
> Not yet supported because vanilla-jsoneditor does not export IIFE or UMD,
>
> please leave a message [here](https://github.com/josdejong/svelte-jsoneditor/discussions/196) if you need it.

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
  </head>

  <body>
    <div id="app">
      <json-editor-vue v-model="value"></json-editor-vue>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/vue@2.6"></script>
    <script src="https://cdn.jsdelivr.net/npm/@vue/composition-api"></script>
    <script src="https://cdn.jsdelivr.net/npm/vue-demi"></script>
    <!-- TODO -->
    <script src="./vanilla-jsoneditor.umd.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/json-editor-vue@0.18"></script>
    <script>
      const { createApp, ref } = VueCompositionAPI

      const app = createApp({
        setup: () => ({
          value: ref(),
        }),
      })

      app.use(VueCompositionAPI)
      app.use(JsonEditorVue)
      app.mount('#app')
    </script>
  </body>
</html>
```

<br>

### Nuxt 3

```shell
npm i json-editor-vue
```

#### Local Registration

```vue
<!-- ~/components/JsonEditorVue.client.vue -->

<script setup>
import JsonEditorVue from 'json-editor-vue'

const attrs = useAttrs()
</script>

<template>
  <JsonEditorVue v-bind="attrs" />
</template>
```

```vue
<script setup>
const value = ref()
</script>

<template>
  <JsonEditorVue
    v-model="value"
    v-bind="{/* local props & attrs */}"
  />
</template>
```

#### Global Registration as a Module

```ts
// nuxt.config.ts

export default defineNuxtConfig({
  modules: ['json-editor-vue/nuxt'],
})
```

```vue
<script setup>
const value = ref()
</script>

<template>
  <JsonEditorVue
    v-model="value"
    v-bind="{/* local props & attrs */}"
  />
</template>
```

#### Global Registration as a Plugin

```ts
// ~/plugins/JsonEditorVue.client.ts

import JsonEditorVue from 'json-editor-vue'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(JsonEditorVue, {
    // global props & attrs (one-way data flow)
  })
})
```

```vue
<script setup>
const value = ref()
</script>

<template>
  <JsonEditorVue
    v-model="value"
    v-bind="{/* local props & attrs */}"
  />
</template>
```

<br>

### Nuxt 2 + Vue 2.7

```shell
npm i json-editor-vue
```

#### Local Registration

```ts
// nuxt.config.js

export default {
  build: {
    // Vite ≥4 (Rollup ≥3) uses ES2020 as compiler target by default
    // Therefore Vite-≥4-built outputs should be transpiled in webpack 4
    transpile: ['json-editor-vue'],
    extend(config) {
      // Getting webpack to recognize the `.mjs` file
      config.module.rules.push({
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto',
      })
    },
  },
}
```

```vue
<script setup>
import { ref } from 'vue'

function JsonEditorVue() {
  return process.client
    ? import('json-editor-vue')
    : Promise.resolve({ render: h => h('div') })
}

const value = ref()
</script>

<template>
  <JsonEditorVue
    v-model="value"
    v-bind="{/* local props & attrs */}"
  />
</template>
```

#### Global Registration

```ts
// nuxt.config.js

export default {
  plugins: ['~/plugins/JsonEditorVue.client'],
  build: {
    // Vite ≥4 (Rollup ≥3) uses ES2020 as compiler target by default
    // Therefore Vite-≥4-built outputs should be transpiled in webpack 4
    transpile: ['json-editor-vue'],
    extend(config) {
      // Getting webpack to recognize the `.mjs` file
      config.module.rules.push({
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto',
      })
    },
  },
}
```

```ts
// ~/plugins/JsonEditorVue.client.js

import JsonEditorVue from 'json-editor-vue'
import Vue from 'vue'

Vue.use(JsonEditorVue, {
  // global props & attrs (one-way data flow)
})
```

```vue
<script setup>
import { ref } from 'vue'

const value = ref()
</script>

<template>
  <ClientOnly>
    <JsonEditorVue
      v-model="value"
      v-bind="{/* local props & attrs */}"
    />
  </ClientOnly>
</template>
```

<br>

### Nuxt 2 + Vue 2.6 or Earlier

```shell
npm i @vue/composition-api json-editor-vue
```

#### Local Registration

```ts
// nuxt.config.js

export default {
  build: {
    // Vite ≥4 (Rollup ≥3) uses ES2020 as compiler target by default
    // Therefore Vite-≥4-built outputs should be transpiled in webpack 4
    transpile: ['json-editor-vue'],
    extend(config) {
      // Getting webpack to recognize the `.mjs` file
      config.module.rules.push({
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto',
      })
    },
  },
}
```

```vue
<script>
import VCA from '@vue/composition-api'
import Vue from 'vue'

Vue.use(VCA)

export default {
  components: {
    JsonEditorVue: () => process.client
      ? import('json-editor-vue')
      : Promise.resolve({ render: h => h('div') }),
  },
  data() {
    return {
      value: undefined,
    }
  },
}
</script>

<template>
  <JsonEditorVue
    v-model="value"
    v-bind="{/* local props & attrs */}"
  />
</template>
```

#### Global Registration

```ts
// nuxt.config.js

export default {
  plugins: ['~/plugins/JsonEditorVue.client'],
  build: {
    // Vite ≥4 (Rollup ≥3) uses ES2020 as compiler target by default
    // Therefore Vite-≥4-built outputs should be transpiled in webpack 4
    transpile: ['json-editor-vue'],
    extend(config) {
      // Getting webpack to recognize the `.mjs` file
      config.module.rules.push({
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto',
      })
    },
  },
}
```

```ts
// ~/plugins/JsonEditorVue.client.js

import VCA from '@vue/composition-api'
import JsonEditorVue from 'json-editor-vue'
import Vue from 'vue'

Vue.use(VCA)
Vue.use(JsonEditorVue, {
  // global props & attrs (one-way data flow)
})
```

```vue
<script>
export default {
  data() {
    return {
      value: undefined,
    }
  },
}
</script>

<template>
  <ClientOnly>
    <JsonEditorVue
      v-model="value"
      v-bind="{/* local props & attrs */}"
    />
  </ClientOnly>
</template>
```

<br>

### Vite

Ready to use right out of the box.

<br>

### Vue CLI 5 (webpack 5)

Ready to use right out of the box.

<br>

### Vue CLI 4 (webpack 4)

≥ v4.5.15

```js
// vue.config.js

module.exports = {
  // Vite ≥4 (Rollup ≥3) uses ES2020 as compiler target by default
  // Therefore Vite-≥4-built outputs should be transpiled in webpack 4
  transpileDependencies: ['json-editor-vue'],
}
```

＜ v4.5.15

```js
// vue.config.js

module.exports = {
  // Vite ≥4 (Rollup ≥3) uses ES2020 as compiler target by default
  // Therefore Vite-≥4-built outputs should be transpiled in webpack 4
  transpileDependencies: ['json-editor-vue'],
  configureWebpack: {
    module: {
      rules: [
        // Getting webpack to recognize the `.mjs` file
        {
          test: /\.mjs$/,
          include: /node_modules/,
          type: 'javascript/auto',
        },
      ],
    },
  },
}
```

<br>

### Vue CLI 3 (webpack 4)

```shell
npm i @babel/plugin-proposal-nullish-coalescing-operator @babel/plugin-proposal-optional-chaining -D
```

```js
// babel.config.js

module.exports = {
  plugins: [
    '@babel/plugin-proposal-nullish-coalescing-operator',
    '@babel/plugin-proposal-optional-chaining',
  ],
}
```

```js
// vue.config.js

module.exports = {
  // Vite ≥4 (Rollup ≥3) uses ES2020 as compiler target by default
  // Therefore Vite-≥4-built outputs should be transpiled in webpack 4
  transpileDependencies: ['json-editor-vue'],
  chainWebpack(config) {
    // Getting webpack to recognize the `.mjs` file
    config.module
      .rule('mjs')
      .include
      .add(/node_modules/)
      .type('javascript/auto')
      .end()
  },
}
```

<br>

### Vue CLI 2 & 1 (webpack 3)

Vue CLI 2 & 1 pull the template from [vuejs-templates/webpack](https://github.com/vuejs-templates/webpack).

```shell
npm i @babel/core@latest @babel/preset-env@latest babel-loader@latest -D
```

```js
// babel.config.js

module.exports = {
  presets: [
    '@babel/preset-env',
  ],
}
```

```js
// webpack.base.conf.js

module.exports = {
  module: {
    rules: [
      // Getting webpack to recognize the `.mjs` file
      {
        test: /\.mjs$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test'), resolve('node_modules/json-editor-vue')],
      },
    ],
  },
}
```

<br>

### Update Dependency Versions

```shell
npm rm json-editor-vue && npm i json-editor-vue
```

> [!Warning]
>
> Not working for major version bump, fot that you can [specify dependency versions](#specify-dependency-versions) (if necessary)

<br>

### Specify Dependency Versions

```json5
// package.json
{
  // npm/cnpm/bun
  "overrides": {
    "vanilla-jsoneditor": "***",
    "vue-demi": "***"
  },
  // yarn/bun
  "resolutions": {
    "vanilla-jsoneditor": "***",
    "vue-demi": "***"
  },
  // pnpm
  "pnpm": {
    "overrides": {
      "vanilla-jsoneditor": "***",
      "vue-demi": "***"
    }
  }
}
```

With Scope:

```json5
// package.json
{
  // npm/cnpm/bun
  "overrides": {
    "json-editor-vue": {
      "vanilla-jsoneditor": "***",
      "vue-demi": "***"
    }
  },
  // yarn/bun
  "resolutions": {
    "json-editor-vue/vanilla-jsoneditor": "***",
    "json-editor-vue/vue-demi": "***"
  },
  // pnpm
  "pnpm": {
    "overrides": {
      "json-editor-vue>vanilla-jsoneditor": "***",
      "json-editor-vue>vue-demi": "***"
    }
  }
}
```

<br>

## Props

| Name                                                   | Description                                                                                   | Type                                 | Default     |
| ------------------------------------------------------ | --------------------------------------------------------------------------------------------- | ------------------------------------ | ----------- |
| v-model /<br>modelValue (Vue 3) /<br>value (Vue 2)     | binding value                                                                                 | any                                  |             |
| mode /<br>v-model:mode (Vue 3) /<br>:mode.sync (Vue 2) | edit mode                                                                                     | `Mode` /<br>you can use string in JS | `Mode.tree` |
| debounce                                               | debounce delay to update the binding value when typing in text mode, in milliseconds          | number                               | `300`       |
| stringified                                            | whether to keep the binding value as stringified JSON in text mode                            | boolean                              | `true`      |
| ...                                                    | properties of [svelte-jsoneditor](https://github.com/josdejong/svelte-jsoneditor/#properties) |                                      |             |

### parsed JSON vs. stringified JSON

- parsed JSON: what we commonly refer to as JSON, which can be of any data type.
- stringified JSON: serialized JSON, which is always a string type.

### Binding value difference between svelte-jsoneditor and json-editor-vue

- svelte-jsoneditor: An object contains a parsed JSON or a stringified JSON, will do `JSON.parse` when passing as a stringified JSON.
- json-editor-vue: JSON itself. What you see is what you get.

If you prefer the behavior of svelte-jsoneditor:

```html
<JsonEditorVue
  :content="content"
  :onChange="(updatedContent) => {
    content = updatedContent
  }"
/>
```

### The association between binding value and modes

> [!Important]
>
> The input value is independent of modes, **except**:
>
> Input value of string type will be treated as a normal string under tree mode, as a stringified JSON under text mode by default.
>
> The output value of tree mode is a parsed JSON, the output value of text mode is a stringified JSON.
>
> But this correspondence can be disrupted by programmatic changes or mode switching.
>
> See https://github.com/josdejong/svelte-jsoneditor/pull/166 for more details.

FAQ: How to keep the value as parsed JSON in text mode?

> [!Caution]
>
> - Not performant for large JSON documents.
> - Adjust the `debounce` value based on the size of your JSON.
> - Will output `undefined` when the input value is invalid.

```vue
<script setup>
import { Mode } from 'vanilla-jsoneditor'
</script>

<template>
  <JsonEditorVue :mode="Mode.text" :stringified="false" />
</template>
```

> [!Tip]
>
> You can use `mode="text"` in JavaScript context without installing vanilla-jsoneditor.

### Naming convention

Support camelCase and kebab-case for tag & property name.

> [!Tip]
>
> When using json-editor-vue or any Vue component via CDN (HTML), kebab-case must be used exclusively due to HTML's case insensitivity.

### Boolean properties

Including the boolean properties of svelte-jsoneditor like `readOnly` with no value will imply `true`:

- ✓ `<JsonEditorVue readOnly />`

- ✓ `<JsonEditorVue :readOnly="true" />`

<br>

## Exposes

| Name       | Description         | Type   |
| ---------- | ------------------- | ------ |
| jsonEditor | JSONEditor instance | object |

### Calling the methods of svelte-jsoneditor

```vue
<script setup>
import { onMounted, useTemplateRef } from 'vue'

// Vue ≥ v3.5
const jsonEditorVueRef = useTemplateRef('jsonEditorVueRef')
// Vue < v3.5
// const jsonEditorVueRef = ref()

onMounted(() => {
  jsonEditorVueRef.value.jsonEditor.focus()
})
</script>

<template>
  <JsonEditorVue ref="jsonEditorVueRef" />
</template>
```

<br>

## BigInt

```shell
npm i lossless-json
```

```vue
<script setup>
import JsonEditorVue from 'json-editor-vue'
import { parse, stringify } from 'lossless-json'
</script>

<template>
  <JsonEditorVue :parser="{ parse, stringify }" />
</template>
```

<br>

## Dark Theme

```vue
<script setup>
import JsonEditorVue from 'json-editor-vue'
import 'vanilla-jsoneditor/themes/jse-theme-dark.css'
</script>

<template>
  <JsonEditorVue class="jse-theme-dark" />
</template>
```

<br>

## Changelog

Detailed changes for each release are documented in the [release notes](https://github.com/cloydlau/json-editor-vue/releases)

<br>

## Donate

You can buy us a coffee via WeChat Pay 💗

<img alt="WeChat Pay" src="https://raw.githubusercontent.com/cloydlau/json-editor-vue/main/docs/wechat-pay.jpg" width="150px">

<br>
