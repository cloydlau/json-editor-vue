# json-editor-vue

Optionated json editor & json viewer powered by [svelte-jsoneditor](https://github.com/josdejong/svelte-jsoneditor)
& [vue-json-viewer](https://github.com/chenfengjw163/vue-json-viewer)

<br>

## Features

- √ json编辑 + json预览
- √ v-model双绑
- √ 适配 `element-ui` 的el-form组件 支持el-form的全局disabled
- √ 全局或局部引入 参数支持全局或局部配置

<br>

## Installation

![NPM](https://nodei.co/npm/json-editor-vue.png)

**Dependencies**：vue

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
  <JsonEditorVue v-bind="config"/>
</template>

<script>
import 'json-editor-vue/dist/style.css'
import JsonEditorVue from 'json-editor-vue'

export default {
  components: { JsonEditorVue },
  data () {
    return {
      config: {
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
| value / v-model | 数据对象 | object / array / undefined / null / | | |
| readonly | 是否只读 | boolean | | false |
| vueJsonViewerProps | vue-json-viewer props | object | [vue-json-viewer](https://github.com/chenfengjw163/vue-json-viewer) | *see below* |
| ... | svelte-jsoneditor props | object | [svelte-jsoneditor](https://github.com/josdejong/svelte-jsoneditor/) | *see below* |

### Default props for svelte-jsoneditor

```
{ 
  mainMenuBar: false,
  mode: 'code',
}
```
### Default props for vue-json-viewer

```
{
  expanded: false,
  sort: false,
  expandDepth: 1,
  copyable: { copyText: '复制', copiedText: '已复制', timeout: 2000 },
  boxed: true,
  previewMode: true,
}
```

<br>

## Config rules

- 双向绑定参数（`v-model` / `value` / `*.sync`）仅支持局部配置
- 其余参数均支持全局或局部配置

权重：

- 局部配置高于全局配置
- 对于对象类型的参数 局部配置会与全局配置进行合并 同名属性会被局部配置覆盖
