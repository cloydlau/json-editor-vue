# json-editor-vue

支持 Vue 2.6 / 2.7 / 3 的 JSON 编辑器，基于 [svelte-jsoneditor](https://github.com/josdejong/svelte-jsoneditor)。

> svelte-jsoneditor 是 [jsoneditor](https://github.com/josdejong/jsoneditor) 的继任者，作者开这个新坑的原因是[老库已难以维护、架构需要大改、体验亟待提升](https://github.com/josdejong/jsoneditor/issues/1223) 。

🤹‍♂️ [在线预览](https://cloydlau.github.io/demo/json-editor-vue.html)

- 浅色主题

  ![./docs/jsoneditor_screenshot.png](https://raw.githubusercontent.com/josdejong/svelte-jsoneditor/main/misc/jsoneditor_tree_mode_screenshot.png)

- [暗色主题](#dark-theme)

  ![./dark-theme.png](./dark-theme.png)

<br>

## 特性

- Vue 2.6 / 2.7 / 3 通用
- 编辑模式双向绑定
- 局部注册 + 局部传参，也可以全局注册 + 全局传参（[vue-global-config](https://github.com/cloydlau/vue-global-config) 提供技术支持）

<br>

## 安装

### 外置依赖

- `vanilla-jsoneditor` svelte-jsoneditor 提供的原生包

<br>

### Vue 3

```sh
npm add json-editor-vue vanilla-jsoneditor
```

#### 全局注册

```ts
import { createApp } from 'vue'
import JsonEditorVue from 'json-editor-vue'

createApp()
  .use(JsonEditorVue, {
    // 全局 props & attrs（单向数据流）
  })
  .mount('#app')
```

#### 局部注册

```vue
<template>
  <JsonEditorVue v-model="value" v-bind="{/* 局部 props */}" />
</template>

<script setup>
import JsonEditorVue from 'json-editor-vue'

const value = ref()
</script>
```

#### 不使用打包工具 / CDN

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
      "json-editor-vue": "https://unpkg.com/json-editor-vue@0.6/dist/json-editor-vue.mjs"
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
npm add json-editor-vue vanilla-jsoneditor
```

#### 全局注册

```ts
import Vue from 'vue'
import JsonEditorVue from 'json-editor-vue'

Vue.use(JsonEditorVue, {
  // 全局 props & attrs（单向数据流）
})
```

#### 局部注册

```vue
<template>
  <JsonEditorVue v-model="value" v-bind="{/* 局部 props */}" />
</template>

<script setup>
import JsonEditorVue from 'json-editor-vue'

const value = ref()
</script>
```

#### 不使用打包工具 / CDN

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
      "json-editor-vue": "https://unpkg.com/json-editor-vue@0.6/dist/json-editor-vue.mjs"
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

### Vue 2.6 或更早版本

```sh
npm add json-editor-vue vanilla-jsoneditor @vue/composition-api
```

#### 全局注册

```ts
import Vue from 'vue'
import VCA from '@vue/composition-api'
import JsonEditorVue from 'json-editor-vue'

Vue.use(VCA)
Vue.use(JsonEditorVue, {
  // 全局 props & attrs（单向数据流）
})
```

#### 局部注册

```vue
<template>
  <JsonEditorVue v-model="value" v-bind="{/* 局部 props */}" />
</template>

<script>
import Vue from 'vue'
import VCA from '@vue/composition-api'
import JsonEditorVue from 'json-editor-vue'

Vue.use(VCA)

export default {
  components: { JsonEditorVue },
  date() {
    return {
      value: undefined,
    }
  },
}
</script>
```

#### 不使用打包工具 / CDN

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
      "json-editor-vue": "https://unpkg.com/json-editor-vue@0.6/dist/json-editor-vue.mjs"
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

| 参数名  | 说明                                                                                   | 类型               | 默认值   |
| ------- | -------------------------------------------------------------------------------------- | ------------------ | -------- |
| v-model | 绑定值                                                                                 | `any`              |          |
| mode    | 编辑模式，在 Vue 3 中使用 `v-model:mode`，在 Vue 2 中使用 `:mode.sync`                 | `'tree'`, `'text'` | `'tree'` |
| ...     | [svelte-jsoneditor](https://github.com/josdejong/svelte-jsoneditor/#properties) 的参数（通过 attrs） |                    |          |

### 布尔类型的 Attrs

`svelte-jsoneditor` 的布尔类型参数如 `readOnly` 不会隐式转换为 `true`，因为它们是 [attrs](https://vuejs.org/guide/components/attrs.html):

- ✔️ `<JsonEditorVue :readOnly="true" />`

- ❌ `<JsonEditorVue readOnly />`

<br>

## Expose

> 仅限 Vue 3，Vue 2 通过 `$refs` 能拿到所有的实例 property

| 名称       | 说明            | 类型   |
| ---------- | --------------- | ------ |
| jsonEditor | JSONEditor 实例 | object |

<br>

## 类型

```ts
type Mode = 'tree' | 'text'
```

<br>

<a name="dark-theme"></a>

## 暗色主题

```vue
<template>
  <JsonEditorVue class="jse-theme-dark" />
</template>

<script setup>
import 'vanilla-jsoneditor/themes/jse-theme-dark.css'
import JsonEditorVue from 'json-editor-vue'
</script>
```

<br>

## 更新日志

各版本详细改动请参考 [release notes](https://github.com/cloydlau/json-editor-vue/releases) 。

<br>

## 开发

**PR welcome!**

1. 安装 Deno
    - https://deno.land/#installation
    - https://x.deno.js.cn/#%E5%AE%89%E8%A3%85%E6%9C%80%E6%96%B0%E7%89%88

2. `npm add pnpm @cloydlau/scripts -g; pnpm i`

3. 启动

    - `pnpm dev3`
    - `pnpm dev2.7`
    - `pnpm dev2.6`

<br>
