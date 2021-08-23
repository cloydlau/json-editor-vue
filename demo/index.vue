<template>
  <el-dialog visible :close-on-click-modal="false" :show-close="false" title="json-editor-vue">
    <JSONEditorVue v-model="value" v-bind="props"/>

    <h2>Value</h2>
    <JSONEditorVue :value="value"/>
    <el-button @click="set" type="primary" style="width:100%">编程式设值</el-button>

    <h2>Props</h2>
    <JSONEditorVue v-model="props"/>
  </el-dialog>
</template>

<script>
import JSONEditorVue from '../src/main'

export default {
  components: { JSONEditorVue },
  data () {
    return {
      value: null,
      props: {
        readonly: false,
        vueJsonViewerProps: {
          boxed: false,
          copyable: {
            timeout: 0
          }
        }
      },
    }
  },
  methods: {
    set () {
      this.value = {
        a: 3
      }
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-dialog {
  min-width: 600px;
}
</style>
