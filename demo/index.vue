<template>
  <el-dialog visible :close-on-click-modal="false" :show-close="false" title="json-editor-vue">
    <p>{{ JSON.stringify(value) }}</p>
    <json-editor-vue v-model="value" v-bind="props"/>

    <PropsEditor v-model="props"/>
  </el-dialog>
</template>

<script>
import JsonEditorVue from '../src/index'
import PropsEditor from './PropsEditor'

export default {
  components: { PropsEditor, JsonEditorVue },
  data () {
    return {
      value: null,
      props: {
        options: {},
        disabled: false,
        vueJsonViewerProps: {}
      },
    }
  },
}
</script>

<style lang="scss" scoped>
::v-deep .el-dialog {
  min-width: 600px;
}
</style>
