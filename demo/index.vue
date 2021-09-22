<template>
  <el-dialog
    modelValue
    :close-on-click-modal="false"
    :show-close="false"
    title="json-editor-vue"
    width="600px"
  >
    <el-form :model="data">
      <el-form-item prop="value">
        <JsonEditorVue
          v-model="data.value"
          v-bind="data.props"
        />
      </el-form-item>
    </el-form>

    <p>Value</p>
    <JsonEditorVue
      :modelValue="data.value"
      readonly
      v-bind.sync="data.props"
    />
    <el-button @click="set" type="primary" style="width:100%">
      编程式设值
    </el-button>

    <p>Props</p>
    <JsonEditorVue
      v-model="data.props"
    />
  </el-dialog>
</template>

<script setup>
import { reactive } from 'vue-demi'
import JsonEditorVue from '../src/main'

let data = reactive({
  value: 123,
  props: {
    readonly: false,
    readonlyOptions: {
      boxed: true,
      copyable: {
        timeout: 1,
      }
    }
  }
})

function set () {
  data.value = 321
}
</script>

<style lang="scss" scoped>

</style>
