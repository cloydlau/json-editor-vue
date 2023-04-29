<template>
  <div>
    <h1>vue@{{ version }}</h1>
    <p>
      <button @click="value = '123'">
        设值为 string
      </button>
      <button @click="value = { abc: '123' }">
        设值为 JSON
      </button>
      <button @click="value = undefined">
        清空
      </button>
      <button @click="mode = mode === 'text' ? 'tree' : 'text'">
        切换模式
      </button>
      <button @click="readOnly = !readOnly">
        切换只读状态
      </button>
    </p>

    <br>
    <JsonEditorVue
      ref="jsonEditorVueRef"
      v-model="value"
      :mode.sync="mode"
      :readOnly="readOnly"
    />

    <br>
    <p>Mode</p>
    {{ mode }}
    <p>Value</p>
    {{ value }}
    <p>Type</p>
    {{ typeof value }}
  </div>
</template>

<script>
import Vue from 'vue'
import VueCompositionAPI from '@vue/composition-api'
import JsonEditorVue from '../../src'

Vue.use(VueCompositionAPI)

export default {
  components: { JsonEditorVue },
  data() {
    return {
      version: Vue.version,
      value: undefined,
      mode: undefined,
      readOnly: false,
    }
  },
  mounted() {
    console.log('expand: ', this.$refs.jsonEditorVueRef.jsonEditor.expand)
  },
}
</script>
