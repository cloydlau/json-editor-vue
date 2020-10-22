<template>
  <div>
    <h2>props</h2>
    <el-form>
      <el-form-item label="disabled">
        <el-switch
          v-model="value.disabled"
          :active-value="true"
          :inactive-value="false"
        />
      </el-form-item>
      <el-form-item label="options">
        <json-editor-vue v-model="value.options"/>
      </el-form-item>
      <el-form-item label="vueJsonViewerProps">
        <json-editor-vue v-model="value.vueJsonViewerProps"/>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import JsonEditorVue from '../src/index'

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
h2 {
  margin-top: 50px;
}

.el-tag ~ .el-tag {
  margin-left: 16px;
}

.title {
  margin-right: 16px;
}
</style>
