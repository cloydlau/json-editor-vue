English | [简体中文](./docs/README.zh-CN.md)

# json-editor-vue

JSON editor for Vue 2.6 / 2.7 / 3, powered by [svelte-jsoneditor](https://github.com/josdejong/svelte-jsoneditor).

> svelte-jsoneditor is a brand new JSON editor created by the same author of [jsoneditor](https://github.com/josdejong/jsoneditor), which ['has become hard to maintain, and the architecture needed a big overhaul'](https://github.com/josdejong/jsoneditor/issues/1223). json-editor-vue is the Vue version for svelte-jsoneditor.

![jsoneditor_screenshot](./docs/jsoneditor_screenshot.png)

🤹‍♂️ [Online Playground](https://cloydlau.github.io/demo/json-editor-vue.html)

<br>

## Features

- Support Vue 2.6 / 2.7 / 3
- Import locally or globally, configure locally or globally (Powered
  by [vue-global-config](https://github.com/cloydlau/vue-global-config))

<br>

## Installation

![NPM](https://nodei.co/npm/json-editor-vue.png)

### Vue 3

```sh
npm add vanilla-jsoneditor json-editor-vue
```

#### Import globally

```ts
import JsonEditorVue from 'json-editor-vue'

app.use(JsonEditorVue, {
  // global config
})
```

#### Import locally

```vue
<template>
  <JsonEditorVue v-model="value" v-bind="{/* local config */}" />
</template>

<script setup>
import JsonEditorVue from 'json-editor-vue'
</script>
```

#### Without bundler / CDN

```html
<div id="app">
  <json-editor-vue v-model="value"></json-editor-vue>
  <p v-text="value"></p>
</div>

<script type="importmap">
  {
    "imports": {
      "vue": "https://unpkg.com/vue/dist/vue.esm-browser.prod.js",
      "vue-demi": "https://unpkg.com/vue-demi/lib/v3/index.mjs",
      "vanilla-jsoneditor": "https://unpkg.com/vanilla-jsoneditor",
      "json-editor-vue": "https://unpkg.com/json-editor-vue@0.5/dist/json-editor-vue.mjs"
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
  })
    .use(JsonEditorVue)
    .mount('#app')
</script>
```

<br>

### Vue 2.7

```sh
npm add vanilla-jsoneditor json-editor-vue
```

#### Import globally

```ts
import JsonEditorVue from 'json-editor-vue'

Vue.use(JsonEditorVue, {
  // global config
})
```

#### Import locally

```vue
<template>
  <JsonEditorVue v-model="value" v-bind="{/* local config */}" />
</template>

<script setup>
import JsonEditorVue from 'json-editor-vue'
</script>
```

#### Without bundler / CDN

```html
<div id="app">
  <json-editor-vue v-model="value"></json-editor-vue>
  <p v-text="value"></p>
</div>

<script type="importmap">
  {
    "imports": {
      "vue": "https://unpkg.com/vue@2/dist/vue.esm.browser.min.js",
      "vue-demi": "https://unpkg.com/vue-demi/lib/v2.7/index.mjs",
      "vanilla-jsoneditor": "https://unpkg.com/vanilla-jsoneditor",
      "json-editor-vue": "https://unpkg.com/json-editor-vue@0.5/dist/json-editor-vue.mjs"
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
  })
    .$mount('#app')
</script>
```

<br>

### Vue 2.6 or earlier

```sh
npm add @vue/composition-api vanilla-jsoneditor json-editor-vue
```

#### Import globally

```ts
import VCA from '@vue/composition-api'
import JsonEditorVue from 'json-editor-vue'

Vue.use(VCA)
Vue.use(JsonEditorVue, {
  // global config
})
```

#### Import locally

```vue
<template>
  <JsonEditorVue v-model="value" v-bind="{/* local config */}" />
</template>

<script>
import VCA from '@vue/composition-api'
import JsonEditorVue from 'json-editor-vue'

Vue.use(VCA)

export default {
  components: { JsonEditorVue },
}
</script>
```

#### Without bundler / CDN

> It's quite messy this way due to `vanilla-jsoneditor` does not export UMD.

```html
<div id="app">
  <json-editor-vue v-model="value"></json-editor-vue>
  <p v-text="value"></p>
</div>

<script>
  window.process = { env: { NODE_ENV: 'production' } }
</script>
<script type="importmap">
  {
    "imports": {
      "vue": "https://unpkg.com/vue@2.6/dist/vue.esm.browser.min.js",
      "@vue/composition-api": "https://unpkg.com/@vue/composition-api/dist/vue-composition-api.mjs",
      "@vue/composition-api/dist/vue-composition-api.mjs": "https://unpkg.com/@vue/composition-api/dist/vue-composition-api.mjs",
      "vue-demi": "https://unpkg.com/vue-demi/lib/v2/index.mjs",
      "vanilla-jsoneditor": "https://unpkg.com/vanilla-jsoneditor",
      "json-editor-vue": "https://unpkg.com/json-editor-vue@0.5/dist/json-editor-vue.mjs"
    }
  }
</script>
<script type="module">
  import { createApp, ref } from '@vue/composition-api'
  import JsonEditorVue from 'json-editor-vue'

  const app = createApp({
    setup: () => ({
      value: ref()
    })
  })
  app.use(JsonEditorVue)
  app.mount('#app')
</script>
```

<br>

## Props

| Name    | Description                                                                         | Type |
| ------- | ----------------------------------------------------------------------------------- | ---- |
| v-model | binding value                                                                       | any  |
| ...     | options of [svelte-jsoneditor](https://github.com/josdejong/svelte-jsoneditor/#api) |      |

<br>

## Expose

> Vue 3 only, all instance properties are accessable using `$refs` in Vue 2.

| name       | description         | type   |
| ---------- | ------------------- | ------ |
| jsonEditor | JSONEditor instance | object |

<br>

## Config rules

- Props of two-way data binding ( `v-model` / `modelValue` / `value` ) only support local config.
- All other props support both local and global config.

Priority:

- Local config is higher than global config.
- For object type, global config will be merged into local config.
