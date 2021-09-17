<template>
  <el-dialog
    modelValue
    :close-on-click-modal="false"
    :show-close="false"
    title="json-editor-vue"
    width="600px"
  >
    <JsonEditorVue v-model="value" v-bind="props"/>

    <h2>Value</h2>
    <JsonEditorVue :value="value"/>
    <el-button @click="set" type="primary" style="width:100%">编程式设值</el-button>

    <h2>Props</h2>
    <JsonEditorVue v-model="props"/>
  </el-dialog>
</template>

<script setup>
import { ref, reactive } from 'vue-demi'
import JsonEditorVue from '../src/main'

let value = reactive({
  a: 1
})
const props = reactive({
  readonly: false,
  vueJsonViewerProps: {
    boxed: false,
    copyable: {
      timeout: 0
    }
  }
})

function set () {
  value = {
    a: 3
  }
}
</script>

<style lang="scss" scoped>

</style>
