# json-editor-vue

## Features

- √ json编辑 + json预览
- √ v-model双绑 用户输入、编程式设值都是响应式的
- √ 约定大于配置 同时提供props参数进行定制化混入
- √ 适配element-ui的el-form组件 支持el-form的全局disabled
- √ 全局引入/局部引入 通用参数支持全局配置

<br/>

## Installation

![NPM](https://nodei.co/npm/json-editor-vue.png)

``` bash
$ yarn add json-editor-vue
```

**依赖项**：vue

```vue

<script>
// 局部引入
import JsonEditorVue from 'json-editor-vue'

export default {
  components: { JsonEditorVue }
}
</script>
```

```js
// 全局引入
import JsonEditorVue from 'json-editor-vue'

Vue.use(JsonEditorVue)
```

<br/>

## Quick Start

```html

<json-editor-vue v-model="value" :options=""/>
```

| Attribute | Description | Configuration Mode | Type | Accepted Values | Default |
| --- | --- | --- | --- | --- | --- |
| value / v-model | 数据对象 | prop | object / array | | |
| props* | svelte-jsoneditor配置 | global, prop | object | https://github.com/josdejong/svelte-jsoneditor/ | |
| vueJsonViewerProps* | vue-json-viewer配置 | global, prop | object | https://github.com/chenfengjw163/vue-json-viewer| |
| disabled | 是否禁用 | global, prop | boolean | | false |

### props默认值

```
{ 
  mainMenuBar:false, 
  navigationBar:false, 
  statusBar:false, 
  mode:'code' 
}
```

### vueJsonViewerProps默认值

```
{
  copyable: { copyText: '复制', copiedText: '已复制', timeout: 2000 },
  boxed: true,
  previewMode: true,
}
```
