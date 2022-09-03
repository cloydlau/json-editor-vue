<template>
  <p>
    <button @click="data.value = '123'">
      设值为 string
    </button>
    <button @click="data.value = { abc: '123' }">
      设值为 JSON
    </button>
    <button @click="data.value = undefined">
      清空
    </button>
    <button @click="toggleMode">
      切换模式
    </button>
    <button @click="data.props.readOnly = !data.props.readOnly">
      切换只读状态
    </button>
  </p>

  <br>
  <JsonEditorVue v-bind="data.props" ref="jsonEditorVueRef" v-model="data.value" />

  <br>
  <p>Mode</p>
  {{ jsonEditorVueRef?.mode }}
  <p>Value</p>
  {{ data.value }}
  <p>Type</p>
  {{ typeof data.value }}
</template>

<script setup>
import { onMounted, reactive, ref, watch } from 'vue'
import JsonEditorVue from '../../src'
const jsonEditorVueRef = ref()
const data = reactive({
  value: '123',
  props: {},
})

onMounted(() => {
  watch(() => jsonEditorVueRef.value.mode, (n) => {
    data.props.mode = n
  })
})

const toggleMode = () => {
  data.props.mode = jsonEditorVueRef.value.mode === 'text' ? 'tree' : 'text'
}
</script>
