<template>
  <div>
    <h2>props</h2>
    <el-collapse>
      <el-collapse-item>
        <template slot="title">
          <span class="title">【options】jsoneditor配置</span>
          <el-tag>Object</el-tag>
        </template>
        <el-card>
          <div slot="header">
            <json-editor-vue v-model="value.options"/>
          </div>
          <json-editor-vue v-model="defaultOptions" :options="{
            mode: 'view',
            name: '默认值',
          }"/>
        </el-card>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
//import JsonEditorVue from '../src/index' //dev
import { JsonEditorVue } from '../dist/json-editor-vue.umd' //prod

export default {
  props: {
    value: Object
  },
  components: {
    JsonEditorVue
  },
  data () {
    return {
      defaultOptions: {
        mainMenuBar: false,
        navigationBar: false,
        statusBar: false,
        mode: 'code'
      },
    }
  }
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
