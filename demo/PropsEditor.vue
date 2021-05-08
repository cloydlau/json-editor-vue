<template>
  <div>
    <br>
    <h3>Props</h3>
    <el-form
      label-position="top"
    >
      <el-form-item label="readonly">
        <el-switch
          v-model="value.readonly"
          :active-value="true"
          :inactive-value="false"
        />
      </el-form-item>
      <el-form-item label="vueJsonViewerProps">
        <json-editor-vue v-model="value.vueJsonViewerProps" readonly/>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import JsonEditorVue from '../src/index.vue'

export default {
  props: {
    value: Object
  },
  components: {
    JsonEditorVue
  },
}
</script>

<style lang="scss" scoped>
</style>
