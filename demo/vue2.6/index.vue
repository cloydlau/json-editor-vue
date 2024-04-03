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
      data: {
        value: {
          // bigint: 124124124124124124124n,
          boolean: true,
          string: 'Hello World',
          number: 123.456,
          color: '#b0a4e3',
          null: null,
          time: 1575599819000,
          array: [1, 2],
          object: {
            a: 'b',
            c: 'd',
          },
        },
      },
      mode: undefined,
      readOnly: false,
    }
  },
  mounted() {
    console.log('expand: ', this.$refs.jsonEditorVueRef.jsonEditor.expand)
  },
  methods: {
    onInput(data) {
      console.log('onInput: ', data)
    }
  },
}
</script>

<template>
  <div>
    <h1>vue@{{ version }}</h1>
    <p>
      <button @click="data.value = Math.random()">
        设值为 string
      </button>
      <button @click="data.value = { abc: Math.random() }">
        设值为 JSON
      </button>
      <button @click="data.value.number = Math.random()">
        改变属性
      </button>
      <button @click="data.value = undefined">
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
      v-model="data.value"
      :mode.sync="mode"
      :readOnly="readOnly"
      @input="onInput"
    />

    <br>
    <p>Mode</p>
    {{ mode }}
    <p>Value</p>
    {{ data.value }}
    <p>Type</p>
    {{ typeof data.value }}
  </div>
</template>
