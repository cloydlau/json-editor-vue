<h1 align="center">
  <a href="https://npmjs.com/package/json-editor-vue" target="_blank" rel="noopener noreferrer">
    JSON Editor Vue <sup><img alt="version" src="https://img.shields.io/npm/v/json-editor-vue.svg?style=flat-square&color=white&label="></sup>
  </a>
</h1>

<p align="center">
  Vue 2.6/2.7/3 & Nuxt 2/3 一体通用 JSON 编辑 & 预览 & 格式化 & 校验工具
  <br>
  <a href="../README.md">English</a> | 简体中文
</p>

<p align="center">
  <a href="https://cloydlau.github.io/demo/json-editor-vue.html"><img alt="playground" src="https://img.shields.io/badge/Playground-blue?color=9BE4E0"></a>
  <br>
  <a href="https://npmjs.com/package/json-editor-vue"><img alt="npm" src="https://img.shields.io/npm/v/json-editor-vue.svg?color=cb3837"></a>
  <a href="https://jsr.io/@cloydlau/json-editor-vue"><img alt="jsr" src="https://jsr.io/badges/@cloydlau/json-editor-vue"></a>
  <br>
  <a href="https://github.com/cloydlau/json-editor-vue/actions/workflows/ci.yml"><img alt="build status" src="https://github.com/cloydlau/json-editor-vue/actions/workflows/ci.yml/badge.svg?branch=main"></a>
  <a href="https://bundlephobia.com/package/json-editor-vue"><img alt="minzipped size" src="https://img.shields.io/bundlephobia/minzip/json-editor-vue"></a>
  <a href="https://github.com/cloydlau/json-editor-vue#develop"><img alt="PRs Welcome" src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg"></a>
  <br>
  <a href="https://conventionalcommits.org"><img alt="conventional commits" src="https://img.shields.io/badge/commits-Conventional-FE5196.svg?logo=conventionalcommits"></a>
  <a href="https://github.com/antfu/eslint-config"><img alt="code style" src="https://antfu.me/badge-code-style.svg"></a>
  <a href="https://www.jsdelivr.com/package/npm/json-editor-vue"><img alt="jsdelivr downloads" src="https://data.jsdelivr.com/v1/package/npm/json-editor-vue/badge?style=rounded"></a>
  <br>
  <a><img src="https://img.shields.io/badge/可能是整个开源世界-white?style=flat-square"></a> <a href="https://npmcharts.com/compare/json-editor-vue"><img alt="npm downloads" src="https://img.shields.io/npm/dt/json-editor-vue?logo=npm&color=cb3837"></a> <a><img src="https://img.shields.io/badge/与-white?style=flat-square"></a> <a href="https://github.com/cloydlau/json-editor-vue/stargazers"><img alt="github stars" src="https://img.shields.io/github/stars/cloydlau/json-editor-vue?color=eac54f&logo=github"></a> <a><img src="https://img.shields.io/badge/悬殊最大的仓库，如有帮助，点亮一下星星哦_🙏-white?style=flat-square"></a>
</p>

<img width="48.5%" src="./text-mode.png" alt="text mode">&nbsp;<img width="48.5%" src="./tree-mode.png" alt="table mode">

<br>

## 特性

