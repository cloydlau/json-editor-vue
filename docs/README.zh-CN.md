<h1 align="center">
  <a href="https://npmjs.com/package/json-editor-vue" target="_blank" rel="noopener noreferrer">
    JSON Editor Vue <sup><img alt="version" src="https://img.shields.io/npm/v/json-editor-vue.svg?style=flat-square&color=white&label="></sup>
  </a>
</h1>

<p align="center">
  Vue 2.6/2.7/3 & Nuxt 2/3 一体式 JSON 编辑 & 预览 & 格式化 & 校验工具。
  <br>
  <a href="../README.md">English</a> | 简体中文
  <br>
  <a href="https://cloydlau.github.io/demo/json-editor-vue.html">🕹 试玩</a>
</p>

<p align="center">
  <a href="https://github.com/cloydlau/json-editor-vue/actions/workflows/ci.yml"><img alt="build status" src="https://github.com/cloydlau/json-editor-vue/actions/workflows/ci.yml/badge.svg?branch=main"></a>
      <a href="https://bundlephobia.com/package/json-editor-vue"><img alt="minzipped size" src="https://img.shields.io/bundlephobia/minzip/json-editor-vue"></a>
  <a href="https://github.com/cloydlau/json-editor-vue#develop"><img alt="PRs Welcome" src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg"></a>
  <br>
  <a href="https://conventionalcommits.org"><img alt="conventional commits" src="https://img.shields.io/badge/commits-Conventional-FE5196.svg?logo=conventionalcommits"></a>
  <a href="https://github.com/antfu/eslint-config"><img alt="code style" src="https://antfu.me/badge-code-style.svg"></a>
  <a href="https://www.jsdelivr.com/package/npm/json-editor-vue"><img alt="jsdelivr downloads" src="https://data.jsdelivr.com/v1/package/npm/json-editor-vue/badge?style=rounded"></a>
  <br>
  <a><img src="https://img.shields.io/badge/可能是整个开源世界-white?style=flat-square"></a> <a href="https://npmcharts.com/compare/json-editor-vue"><img alt="npm downloads" src="https://img.shields.io/npm/dt/json-editor-vue?logo=npm&color=rgba(203,0,0,0.9)"></a> <a><img src="https://img.shields.io/badge/与-white?style=flat-square"></a> <a href="https://github.com/cloydlau/json-editor-vue/stargazers"><img alt="github stars" src="https://img.shields.io/github/stars/cloydlau/json-editor-vue?color=eac54f&logo=github"></a> <a><img src="https://img.shields.io/badge/悬殊最大的仓库，如有帮助，点亮一下星星哦！-white?style=flat-square"></a>
</p>

<img width="48.5%" src="./text mode.png" alt="text mode">&nbsp;<img width="48.5%" src="./tree mode.png" alt="table mode">

<br>

## 特性

