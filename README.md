# json-editor-vue / JSON编辑器vue版

### Features

- √ json编辑 + json预览
- √ v-model双绑 用户输入、编程式设值都是响应式的
- √ 约定大于配置 同时提供options参数进行定制化混入
- √ 动态options options的变化有实时效果
- √ 失焦时自动修复、格式化json
- √ 适配element-ui的el-form组件 支持el-form的全局disabled
- √ 全局安装/单独引入 通用参数支持全局配置

<br/>

### Installation
![NPM](https://nodei.co/npm/json-editor-vue.png)
``` bash
$ yarn add json-editor-vue
```

**依赖项**：vue

```js
import JsonEditorVue from 'json-editor-vue'

// 组件内引入
components: { JsonEditorVue }
// ≤0.0.4（deprecated）
components: { JsonEditorVue.JsonEditorVue }

// 全局引入
Vue.use(JsonEditorVue)
```

<br/>

### Quick Start

```html
<json-editor-vue v-model="value" :options=""/>
```

| Attribute | Description | Way Of Configuration | Type | Accepted Values | Default |
| --- | --- | --- | --- | --- | --- |
| value / v-model | 数据对象 | prop | object / array | | |
| options | jsoneditor配置 | global, prop | object | https://github.com/josdejong/jsoneditor | *详见后文 |
| vueJsonViewerProps | vue-json-viewer配置 | global, prop | object | https://github.com/chenfengjw163/vue-json-viewer| *详见后文 |
| disabled | 是否禁用 | global, prop | boolean | | false |

options默认值：

```
{ 
  mainMenuBar:false, 
  navigationBar:false, 
  statusBar:false, 
  mode:'code' 
}
```

vueJsonViewerProps默认值：

```
{
  copyable: { copyText: '复制', copiedText: '已复制', timeout: 2000 },
  boxed: true,
  previewMode: true,
}
```
