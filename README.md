English | [简体中文](./docs/README.zh-CN.md)

# json-editor-vue

JSON editor for Vue 2 and 3 powered
by [svelte-jsoneditor](https://github.com/josdejong/svelte-jsoneditor)

> svelte-jsoneditor is a brand new JSON editor created by the same author
> of [jsoneditor](https://github.com/josdejong/jsoneditor)
> which
> ['has become hard to maintain, and the architecture needed a big overhaul'](https://github.com/josdejong/jsoneditor/issues/1223)
> .
> json-editor-vue is the Vue version for svelte-jsoneditor.

![jsoneditor_screenshot](./docs/jsoneditor_screenshot.png)

<br>

## Features

- Support both Vue 2 & 3
- Import locally or globally, config locally or globally (Powered
  by [vue-global-config](https://github.com/cloydlau/vue-global-config.git))

<br>

## Installation

![NPM](https://nodei.co/npm/json-editor-vue.png)

### Vue 3

```bash
npm add json-editor-vue
```

```ts
// Import globally

import JsonEditorVue from 'json-editor-vue'

app.use(JsonEditorVue, {
  // global config
})
```

```vue
<!-- Import locally -->

<template>
  <JsonEditorVue v-model="value" v-bind="{/* local config */}"/>
</template>

<script setup>
import JsonEditorVue from 'json-editor-vue'
</script>
```

```html
<!-- Without Build Tools -->

<div id="app">
  <json-editor-vue v-model="data"></json-editor-vue>
  <p><button onclick="console.log(app.data)">print data</button></p>
</div>

<script src="https://unpkg.com/vue"></script>
<script src="https://unpkg.com/vue-demi"></script>
<script src="https://unpkg.com/json-editor-vue/dist/json-editor-vue.umd.js"></script>
<script>
const { createApp } = Vue
const app = createApp({
  components: { 'json-editor-vue': window['json-editor-vue'].default },
  data() {
    return {
      data: 'initial data'
    }
  },
}).mount('#app')
</script>
```

<br>

### Vue 2

```bash
# Vue version before 2.7 should add an extra @vue/composition-api
npm add json-editor-vue
```

```ts
// Import globally

// Vue version before 2.7 should add an extra @vue/composition-api
// import VCA from '@vue/composition-api'
// Vue.use(VCA)

import JsonEditorVue from 'json-editor-vue'

Vue.use(JsonEditorVue, {
  // global config
})
```

```vue
<!-- Import locally -->

<template>
  <JsonEditorVue v-model="value" v-bind="{/* local config */}"/>
</template>

<script>
// Vue version before 2.7 should add an extra @vue/composition-api
// import VCA from '@vue/composition-api'
// Vue.use(VCA)

import JsonEditorVue from 'json-editor-vue'

export default {
  components: { JsonEditorVue },
}
</script>
```

```html
<!-- Without Build Tools -->

<div id="app">
  <json-editor-vue v-model="data"></json-editor-vue>
  <p><button onclick="console.log(app.data)">print data</button></p>
</div>
<script src="https://unpkg.com/vue@2"></script>
<script src="https://unpkg.com/@vue/composition-api"></script>
<script src="https://unpkg.com/vue-demi"></script>
<script src="https://unpkg.com/json-editor-vue/dist/json-editor-vue.umd.js"></script>
<script>
const app = new Vue({
  components: { 'json-editor-vue': window['json-editor-vue'].default },
  data() {
    return {
      data: 'initial data'
    }
  },
}).$mount('#app')
</script>
```

<br>

## Props

| Name            | Description                                                                     | Type |
| --------------- | ------------------------------------------------------------------------------- | ---- |
| v-model / value | binding value                                                                   | any  |
| ...             | options of [svelte-jsoneditor](https://github.com/josdejong/svelte-jsoneditor/) |      |

<br>

## Config rules

- Props of two-way data binding ( `v-model` / `modelValue` / `value` ) only support local config.
- All other props support both local and global config.

Priority:

- Local config is higher than global config.
- For object type, global config will be merged into local config.
