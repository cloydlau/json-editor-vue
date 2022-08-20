<template>
  <p>
    <button
      @click="data.props.mode = data.props.mode === 'text' ? 'tree' : 'text'"
    >
      切换编辑模式
    </button>
    <button @click="data.props.readOnly = !data.props.readOnly">
      切换只读状态
    </button>
    <button @click="data.value = '321'">
      编程式设值（字符串）
    </button>
    <button @click="data.value = { a: 1 }">
      编程式设值（JSON）
    </button>
    <button @click="data.value = undefined">
      清空
    </button>
    <button @click="() => { formRef.validate() }">
      校验
    </button>
  </p>

  <br>
  <el-form ref="formRef" :model="data" disabled>
    <el-form-item prop="value" required>
      <JsonEditorVue v-model="data.value" v-bind="data.props" />
    </el-form-item>
  </el-form>

  <br>
  <p>Value</p>
  {{ data.value }}
</template>

<script setup>
import { reactive, ref } from 'vue'
import JsonEditorVue from '../../src'

const formRef = ref()

const data = reactive({
  value: '123',
  props: {},
})
</script>
