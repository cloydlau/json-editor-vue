# json-editor-vue

JSON 编辑器，支持 Vue 2 和 Vue 3，基于 [svelte-jsoneditor](https://github.com/josdejong/svelte-jsoneditor)

> svelte-jsoneditor 是 [jsoneditor](https://github.com/josdejong/jsoneditor) 作者带来的全新 JSON 编辑器。
> 作者开这个新坑的原因是[老库已难以维护、架构需要大改、体验亟待提升](https://github.com/josdejong/jsoneditor/issues/1223) 。json-editor-vue 是
> svelte-jsoneditor 的 Vue 版本。

<br>

## 特性

- Vue 2 & Vue 3 通用
- 支持 `v-model`
- 全局或局部引入，参数支持全局或局部配置（[vue-global-config](https://github.com/cloydlau/vue-global-config.git) 提供技术支持）

<br>

## 安装

![NPM](https://nodei.co/npm/json-editor-vue.png)

### Vue 3

```bash
npm add json-editor-vue
```

```ts
// 全局引入

import JsonEditorVue from 'json-editor-vue'

app.use(JsonEditorVue, {
  // 全局配置
})
```

```vue
<!-- 局部引入 -->

<template>
  <JsonEditorVue v-model="value" v-bind="{/* 局部配置 */}"/>
</template>

<script setup>
import JsonEditorVue from 'json-editor-vue'
</script>
```

### Vue 2

```bash
# vue@2.6 或更早版本需要额外安装 @vue/composition-api
npm add json-editor-vue
```

```ts
// 全局引入

// vue@2.6 或更早版本需要额外安装 @vue/composition-api
// import VCA from '@vue/composition-api'
// Vue.use(VCA)

import JsonEditorVue from 'json-editor-vue'

Vue.use(JsonEditorVue, {
  // 全局配置
})
```

```vue
<!-- 局部引入 -->

<template>
  <JsonEditorVue v-model="value" v-bind="{/* 局部配置 */}"/>
</template>

<script>
// vue@2.6 或更早版本需要额外安装 @vue/composition-api
// import VCA from '@vue/composition-api'
// Vue.use(VCA)

import JsonEditorVue from 'json-editor-vue'

export default {
  components: { JsonEditorVue },
}
</script>
```

<br>

## 参数

| 参数名 | 说明 | 类型  |
| --- | --- |-----|
| v-model / value | 绑定值 | any |
| ... | [svelte-jsoneditor](https://github.com/josdejong/svelte-jsoneditor/) 参数 |

<br>

## 配置规则

- 双向绑定参数（`v-model` / `modelValue` / `value`）仅支持局部配置
- 其余参数均支持全局或局部配置

权重：

- 局部配置高于全局配置
- 对于对象类型的参数，局部配置会与全局配置进行合并，同名属性会被局部配置覆盖
