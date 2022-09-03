<template>
  <div>
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
      <button @click="data.mode = data.mode === 'text' ? 'tree' : 'text'">
        切换模式
      </button>
      <button @click="data.readOnly = !data.readOnly">
        切换只读状态
      </button>
    </p>

    <br>
    <JsonEditorVue
      v-model="data.value" :mode.sync="data.mode"
      :readOnly="data.readOnly"
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

<script>
import JsonEditorVue from '../../src'

export default {
  components: { JsonEditorVue },
  data() {
    return {
      data: {
        value: undefined,
        mode: undefined,
        readOnly: false,
      },
    }
  },
}
</script>
