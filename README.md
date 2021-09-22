# json-editor-vue

JSON editor & viewer powered
by [svelte-jsoneditor](https://github.com/josdejong/svelte-jsoneditor)
& [vue-json-viewer](https://github.com/chenfengjw163/vue-json-viewer)

> svelte-jsoneditor是 [jsoneditor](https://github.com/josdejong/jsoneditor) 作者带来的全新JSON编辑器。
> 作者开这个新坑的原因是老库已难以维护、架构需要大改、体验亟待提升。json-editor-vue是svelte-jsoneditor的Vue版本。

<br>

## Features

- 同时支持Vue3 & Vue2
- json编辑 + json预览
- 双向绑定输入值
- 自动修复格式错误的json字符串
- 适配 `element-plus` & `element-ui`（禁用状态默认跟随 `el-form`）
- 全局或局部引入，参数支持全局或局部配置

<br>

## Installation

![NPM](https://nodei.co/npm/json-editor-vue.png)

### Vue3

```bash
pnpm add json-editor-vue svelte-jsoneditor
```

```ts
// 全局引入

import JsonEditorVue from 'json-editor-vue'

createApp(App)
.use(JsonEditorVue, {
  // 全局配置
})
```

```vue
<!-- 局部引入 -->

<template>
  <JsonEditorVue
    v-model="value"
    v-bind="{/* 局部配置 */}"
  />
</template>

<script setup>
import JsonEditorVue from 'json-editor-vue'
</script>
```

### Vue2

```bash
pnpm add json-editor-vue svelte-jsoneditor @vue/composition-api
```

```ts
// 全局引入

import JsonEditorVue from 'json-editor-vue'

Vue.use(JsonEditorVue, {
  // 全局配置
})
```

```vue
<!-- 局部引入 -->

<template>
  <JsonEditorVue v-bind="{/* 局部配置 */}"/>
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
| modelValue / v-model | 绑定值 | any | | |
| readonly | 是否只读 | boolean | | false |
| readonlyOptions | props of [vue-json-viewer](https://github.com/chenfengjw163/vue-json-viewer) | object | | |
| ... | props of [svelte-jsoneditor](https://github.com/josdejong/svelte-jsoneditor/) | | | |

<br>

## Config rules

- 双向绑定参数（`v-model` / `modelValue`）仅支持局部配置
- 其余参数均支持全局或局部配置

权重：

- 局部配置高于全局配置
- 对于对象类型的参数，局部配置会与全局配置进行合并，同名属性会被局部配置覆盖
