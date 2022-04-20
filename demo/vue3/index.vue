<template>
  <el-form :model="data" disabled ref="formRef">
    <el-form-item prop="value" required>
      <json-editor-vue v-model="data.value" v-bind="data.props"/>
    </el-form-item>
  </el-form>
  <br>
  <p>Value</p>
  <p>{{ JSON.stringify(data.value) }}</p>
  <p>
    <button @click="data.value = 321">编程式设值</button>
    <button @click="() => { formRef.validate() }">校验</button>
  </p>

  <br>
  <p>Props</p>
  <json-editor-vue v-model="data.props"/>
</template>

<script setup>
import { ref, reactive } from 'vue'
import JsonEditorVue from '../../src'

const formRef = ref()

let data = reactive({
  value: 123,
  props: {
    mode: 'tree',
    //readOnly: false,
  }
})
</script>
