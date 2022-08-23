# json-editor-vue

支持 Vue 2.6 / 2.7 / 3 的 JSON 编辑器，基于 [svelte-jsoneditor](https://github.com/josdejong/svelte-jsoneditor)。

> svelte-jsoneditor 是 [jsoneditor](https://github.com/josdejong/jsoneditor) 作者带来的全新 JSON 编辑器。作者开这个新坑的原因是[老库已难以维护、架构需要大改、体验亟待提升](https://github.com/josdejong/jsoneditor/issues/1223) 。json-editor-vue 是 svelte-jsoneditor 的 Vue 版本。

![jsoneditor_screenshot](./jsoneditor_screenshot.png)

🤹‍♂️ [在线预览](https://cloydlau.github.io/demo/json-editor-vue.html)

<br>

## 特性

- Vue 2.6 / 2.7 / 3 通用
- 局部注册 + 局部传参，也可以全局注册 + 局部传参（[vue-global-config](https://github.com/cloydlau/vue-global-config) 提供技术支持）

<br>

## 安装

![NPM](https://nodei.co/npm/json-editor-vue.png)

### Vue 3

```sh
npm add vanilla-jsoneditor json-editor-vue
```

#### 全局引入

```ts
import JsonEditorVue from 'json-editor-vue'

app.use(JsonEditorVue, {
  // 全局配置
})
```

#### 局部引入

```vue
<template>
  <JsonEditorVue v-model="value" v-bind="{/* 局部配置 */}" />
</template>

<script setup>
import JsonEditorVue from 'json-editor-vue'
</script>
```

#### 不使用打包工具 / CDN 引入

```html
<div id="app">
  <json-editor-vue v-model="value"></json-editor-vue>
  <p v-text="value"></p>
</div>

<script type="importmap">
  {
    "imports": {
      "vue": "https://unpkg.com/vue/dist/vue.esm-browser.prod.js",
      "vue-demi": "https://unpkg.com/vue-demi/lib/v3/index.mjs",
      "vanilla-jsoneditor": "https://unpkg.com/vanilla-jsoneditor",
      "json-editor-vue": "https://unpkg.com/json-editor-vue@0.5/dist/json-editor-vue.mjs"
    }
  }
</script>
<script type="module">
  import { createApp, ref } from 'vue'
  import JsonEditorVue from 'json-editor-vue'

  createApp({
    setup: () => ({
      value: ref()
    })
  })
    .use(JsonEditorVue)
    .mount('#app')
</script>
```

<br>

### Vue 2.7

```sh
npm add vanilla-jsoneditor json-editor-vue
```

#### 全局引入

```ts
import JsonEditorVue from 'json-editor-vue'

Vue.use(JsonEditorVue, {
  // 全局配置
})
```

#### 局部引入

```vue
<template>
  <JsonEditorVue v-model="value" v-bind="{/* 局部配置 */}" />
</template>

<script setup>
import JsonEditorVue from 'json-editor-vue'
</script>
```

#### 不使用打包工具 / CDN 引入

```html
<div id="app">
  <json-editor-vue v-model="value"></json-editor-vue>
  <p v-text="value"></p>
</div>

<script type="importmap">
  {
    "imports": {
      "vue": "https://unpkg.com/vue@2/dist/vue.esm.browser.min.js",
      "vue-demi": "https://unpkg.com/vue-demi/lib/v2.7/index.mjs",
      "vanilla-jsoneditor": "https://unpkg.com/vanilla-jsoneditor",
      "json-editor-vue": "https://unpkg.com/json-editor-vue@0.5/dist/json-editor-vue.mjs"
    }
  }
</script>
<script type="module">
  import Vue from 'vue'
  import JsonEditorVue from 'json-editor-vue'

  new Vue({
    components: { JsonEditorVue },
    data() {
      return {
        value: undefined,
      }
    },
  })
    .$mount('#app')
</script>
```

<br>

### Vue 2.6 or earlier

```sh
npm add @vue/composition-api vanilla-jsoneditor json-editor-vue
```

#### 全局引入

```ts
import VCA from '@vue/composition-api'
import JsonEditorVue from 'json-editor-vue'

Vue.use(VCA)
Vue.use(JsonEditorVue, {
  // 全局配置
})
```

#### 局部引入

```vue
<template>
  <JsonEditorVue v-model="value" v-bind="{/* 局部配置 */}" />
</template>

<script>
import VCA from '@vue/composition-api'
import JsonEditorVue from 'json-editor-vue'

Vue.use(VCA)

export default {
  components: { JsonEditorVue },
}
</script>
```

#### 不使用打包工具 / CDN 引入

> 由于 `vanilla-jsoneditor` 没有提供 UMD 导出，这样用会有点绕。

```html
<div id="app">
  <json-editor-vue v-model="value"></json-editor-vue>
  <p v-text="value"></p>
</div>

<script>
  window.process = { env: { NODE_ENV: 'production' } }
</script>
<script type="importmap">
  {
    "imports": {
      "vue": "https://unpkg.com/vue@2.6/dist/vue.esm.browser.min.js",
      "@vue/composition-api": "https://unpkg.com/@vue/composition-api/dist/vue-composition-api.mjs",
      "@vue/composition-api/dist/vue-composition-api.mjs": "https://unpkg.com/@vue/composition-api/dist/vue-composition-api.mjs",
      "vue-demi": "https://unpkg.com/vue-demi/lib/v2/index.mjs",
      "vanilla-jsoneditor": "https://unpkg.com/vanilla-jsoneditor",
      "json-editor-vue": "https://unpkg.com/json-editor-vue@0.5/dist/json-editor-vue.mjs"
    }
  }
</script>
<script type="module">
  import { createApp, ref } from '@vue/composition-api'
  import JsonEditorVue from 'json-editor-vue'

  const app = createApp({
    setup: () => ({
      value: ref()
    })
  })
  app.use(JsonEditorVue)
  app.mount('#app')
</script>
```

<br>

## Props

| 参数名  | 说明                                                                      | 类型 |
| ------- | ------------------------------------------------------------------------- | ---- |
| v-model | 绑定值                                                                    | any  |
| ...     | [svelte-jsoneditor](https://github.com/josdejong/svelte-jsoneditor/) 参数 |

<br>

## Expose

> 仅限 Vue 3，Vue 2 通过 `$refs` 能拿到所有的实例 property

| 名称       | 说明                | 类型   |
| ---------- | ------------------- | ------ |
| jsonEditor | JSONEditor instance | object |

<br>

## 配置规则

- 双向绑定参数（`v-model` / `modelValue` / `value`）仅支持局部配置
- 其余参数均支持全局或局部配置

权重：

- 局部配置高于全局配置
- 对于对象类型的参数，局部配置会与全局配置进行合并，同名属性会被局部配置覆盖