- 预览、编辑、格式化、校验、压缩、排序、查询、过滤、转换、修复、高亮 JSON
- 三种编辑模式：文本模式 & 树形模式 & 表格模式，双向绑定
- 支持高达 512 MB 的大型 JSON 文档
- Vue 2.6/2.7/3 通用
- 支持 SSR (Nuxt 2/3 通用)
- 支持 Vite，Vue CLI，webpack，CDN……
- 支持微前端 ([wujie](https://github.com/Tencent/wujie)，[qiankun](https://github.com/umijs/qiankun)，[single-spa](https://github.com/single-spa/single-spa)……)
- 局部注册并传参，或全局注册并传参 ([vue-global-config](https://github.com/cloydlau/vue-global-config) 提供技术支持)

<br>

## 安装

### 外置依赖

- vue
- vanilla-jsoneditor：[svelte-jsoneditor](https://github.com/josdejong/svelte-jsoneditor) ([jsoneditor](https://github.com/josdejong/jsoneditor) 的继任者) 提供的原生 JS 版本
- ~~@vue/composition-api~~：仅 Vue 2.6 或更早版本需要

<br>

### Vue 3

```shell
npm i json-editor-vue vanilla-jsoneditor
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
<!DOCTYPE html>
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
        "json-editor-vue": "https://cdn.jsdelivr.net/npm/json-editor-vue@0.10/dist/json-editor-vue.mjs"
      }
    }
  </script>
  <script type="module">
    import { createApp, ref } from 'vue'
    import JsonEditorVue from 'json-editor-vue'

    createApp({
      setup: () => ({
        value: ref()
      })
    }).use(JsonEditorVue)
      .mount('#app')
  </script>
</body>

</html>
```

#### CDN + IIFE

> ⚠ 暂不支持 (vanilla-jsoneditor 不提供 IIFE 或 UMD 导出)，如有需要请在[这里](https://github.com/josdejong/svelte-jsoneditor/discussions/196)留言。

```html
<!DOCTYPE html>
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
  <!-- TODO --> <script src="./vanilla-jsoneditor.umd.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/json-editor-vue@0.10"></script>
  <script>
    const { createApp, ref } = Vue

    createApp({
      setup: () => ({
        value: ref(),
      }),
    }).component('json-editor-vue', JsonEditorVue)
      .mount('#app')
  </script>
</body>

</html>
```

<br>

### Vue 2.7

```shell
npm i json-editor-vue vanilla-jsoneditor
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
<!DOCTYPE html>
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
        "json-editor-vue": "https://cdn.jsdelivr.net/npm/json-editor-vue@0.10/dist/json-editor-vue.mjs"
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

> ⚠ 暂不支持 (vanilla-jsoneditor 不提供 IIFE 或 UMD 导出)，如有需要请在[这里](https://github.com/josdejong/svelte-jsoneditor/discussions/196)留言。

```html
<!DOCTYPE html>
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
  <!-- TODO --> <script src="./vanilla-jsoneditor.umd.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/json-editor-vue@0.10"></script>
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
npm i json-editor-vue vanilla-jsoneditor @vue/composition-api
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
<!DOCTYPE html>
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
        "json-editor-vue": "https://cdn.jsdelivr.net/npm/json-editor-vue@0.10/dist/json-editor-vue.mjs"
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

> ⚠ 暂不支持 (vanilla-jsoneditor 不提供 IIFE 或 UMD 导出)，如有需要请在[这里](https://github.com/josdejong/svelte-jsoneditor/discussions/196)留言。

```html
<!DOCTYPE html>
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
  <!-- TODO --> <script src="./vanilla-jsoneditor.umd.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/json-editor-vue@0.10"></script>
  <script>
    const { createApp, ref } = VueCompositionAPI

    const app = createApp({
      setup: () => ({
        value: ref(),
      }),
    })

    app.use(VueCompositionAPI)
    app.component('json-editor-vue', JsonEditorVue)
    app.mount('#app')
  </script>
</body>

</html>
```

<br>

### Nuxt 3

```shell
npm i json-editor-vue vanilla-jsoneditor
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
  <client-only>
    <JsonEditorVue
      v-model="value"
      v-bind="{/* 局部 props & attrs */}"
    />
  </client-only>
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
  <client-only>
    <JsonEditorVue v-model="value" />
  </client-only>
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
  <client-only>
    <JsonEditorVue v-model="value" />
  </client-only>
</template>
```

<br>

### Nuxt 2 + Vue 2.7

```shell
npm i json-editor-vue vanilla-jsoneditor
```

#### 局部注册

```ts
// nuxt.config.js

export default {
  build: {
    // Vite 4 (Rollup 3) 默认的编译目标为 ES2020
    // 所以在 webpack 4 中需要对 Vite 4 打包的依赖进行转译
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
  <client-only>
    <JsonEditorVue
      v-model="value"
      v-bind="{/* 局部 props & attrs */}"
    />
  </client-only>
</template>
```

#### 全局注册

```ts
// nuxt.config.js

export default {
  plugins: ['~/plugins/JsonEditorVue.client'],
  build: {
    // Vite 4 (Rollup 3) 默认的编译目标为 ES2020
    // 所以在 webpack 4 中需要对 Vite 4 打包的依赖进行转译
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
  <client-only>
    <JsonEditorVue v-model="value" />
  </client-only>
</template>
```

<br>

### Nuxt 2 + Vue 2.6 或更早版本

```shell
npm i json-editor-vue vanilla-jsoneditor @vue/composition-api
```

#### 局部注册

```ts
// nuxt.config.js

export default {
  build: {
    // Vite 4 (Rollup 3) 默认的编译目标为 ES2020
    // 所以在 webpack 4 中需要对 Vite 4 打包的依赖进行转译
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
  <client-only>
    <JsonEditorVue
      v-model="value"
      v-bind="{/* 局部 props & attrs */}"
    />
  </client-only>
</template>
```

#### 全局注册

```ts
// nuxt.config.js

export default {
  plugins: ['~/plugins/JsonEditorVue.client'],
  build: {
    // Vite 4 (Rollup 3) 默认的编译目标为 ES2020
    // 所以在 webpack 4 中需要对 Vite 4 打包的依赖进行转译
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
  <client-only>
    <JsonEditorVue v-model="value" />
  </client-only>
</template>
```

<br>

### Vite

开箱即用。

<br>

### Vue CLI 5 (webpack 5)

开箱即用。

<br>

### Vue CLI 4 (webpack 4)

≥ v4.5.15

```js
// vue.config.js

module.exports = {
  // Vite 4 (Rollup 3) 默认的编译目标为 ES2020
  // 所以在 webpack 4 中需要对 Vite 4 打包的依赖进行转译
  transpileDependencies: ['json-editor-vue'],
}
```

＜ v4.5.15

```js
// vue.config.js

module.exports = {
  // Vite 4 (Rollup 3) 默认的编译目标为 ES2020
  // 所以在 webpack 4 中需要对 Vite 4 打包的依赖进行转译
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
  // Vite 4 (Rollup 3) 默认的编译目标为 ES2020
  // 所以在 webpack 4 中需要对 Vite 4 打包的依赖进行转译
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

Vue CLI 2 & 1 从 [vuejs-templates/webpack](https://github.com/vuejs-templates/webpack) 拉取模板。

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
|--------------------------------------------------------|--------------------------------------------------------------------------------------|---------------|----------|
| v-model /<br>modelValue (Vue 3) /<br>value (Vue 2)     | 绑定值                                                                                 | any           |          |
| mode /<br>v-model:mode (Vue 3) /<br>:mode.sync (Vue 2) | 编辑模式                                                                               | [Mode](#Mode) | `'tree'` |
| ...                                                    | [svelte-jsoneditor](https://github.com/josdejong/svelte-jsoneditor/#properties) 的属性 |               |          |

### svelte-jsoneditor 与 json-editor-vue 中绑定值的差异

- svelte-jsoneditor：一个包含 “stringified JSON” 或 “parsed JSON” 的对象，当作为 “stringified JSON” 传入时，会经过 `JSON.parse` 解析。
- json-editor-vue：JSON 本身，所见即所得。

如果你更倾向于 svelte-jsoneditor 的行为：

```html
<JsonEditorVue
  :content="content"
  :onChange="(updatedContent) => {
    content = updatedContent
  }"
/>
```

> 详情见 https://github.com/josdejong/svelte-jsoneditor/pull/166。

### 布尔类型属性

仅写上 svelte-jsoneditor 的布尔类型属性如 `readOnly` 但不传值，会隐式转换为 `true`：

- ✔️ `<JsonEditorVue readOnly />`

- ✔️ `<JsonEditorVue :readOnly="true" />`

> 通过 CDN 使用时，标签、属性名称都必须使用短横线命名。

<br>

## Expose

| 名称       | 说明            | 类型   |
|------------|---------------|--------|
| jsonEditor | JSONEditor 实例 | object |

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

各版本详细改动请参考 [release notes](https://github.com/cloydlau/json-editor-vue/releases)。

<br>
