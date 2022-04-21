<template>
  <div>
    <el-form :model="data" disabled ref="formRef">
      <el-form-item prop="value" required>
        <JsonEditorVue v-model="data.value" v-bind="data.props"/>
      </el-form-item>
    </el-form>

    <br>
    <p>Value</p>
    <p>{{ JSON.stringify(data.value) }}</p>
    <p>
      <button @click="data.value = 321">编程式设值</button>
      <button @click="data.value = null">清空</button>
      <button @click="() => { $refs.formRef.validate() }">校验</button>
    </p>

    <br>
    <p>Props</p>
    <JsonEditorVue v-model="data.props"/>
  </div>
</template>

<script>
import JsonEditorVue from '../../src'

export default {
  components: { JsonEditorVue },
  data () {
    return {
      data: {
        value: 123,
        props: {
          //mode: 'tree',
          readOnly: false,
        }
      }
    }
  },
}
</script>
