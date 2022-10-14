<template>
  <div>
    <p>
      <button @click="data.value = '123'">
        设值为 string
      </button>
      <button @click="data.value = { abc: 124124124124124124124n }">
        设值为 JSON
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
      ref="jsonEditorVueRef" v-model="data.value" v-model:mode="data.mode"
      :readOnly="data.readOnly" :parser="data.parser"
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

<script setup lang="ts">
import { parse, stringify } from 'lossless-json'
import JsonEditorVue from '../../src'
import type { Mode } from '../../src'

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
  parser?: { parse: Function; stringify: Function }
}>({
  value: undefined,
  mode: undefined,
  readOnly: false,
  parser: LosslessJSONParser,
})

const jsonEditorVueRef = ref()
onMounted(() => {
  console.log(jsonEditorVueRef.value.jsonEditor.expand)
})
</script>
