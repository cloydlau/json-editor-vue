# json-editor-vue

JSON 编辑 & 预览，支持 Vue 2 和 Vue 3，基于 [svelte-jsoneditor](https://github.com/josdejong/svelte-jsoneditor)
& [vue-json-viewer](https://github.com/chenfengjw163/vue-json-viewer)

> svelte-jsoneditor 是 [jsoneditor](https://github.com/josdejong/jsoneditor) 作者带来的全新 JSON 编辑器。
> 作者开这个新坑的原因是[老库已难以维护、架构需要大改、体验亟待提升](https://github.com/josdejong/jsoneditor/issues/1223) 。json-editor-vue 是 svelte-jsoneditor 的 Vue 版本。

<br>

## 特性

- JSON 编辑 + JSON 预览
- 同时支持 `Vue 2` & `Vue 3`
- 支持 `v-model`
- 自动修复格式错误的 JSON 字符串
- 适配 [element-plus](https://github.com/element-plus/element-plus) & [element-ui](https://github.com/ElemeFE/element) （只读状态默认跟随 `el-form`）
- 全局或局部引入，参数支持全局或局部配置

<br>

## 安装

![NPM](https://nodei.co/npm/json-editor-vue.png)

### Vue3

```bash
npm add json-editor-vue svelte-jsoneditor
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
  <JsonEditorVue v-model="value" v-bind="{/* 局部配置 */}"/>
</template>

<script setup>
import JsonEditorVue from 'json-editor-vue'
</script>
```

### Vue2

```bash
npm add json-editor-vue svelte-jsoneditor @vue/composition-api
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
  <JsonEditorVue :modelValue.sync="value" v-bind="{/* 局部配置 */}"/>
</template>

<script>
import JsonEditorVue from 'json-editor-vue'

export default {
  components: { JsonEditorVue },
}
</script>
```

<br>

## 参数

| 参数名 | 说明 | 类型 | 可接受值 | 默认值 |
| --- | --- | --- | --- | --- |
| v-model / modelValue | 绑定值 | `any` | | |
| readonly | 是否只读 | boolean | | `false` |
| readonlyOptions | [vue-json-viewer](https://github.com/chenfengjw163/vue-json-viewer) 的参数 | object | | |
| ... | props of [svelte-jsoneditor](https://github.com/josdejong/svelte-jsoneditor/) 的参数 | | | |

<br>

## 配置规则

- 双向绑定参数（`v-model` / `modelValue`）仅支持局部配置
- 其余参数均支持全局或局部配置

权重：

- 局部配置高于全局配置
- 对于对象类型的参数，局部配置会与全局配置进行合并，同名属性会被局部配置覆盖
