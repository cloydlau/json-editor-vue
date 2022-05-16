<template>
  <el-form :model="data" disabled ref="formRef">
    <el-form-item prop="value" required>
      <JsonEditorVue v-model="data.value" v-bind="data.props" />
    </el-form-item>
  </el-form>
  <br>
  <p>Value</p>
  <p>{{ JSON.stringify(data.value) }}</p>
  <p>
    <button @click="data.props.mode = data.props.mode === 'code' ? 'tree' : 'code'">切换模式</button>
    <button @click="data.props.readOnly = !data.props.readOnly">切换只读</button>
    <button @click="data.value = 321">编程式设值</button>
    <button @click="data.value = null">清空</button>
    <button @click="() => { formRef.validate() }">校验</button>
  </p>

  <br>
  <p>Props</p>
  <JsonEditorVue v-model="data.props" />
</template>

<script setup>
import { ref, reactive } from 'vue'
import JsonEditorVue from '../../src'

const formRef = ref()

let data = reactive({
  value: '123',
  props: {}
})
</script>
