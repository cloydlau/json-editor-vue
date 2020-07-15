<template>
  <el-dialog :visible.sync="showDialog" :close-on-click-modal="false" title="json-editor-vue">
    <p>{{JSON.stringify(value)}}</p>
    <json-editor-vue v-model="value" :options="props.options"/>

    <PropsEditor v-model="props"/>
  </el-dialog>
</template>

<script>
//import JsonEditorVue from '../src/index' //dev
import { JsonEditorVue } from '../dist/json-editor-vue.umd' //prod
//import { JsonEditorVue } from 'json-editor-vue' //todo
import PropsEditor from './PropsEditor'

export default {
  components: { PropsEditor, JsonEditorVue },
  data () {
    return {
      value: null,
      props: {
        options: {},
      },

      showDialog: true,
    }
  },
}
</script>

<style lang="scss" scoped>

</style>
