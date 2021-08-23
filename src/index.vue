<template>
  <div class="json-editor-vue">
    <vue-json-viewer
      v-show="Readonly"
      v-if="value"
      :value="value"
      v-bind="VueJsonViewerProps"
    />
    <div v-show="!Readonly" ref="jsonEditorVue"/>
  </div>
</template>

<script>
import { JSONEditor } from 'svelte-jsoneditor/dist/jsoneditor.js'
import jsonrepair from 'jsonrepair'
import { typeOf } from 'kayran'
import VueJsonViewer from 'vue-json-viewer'
import globalProps from './config.ts'
import { getFinalProp } from './utils'

//const validator = createAjvValidator(schema, schemaRefs)

export default {
  name: 'json-editor-vue',
  components: { VueJsonViewer },
  inject: {
    elForm: {
      default: {}
    },
  },
  props: {
    value: {},
    vueJsonViewerProps: Object,
    readonly: {
      validator: value => value === '' || ['boolean'].includes(typeOf(value))
    }
  },
  data () {
    return {
      jsonEditor: null,
    }
  },
  computed: {
    Readonly () {
      return getFinalProp(
        this.readonly,
        globalProps.readonly,
        Boolean(this.elForm.disabled)
      )
    },
    VueJsonViewerProps () {
      return getFinalProp(
        this.vueJsonViewerProps,
        globalProps.vueJsonViewerProps,
        {
          copyable: { copyText: '复制', copiedText: '已复制', timeout: 2000 },
          boxed: true,
          previewMode: true,
        }
      )
    },
    SvelteJsoneditorProps () {
      // 全局配置 排除$props并让位$attrs
      let globalAttrs = {}
      Object.keys(this.$attrs).filter(v => !Object.keys(this.$props).includes(v)).map(v => {
        globalAttrs[v] = getFinalProp(this.$attrs[v], globalProps[v])
      })
      return {
        //navigationBar: false,
        //statusBar: false,
        mainMenuBar: false,
        mode: 'code',
        ...globalAttrs
      }
    },
  },
  watch: {
    SvelteJsoneditorProps: {
      deep: true,
      handler (n) {
        this.jsonEditor.destroy()
        this.jsonEditor = null
        this.init()
      }
    },
    Readonly (newVal) {
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
          ...this.SvelteJsoneditorProps,
          json: this.value,
          onBlur: () => {
            let newVal = this.jsonEditor.get()
            if (typeof newVal === 'string' && newVal) {
              try {
                newVal = jsonrepair(newVal)
              } catch (e) {
                //console.warn(e)
              }
            }
            this.$emit('input', newVal)

            // fix: 用于el表单中 且校验触发方式为blur时 没有生效
            if (this.$parent?.$options?._componentTag === ('el-form-item') && this.$parent.rules?.trigger === 'blur') {
              // fix: el-form-item深层嵌套时事件触发过早
              this.$parent.$nextTick(() => {
                this.$parent.$emit('el.form.blur')
              })
            }

            this.SvelteJsoneditorProps.onBlur?.()
          },
        },
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.json-editor-vue {

  ::v-deep .jsoneditor-main {
    height: 200px;
  }

  & > .jv-container {
    //overflow: auto; // 引起svelte-jsoneditor闪烁

    ::v-deep .jv-code {
      padding: 0;
    }

    ::v-deep .jv-code.boxed {
      max-height: 160px;
    }
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
