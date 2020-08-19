<template>
  <el-dialog visible :close-on-click-modal="false" :show-close="false" title="json-editor-vue">
    <p>{{JSON.stringify(value)}}</p>
    <json-editor-vue v-model="value" :options="props.options"/>

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
      },
    }
  },
}
</script>

<style lang="scss" scoped>

</style>
