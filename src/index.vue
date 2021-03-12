<template>
  <div class="json-editor-vue">
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
import { JSONEditor } from 'svelte-jsoneditor'
import { typeOf } from 'kayran'
import VueJsonViewer from 'vue-json-viewer'
import * as globalProps from './config.ts'

const { props, vueJsonViewerProps, disabled } = globalProps

/**
 * 参数有全局参数、实例参数和默认值之分 取哪个取决于用户传了哪个：
 *   1. 怎么判断用户传没传？ —— 以该参数是否全等于undefined作为标识
 *   2. 如果传了多个，权重顺序是怎样的？ —— 实例＞全局＞默认
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
      validator: value => ['null', 'object', 'array', 'string'].includes(typeOf(value)),
    },
    props: Object,
    vueJsonViewerProps: Object,
    disabled: {
      validator: value => value === '' || ['boolean'].includes(typeOf(value))
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
        sort: false,
        expandDepth: 1,
        copyable: { copyText: '复制', copiedText: '已复制', timeout: 2000 },
        boxed: true,
        previewMode: true,
        ...getFinalProp(vueJsonViewerProps, this.vueJsonViewerProps, {})
      }
    },
    Disabled () {
      return getFinalProp(disabled, this.disabled === '' ? true : this.disabled, this.elForm?.disabled)
    },
    Props () {
      // this.props中存在__ob__
      return {
        mainMenuBar: false,
        navigationBar: false,
        statusBar: false,
        indentation: 2,
        mode: 'code',
        ...getFinalProp(props, this.props)
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
    props: {
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
  destroyed () {
    this.jsonEditor.destroy()
  },
  methods: {
    init () {
      this.jsonEditor = new JSONEditor({
        target: this.$refs.jsonEditorVue,
        props: {
          json: this.value,
          onChange: ({ json, text }) => {
            this.synchronizing = true
            console.log(json, text)
            if (text?.startsWith('{') && text.endsWith('}')) {
              try {

              } catch (e) {

              }
            }
            //console.log(this.jsonEditor.get())
            this.$emit('input', json || text)
            //fix: 用于el表单中 且校验触发方式为blur时 没有生效
            if (this.$parent?.$options?._componentTag === ('el-form-item') && this.$parent.rules?.trigger === 'blur') {
              // fix: el-form-item深层嵌套时事件触发过早
              this.$parent.$nextTick(() => {
                this.$parent.$emit('el.form.blur')
              })
            }
          },
          ...this.Props,
        },
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.json-editor-vue {

  & > div {
    height: 200px;
  }

  ::v-deep .jsoneditor-main {
    border: thin solid lightgrey;
    box-shadow: none !important;

    &:hover {
      box-shadow: 0 0 10px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04) !important;
    }
  }
}
</style>