- 预览、编辑、格式化、校验、压缩、排序、查询、过滤、转换、修复、高亮 JSON
- 3 种编辑模式：文本模式 & 树形模式 & 表格模式，双向绑定
- 2 种主题：浅色主题 & 深色主题
- 支持高达 512 MB 的大型 JSON 文档
- 支持全部 7 种原始数据类型包括 `BigInt` and `Symbol`
- Vue 2.6/2.7/3 一体通用
- 支持 SSR，Nuxt 2/3 一体通用
- 支持 Vite，Vue CLI，webpack，CDN...
- 支持微前端 ([wujie](https://github.com/Tencent/wujie)，[qiankun](https://github.com/umijs/qiankun)，[single-spa](https://github.com/single-spa/single-spa)...)
- 局部注册并传参，或全局注册并传参 ([vue-global-config](https://github.com/cloydlau/vue-global-config) 提供技术支持)

<br>

## 安装

### 依赖

从 v0.11 开始，不再需要显式安装 [vanilla-jsoneditor](https://github.com/josdejong/svelte-jsoneditor)，

如果需要指定依赖的版本：

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

或缩小作用范围：

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

### Vue 3

```shell
# npm
npm i json-editor-vue

# jsr
npx jsr add @cloydlau/json-editor-vue
```

#### 局部注册

```vue
<script setup>
import JsonEditorVue from 'json-editor-vue'

const value = ref()
</script>

<template>
  <JsonEditorVue
    v-model="value"
    v-bind="{/* 局部 props & attrs */}"
  />
</template>
```

#### 全局注册

```ts
import { createApp } from 'vue'
import JsonEditorVue from 'json-editor-vue'

createApp()
  .use(JsonEditorVue, {
    // 全局 props & attrs（单向数据流）
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
          "json-editor-vue": "https://cdn.jsdelivr.net/npm/json-editor-vue@0.14/dist/json-editor-vue.mjs"
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
> 暂不支持 (vanilla-jsoneditor 不提供 IIFE 或 UMD 导出)，
>
> 如有需要请在[这里](https://github.com/josdejong/svelte-jsoneditor/discussions/196)留言。

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
    <script src="https://cdn.jsdelivr.net/npm/json-editor-vue@0.14"></script>
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
# npm
npm i json-editor-vue

# jsr
npx jsr add @cloydlau/json-editor-vue
```

#### 局部注册

```vue
<script setup>
import JsonEditorVue from 'json-editor-vue'

const value = ref()
</script>

<template>
  <JsonEditorVue
    v-model="value"
    v-bind="{/* 局部 props & attrs */}"
  />
</template>
```

#### 全局注册

```ts
import Vue from 'vue'
import JsonEditorVue from 'json-editor-vue'

Vue.use(JsonEditorVue, {
  // 全局 props & attrs（单向数据流）
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
          "json-editor-vue": "https://cdn.jsdelivr.net/npm/json-editor-vue@0.14/dist/json-editor-vue.mjs"
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
> 暂不支持 (vanilla-jsoneditor 不提供 IIFE 或 UMD 导出)，
>
> 如有需要请在[这里](https://github.com/josdejong/svelte-jsoneditor/discussions/196)留言。

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
    <script src="https://cdn.jsdelivr.net/npm/json-editor-vue@0.14"></script>
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

### Vue 2.6 或更早版本

```shell
# npm
npm i @vue/composition-api json-editor-vue

# jsr
npm i @vue/composition-api
npx jsr add @cloydlau/json-editor-vue
```

#### 局部注册

```vue
<script>
import Vue from 'vue'
import VCA from '@vue/composition-api'
import JsonEditorVue from 'json-editor-vue'

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
    v-bind="{/* 局部 props & attrs */}"
  />
</template>
```

#### 全局注册

```ts
import Vue from 'vue'
import VCA from '@vue/composition-api'
import JsonEditorVue from 'json-editor-vue'

Vue.use(VCA)
Vue.use(JsonEditorVue, {
  // 全局 props & attrs（单向数据流）
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
          "json-editor-vue": "https://cdn.jsdelivr.net/npm/json-editor-vue@0.14/dist/json-editor-vue.mjs"
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
> 暂不支持 (vanilla-jsoneditor 不提供 IIFE 或 UMD 导出)，
>
> 如有需要请在[这里](https://github.com/josdejong/svelte-jsoneditor/discussions/196)留言。

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
    <script src="https://cdn.jsdelivr.net/npm/json-editor-vue@0.14"></script>
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
# npm
npm i json-editor-vue

# jsr
npx jsr add @cloydlau/json-editor-vue
```

#### 局部注册

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
    v-bind="{/* 局部 props & attrs */}"
  />
</template>
```

#### 全局注册为 Module

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
    v-bind="{/* 局部 props & attrs */}"
  />
</template>
```

#### 全局注册为 Plugin

```ts
// ~/plugins/JsonEditorVue.client.ts

import JsonEditorVue from 'json-editor-vue'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(JsonEditorVue, {
    // 全局 props & attrs（单向数据流）
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
    v-bind="{/* 局部 props & attrs */}"
  />
</template>
```

<br>

### Nuxt 2 + Vue 2.7

```shell
# npm
npm i json-editor-vue

# jsr
npx jsr add @cloydlau/json-editor-vue
```

#### 局部注册

```ts
// nuxt.config.js

export default {
  build: {
    // Vite ≥4 (Rollup ≥3) 默认的编译目标为 ES2020
    // 所以在 webpack 4 中需要对 Vite ≥4 打包的依赖进行转译
    transpile: ['json-editor-vue'],
    extend(config) {
      // 让 webpack 识别 `.mjs` 文件
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
    v-bind="{/* 局部 props & attrs */}"
  />
</template>
```

#### 全局注册

```ts
// nuxt.config.js

export default {
  plugins: ['~/plugins/JsonEditorVue.client'],
  build: {
    // Vite ≥4 (Rollup ≥3) 默认的编译目标为 ES2020
    // 所以在 webpack 4 中需要对 Vite ≥4 打包的依赖进行转译
    transpile: ['json-editor-vue'],
    extend(config) {
      // 让 webpack 识别 `.mjs` 文件
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

import Vue from 'vue'
import JsonEditorVue from 'json-editor-vue'

Vue.use(JsonEditorVue, {
  // 全局 props & attrs（单向数据流）
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
      v-bind="{/* 局部 props & attrs */}"
    />
  </ClientOnly>
</template>
```

<br>

### Nuxt 2 + Vue 2.6 或更早版本

```shell
# npm
npm i @vue/composition-api json-editor-vue

# jsr
npm i @vue/composition-api
npx jsr add @cloydlau/json-editor-vue
```

#### 局部注册

```ts
// nuxt.config.js

export default {
  build: {
    // Vite ≥4 (Rollup ≥3) 默认的编译目标为 ES2020
    // 所以在 webpack 4 中需要对 Vite ≥4 打包的依赖进行转译
    transpile: ['json-editor-vue'],
    extend(config) {
      // 让 webpack 识别 `.mjs` 文件
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
import Vue from 'vue'
import VCA from '@vue/composition-api'

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
    v-bind="{/* 局部 props & attrs */}"
  />
</template>
```

#### 全局注册

```ts
// nuxt.config.js

export default {
  plugins: ['~/plugins/JsonEditorVue.client'],
  build: {
    // Vite ≥4 (Rollup ≥3) 默认的编译目标为 ES2020
    // 所以在 webpack 4 中需要对 Vite ≥4 打包的依赖进行转译
    transpile: ['json-editor-vue'],
    extend(config) {
      // 让 webpack 识别 `.mjs` 文件
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

import Vue from 'vue'
import VCA from '@vue/composition-api'
import JsonEditorVue from 'json-editor-vue'

Vue.use(VCA)
Vue.use(JsonEditorVue, {
  // 全局 props & attrs（单向数据流）
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
      v-bind="{/* 局部 props & attrs */}"
    />
  </ClientOnly>
</template>
```

<br>

### Vite

开箱即用

<br>

### Vue CLI 5 (webpack 5)

开箱即用

<br>

### Vue CLI 4 (webpack 4)

≥ v4.5.15

```js
// vue.config.js

module.exports = {
  // Vite ≥4 (Rollup ≥3) 默认的编译目标为 ES2020
  // 所以在 webpack 4 中需要对 Vite ≥4 打包的依赖进行转译
  transpileDependencies: ['json-editor-vue'],
}
```

＜ v4.5.15

```js
// vue.config.js

module.exports = {
  // Vite ≥4 (Rollup ≥3) 默认的编译目标为 ES2020
  // 所以在 webpack 4 中需要对 Vite ≥4 打包的依赖进行转译
  transpileDependencies: ['json-editor-vue'],
  configureWebpack: {
    module: {
      rules: [
        // 让 webpack 识别 `.mjs` 文件
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
  // Vite ≥4 (Rollup ≥3) 默认的编译目标为 ES2020
  // 所以在 webpack 4 中需要对 Vite ≥4 打包的依赖进行转译
  transpileDependencies: ['json-editor-vue'],
  chainWebpack(config) {
    // 让 webpack 识别 `.mjs` 文件
    config.module
      .rule('mjs')
      .include.add(/node_modules/)
      .type('javascript/auto')
      .end()
  },
}
```

<br>

### Vue CLI 2 & 1 (webpack 3)

Vue CLI 2 & 1 从 [vuejs-templates/webpack](https://github.com/vuejs-templates/webpack) 拉取模板

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
      // 让 webpack 识别 `.mjs` 文件
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

## 属性

| 名称                                                   | 说明                                                                                   | 类型          | 默认值   |
| ------------------------------------------------------ | -------------------------------------------------------------------------------------- | ------------- | -------- |
| v-model /<br>modelValue (Vue 3) /<br>value (Vue 2)     | 绑定值                                                                                 | any           |          |
| mode /<br>v-model:mode (Vue 3) /<br>:mode.sync (Vue 2) | 编辑模式                                                                               | [Mode](#Mode) | `'tree'` |
| debounce                                               | 输入时的去抖延迟 (毫秒)                                                                | number        | `100`    |
| stringified                                            | 在 text 模式下保持绑定值是 stringified JSON                                            | boolean       | `true`   |
| ...                                                    | [svelte-jsoneditor](https://github.com/josdejong/svelte-jsoneditor/#properties) 的属性 |               |          |

### parsed JSON vs. stringified JSON

- parsed JSON: 就是我们平常所说的 JSON，可以是任何数据类型
- stringified JSON: 序列化后的 JSON，一定是 string 类型

### svelte-jsoneditor 与 json-editor-vue 中绑定值的差异

- svelte-jsoneditor：一个包含 parsed JSON 或 stringified JSON 的对象，当作为 stringified JSON 传入时，会经过 `JSON.parse` 解析
- json-editor-vue：JSON 本身，所见即所得

如果你更倾向于 svelte-jsoneditor 的行为：

```html
<JsonEditorVue
  :content="content"
  :onChange="(updatedContent) => {
    content = updatedContent
  }"
/>
```

### 绑定值与模式的关系

> [!Important]
>
> 输入值与模式无关，**除了**：
>
> string 类型的输入值在 tree 模式下会被视作普通字符串，在 text 模式下默认会被视作 stringified JSON
>
> tree 模式下的输出值是 parsed JSON，text 模式下的输出值是 stringified JSON
>
> 但这个对应关系会被编程式输入或模式切换打破
>
> 详情见 https://github.com/josdejong/svelte-jsoneditor/pull/166

FAQ: 如何在 text 模式下保持绑定值是 parsed JSON：

> [!Caution]
>
> - 对于大型 JSON 文档性能不佳
> - 请根据你的 JSON 大小来调整 `debounce` 的值
> - 输入值无效时会输出空

```html
<JsonEditorVue
  mode="text"
  :main-menu-bar="false"
  :stringified="false"
  :debounce="1000"
/>
```

### 命名惯例

标签、属性名称支持驼峰命名和短横线命名

> [!Tip]
>
> 通过 CDN (HTML) 使用 json-editor-vue 或任何 Vue 组件时，由于 HTML 大小写不敏感，仅能使用短横线命名

### 布尔类型属性

仅写上 svelte-jsoneditor 的布尔类型属性如 `readOnly` 但不传值，会隐式转换为 `true`：

- ✓ `<JsonEditorVue readOnly />`

- ✓ `<JsonEditorVue :readOnly="true" />`

<br>

## Expose

| 名称       | 说明            | 类型   |
| ---------- | --------------- | ------ |
| jsonEditor | JSONEditor 实例 | object |

### 调用 svelte-jsoneditor 的方法

```vue
<script setup>
import { onMounted, ref } from 'vue'

const jsonEditorVueRef = ref()

onMounted(() => {
  jsonEditorVueRef.value.jsonEditor.focus()
})
</script>

<template>
  <JsonEditorVue ref="jsonEditorVueRef" />
</template>
```

<br>

## 类型

<a name="Mode"></a>

```ts
type Mode = 'tree' | 'text' | 'table'
```

<br>

<a name="dark-theme"></a>

## 暗色主题

```vue
<script setup>
import 'vanilla-jsoneditor/themes/jse-theme-dark.css'
import JsonEditorVue from 'json-editor-vue'
</script>

<template>
  <JsonEditorVue class="jse-theme-dark" />
</template>
```

<br>

## 更新日志

各版本详细改动请参考 [release notes](https://github.com/cloydlau/json-editor-vue/releases)

<br>
