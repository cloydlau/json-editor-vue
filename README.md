# json-editor-vue

Fully configurable json editor & json viewer powered by [svelte-jsoneditor](https://github.com/josdejong/svelte-jsoneditor)
& [vue3-json-viewer](https://github.com/qiuquanwu/vue3-json-viewer)

<br>

## Features

- json编辑 + json预览
- v-model双绑
- 自动修复json字符串
- 适配 `element-ui` 的el-form组件，支持el-form的全局disabled
- 全局或局部引入，参数支持全局或局部配置

<br>

## Installation

![NPM](https://nodei.co/npm/json-editor-vue.png)

```bash
pnpm add json-editor-vue svelte-jsoneditor
```

```ts
// 全局引入

import 'json-editor-vue/dist/style.css'
import JsonEditorVue from 'json-editor-vue'

Vue.use(JsonEditorVue, {
  // 全局配置
})
```

```vue
<!-- 局部引入 -->

<template>
  <JsonEditorVue v-bind="props"/>
</template>

<script>
import 'json-editor-vue/dist/style.css'
import JsonEditorVue from 'json-editor-vue'

export default {
  components: { JsonEditorVue },
  data () {
    return {
      props: {
        // 局部配置
      }
    }
  }
}
</script>
```

<br>

## Props

| Attribute | Description | Type | Accepted Values | Default |
| --- | --- | --- | --- | --- |
| modelValue / v-model | 绑定值 | any | | |
| readonly | 是否只读 | boolean | | false |
| vueJsonViewerProps | props of [vue3-json-viewer](https://github.com/qiuquanwu/vue3-json-viewer) | object | | |
| ... | props of [svelte-jsoneditor](https://github.com/josdejong/svelte-jsoneditor/) | | | |

<br>

## Config rules

- 双向绑定参数（`v-model` / `modelValue`）仅支持局部配置
- 其余参数均支持全局或局部配置

权重：

- 局部配置高于全局配置
- 对于对象类型的参数，局部配置会与全局配置进行合并，同名属性会被局部配置覆盖
