<template>
  <div>
    <vue-json-viewer
      v-show="Disabled"
      v-if="value"
      :value="value"
      v-bind="VueJsonViewerProps"
    />
    <div v-show="!Disabled" ref="jsonEditorVue"/>
  </div>
</template>

<script>
import 'jsoneditor/dist/jsoneditor.min.css'
import JSONEditor from 'jsoneditor'
import { options, vueJsonViewerProps, disabled } from './config.ts'
import { typeOf } from 'plain-kit'
import VueJsonViewer from 'vue-json-viewer'

/**
 * 参数有全局参数、实例参数和默认值之分 取哪个取决于用户传了哪个 此时有两个疑问：
 *   1. 怎么判断用户传没传？ —— 以该参数是否全等于undefined作为标识
 *   2. 如果传了多个，权重顺序是怎样的？ —— 全局＞实例＞默认
 *
 * @param {any} globalProp - 全局参数
 * @param {any} prop - 实例参数
 * @param {any} defaultValue - 默认值
 * @return {any} 最终
 */
function getFinalProp (globalProp, prop, defaultValue) {
  return prop !== undefined ? prop :
    globalProp !== undefined ? globalProp :
      defaultValue
}

export default {
  name: 'json-editor-vue',
  components: { VueJsonViewer },
  inject: {
    elForm: {
      default: ''
    },
  },
  props: {
    value: {
      validator: value => ['null', 'object', 'array'].includes(typeOf(value)),
    },
    options: Object,
    vueJsonViewerProps: Object,
    disabled: {
      validator: value => ['boolean'].includes(typeOf(value))
    }
  },
  data () {
    return {
      jsonEditor: null,
      synchronizing: false
    }
  },
  computed: {
    VueJsonViewerProps () {
      return {
        expanded: false,
        expandDepth: 2,
        copyable: { copyText: '复制', copiedText: '已复制', timeout: 2000 },
        sort: true,
        boxed: true,
        ...getFinalProp(vueJsonViewerProps, this.vueJsonViewerProps, {})
      }
    },
    Disabled () {
      return getFinalProp(disabled, this.disabled, this.elForm?.disabled)
    },
    Options () {
      // this.options中存在__ob__
      return {
        mainMenuBar: false,
        navigationBar: false,
        statusBar: false,
        mode: 'code',
        ...getFinalProp(options, this.options, {})
      }
    }
  },
  watch: {
    value: {
      deep: true,
      handler (newVal) {
        if (this.jsonEditor) {
          if (this.synchronizing) {
            this.synchronizing = false
          } else {
            this.jsonEditor.set(newVal)
          }
        }
      }
    },
    options: {
      deep: true,
      handler (newVal) {
        this.jsonEditor.destroy()
        this.jsonEditor = null
        this.init()
      }
    },
    Disabled (newVal) {
      if (!newVal && !this.jsonEditor) {
        this.$nextTick(this.init)
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.jsonEditor = new JSONEditor(this.$refs.jsonEditorVue, {
        onChange: () => {
          this.synchronizing = true
          try {
            this.$emit('input', this.jsonEditor.get())
            //fix: 用于el表单中 且校验触发方式为blur时 没有生效
            if (this.$parent?.$options?._componentTag === ('el-form-item') && this.$parent.rules?.trigger === 'blur') {
              this.$parent.$emit('el.form.blur')
            }
          } catch (e) {
            this.synchronizing = false
          }
        },
        onBlur: () => {
          try {
            this.jsonEditor.repair && this.jsonEditor.repair()
            this.jsonEditor.format && this.jsonEditor.format()
            this.$emit('input', this.jsonEditor.get())
          } catch (e) {
          }
        },
        ...this.Options,
      }, this.value || {})
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .jsoneditor {
  border: thin solid lightgrey;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
}
</style>
