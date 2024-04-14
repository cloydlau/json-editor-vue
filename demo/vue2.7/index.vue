<script setup>
import { onMounted, reactive, ref, version } from 'vue'
import JsonEditorVue from '../../src'

const data = reactive({
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
  mode: undefined,
  readOnly: false,
})

const jsonEditorVueRef = ref()

onMounted(() => {
  console.log('expand: ', jsonEditorVueRef.value.jsonEditor.expand)
})
const stringified = ref(true)
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
      <button @click="data.mode = data.mode === 'text' ? 'tree' : 'text'">
        切换模式
      </button>
      <button @click="data.readOnly = !data.readOnly">
        切换只读状态
      </button>
      <input
        id="enable-stringified"
        v-model="stringified"
        type="checkbox"
      >
      <label for="enable-stringified">enable stringified</label>
    </p>

    <br>
    <JsonEditorVue
      ref="jsonEditorVueRef"
      v-model="data.value"
      :mode.sync="data.mode"
      :read-only="data.readOnly"
      :stringified="stringified"
    />

    <br>
    <p>Mode</p>
    {{ data.mode }}
    <p>Value</p>
    {{ data.value }}
    <p>Type</p>
    {{ typeof data.value }}
  </div>
</template>
