<template>
  <el-dialog :visible.sync="showDialog" :close-on-click-modal="false" title="json-editor-vue">
    <p>{{JSON.stringify(value)}}</p>
    <JsonEditorVue v-model="value" :options="props.options"/>

    <PropsEditor v-model="props"/>
  </el-dialog>
</template>

<script>
//import JsonEditorVue from '../src/index' //dev
import { JsonEditorVue } from '../dist/json-editor-vue.umd' //npm
//import { JsonEditorVue } from 'json-editor-vue' //prod
import PropsEditor from './PropsEditor'

export default {
  components: { JsonEditorVue, PropsEditor },
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
