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

<br>

## Features

- Support both Vue 2 & Vue 3
- Support `v-model`
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
// import globally

import JsonEditorVue from 'json-editor-vue'

app.use(JsonEditorVue, {
  // global config
})
```

```vue
<!-- import locally -->

<template>
  <JsonEditorVue v-model="value" v-bind="{/* local config */}"/>
</template>

<script setup>
import JsonEditorVue from 'json-editor-vue'
</script>
```

<br>

### Vue 2

```bash
# Vue version before 2.7 should add an extra @vue/composition-api
npm add json-editor-vue
```

```ts
// import globally

// Vue version before 2.7 should add an extra @vue/composition-api
// import VCA from '@vue/composition-api'
// Vue.use(VCA)

import JsonEditorVue from 'json-editor-vue'

Vue.use(JsonEditorVue, {
  // global config
})
```

```vue
<!-- import locally -->

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

<br>

## Props

| Name            | Description                                                                     | Type |
|-----------------|---------------------------------------------------------------------------------|-----|
| v-model / value | binding value                                                                   | any |
| ...             | options of [svelte-jsoneditor](https://github.com/josdejong/svelte-jsoneditor/) |     |

<br>

## Config rules

- Props of two-way data binding ( `v-model` / `modelValue` / `value` ) only support local config.
- All other props support both local and global config.

Priority:

- Local config is higher than global config.
- For object type, global config will be merged into local config.
