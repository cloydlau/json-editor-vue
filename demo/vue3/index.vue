<script setup lang="ts">
import { onMounted, reactive, ref, version } from 'vue'
import { parse, stringify } from 'lossless-json'
import type { Mode } from '../../src'
import JsonEditorVue from '../../src'

const LosslessJSONParser = {
  parse, /* : (json) => {    return JSON.parse(json, (k, v, { source }) =>
      (typeof source === 'number' && source > Number.MAX_SAFE_INTEGER)
        ? BigInt(source)
        : val,
    )
  } */
  stringify,
}

const data = reactive<{
  value: any
  mode?: Mode
  readOnly?: boolean
  parser?: { parse: (...args: any) => unknown, stringify: (...args: any) => unknown }
}>({
      value: {
        bigint: 124124124124124124124n,
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
      mode: 'text',
      readOnly: false,
      parser: LosslessJSONParser,
    })

const jsonEditorVueRef = ref()
onMounted(() => {
  jsonEditorVueRef.value.jsonEditor.focus()
})
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
    </p>

    <br>
    <JsonEditorVue
      ref="jsonEditorVueRef"
      v-model="data.value"
      v-model:mode="data.mode"
      :read-only="data.readOnly"
      :parser="data.parser"
    />

    <br>
    <p>Mode</p>
    {{ data.mode }}
    <p>Value</p>
    {{ LosslessJSONParser.stringify(data.value) }}
    <p>Type</p>
    {{ typeof data.value }}
  </div>
</template>
