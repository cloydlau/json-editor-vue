English | [简体中文](./docs/README.zh-CN.md)

# json-editor-vue

JSON editor & viewer for Vue 2 and 3 powered
by [svelte-jsoneditor](https://github.com/josdejong/svelte-jsoneditor)
& [vue-json-viewer](https://github.com/chenfengjw163/vue-json-viewer)

> svelte-jsoneditor is a brand new JSON editor created by the same author of [jsoneditor](https://github.com/josdejong/jsoneditor)
> which ['has become hard to maintain, and the architecture needed a big overhaul'](https://github.com/josdejong/jsoneditor/issues/1223).
> json-editor-vue is the Vue version for svelte-jsoneditor.

<br>

## Features

- JSON editing + JSON viewing
- Support both `Vue2` & `Vue3`
- Support `v-model`
- Repair malformed JSON strings automatically
- [element-plus](https://github.com/element-plus/element-plus) & [element-ui](https://github.com/ElemeFE/element) adaptable ( `readonly` status goes with `el-form` by default )
- Import locally or globally, config locally or globally

<br>

## Installation

![NPM](https://nodei.co/npm/json-editor-vue.png)

### Vue3

```bash
npm add json-editor-vue svelte-jsoneditor
```

```ts
// import globally

import JsonEditorVue from 'json-editor-vue'

createApp(App)
.use(JsonEditorVue, {
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

### Vue2

```bash
npm add json-editor-vue svelte-jsoneditor @vue/composition-api
```

```ts
// import globally

import JsonEditorVue from 'json-editor-vue'

Vue.use(JsonEditorVue, {
  // global config
})
```

```vue
<!-- import locally -->

<template>
  <JsonEditorVue :modelValue.sync="value" v-bind="{/* local config */}"/>
</template>

<script>
import JsonEditorVue from 'json-editor-vue'

export default {
  components: { JsonEditorVue },
}
</script>
```

<br>

## Props

| Attribute | Description | Type | Accepted Values | Default |
| --- | --- | --- | --- | --- |
| v-model / modelValue | binding value | any | | |
| readonly | whether JsonEditorVue is readonly | boolean | | false |
| readonlyOptions | props of [vue-json-viewer](https://github.com/chenfengjw163/vue-json-viewer) | object | | |
| ... | props of [svelte-jsoneditor](https://github.com/josdejong/svelte-jsoneditor/) | | | |

<br>

## Config rules

- Props of two-way data binding ( `v-model` / `modelValue` ) only support local config.
- All other props support both local and global config.

Priority:

- Local config is higher than global config.
- For object type, global config will be merged into local config.
