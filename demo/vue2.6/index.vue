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
      ref="jsonEditorVueRef" v-model="data.value" :mode.sync="data.mode"
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

<script lang="ts">
import VueCompositionAPI from '@vue/composition-api'
import JsonEditorVue from '../../src'
import type { Mode } from '../../src'

Vue.use(VueCompositionAPI)

let hasSetup = false

export default {
  components: { JsonEditorVue },
  setup: () => {
    if (hasSetup) {
      return
    } else {
      hasSetup = true
    }

    const jsonEditorVueRef = ref()
    const data = reactive<{
      value: any
      mode?: Mode
      readOnly: boolean
    }>({
      value: undefined,
      mode: undefined,
      readOnly: false,
    })

    onMounted(() => {
      console.log(jsonEditorVueRef.value)
    })

    return {
      jsonEditorVueRef,
      data,
    }
  },
  mounted() {
    console.log(this.$refs.jsonEditorVueRef.jsonEditor.expand)
  },
}
</script>
