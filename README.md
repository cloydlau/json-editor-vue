# json-editor-vue / JSON编辑器vue版

![preview](./preview.png)

<br/><br/>

### Features

- √ v-model双绑 用户输入、编程式设值都是响应式的
- √ 约定大于配置 同时提供options参数进行定制化混入
- √ 动态options options的变化有实时效果
- √ 失焦时自动修复、格式化json
- √ 全局安装/单独引入 通用参数支持全局配置

<br/><br/>

### Installation
![NPM](https://nodei.co/npm/json-editor-vue.png)
``` bash
$ yarn add json-editor-vue
```

**依赖项**：vue

**全局引入**
```js
import JsonEditorVue from 'json-editor-vue'
Vue.use(JsonEditorVue)
```

**局部引入**
```js
import { JsonEditorVue } from 'json-editor-vue'
components: { JsonEditorVue }
```

<br/><br/>

### Quick Start

```html
<json-editor-vue v-model="value" :options=""/>
```

| 参数 | 说明 | 是否支持全局配置 | 类型 | 可选值 | 默认值 |
| --- | --- | --- | --- | --- | --- |
| value / v-model | 数据对象 | | Object / Array | | |
| options | jsoneditor配置 | 支持 | Object | https://github.com/josdejong/jsoneditor/blob/master/docs/api.md | { mainMenuBar:false, navigationBar:false, statusBar:false, mode:'code' } |
