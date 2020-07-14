<template>
  <el-dialog :visible.sync="showDialog" :close-on-click-modal="false" title="json-editor-vue">
    <JsonEditorVue v-model="value" :options="options"/>
  </el-dialog>
</template>

<script>
import JsonEditorVue from '../src/index'
//todo: import { JsonEditorVue } from 'json-editor-vue'

export default {
  components: { JsonEditorVue },
  data () {
    return {
      value: {},
      options: {},

      showDialog: true,
    }
  },
}
</script>

<style lang="scss" scoped>

</style>
