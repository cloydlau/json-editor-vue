<template>
  <el-dialog visible :close-on-click-modal="false" :show-close="false" title="json-editor-vue">
  </el-dialog>
</template>

<script>
import JsonEditorVue from '../src/main'
import PropsEditor from './PropsEditor.vue'

export default {
  components: { PropsEditor, JsonEditorVue },
  data () {
    return {
      props: {
        value: null,
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
}
</script>

<style lang="scss" scoped>
::v-deep .el-dialog {
  min-width: 600px;
}
</style>
