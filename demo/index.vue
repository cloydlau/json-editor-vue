<template>
  <el-dialog visible :close-on-click-modal="false" :show-close="false" title="json-editor-vue">
    <json-editor-vue v-model="value" v-bind="props"/>

    <PropsEditor v-model="props"/>
  </el-dialog>
</template>

<script>
import JsonEditorVue from '../src/main'
import PropsEditor from './PropsEditor.vue'

export default {
  components: { PropsEditor, JsonEditorVue },
  data () {
    return {
      value: null,
      props: {
        readonly: false,
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
