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
import { JSONEditor } from 'svelte-jsoneditor'
import jsonrepair from 'jsonrepair'
import { isPlainObject, throttle } from 'lodash-es'
import { typeOf } from 'kayran'
import VueJsonViewer from 'vue-json-viewer'
import globalProps from './config.ts'

//const validator = createAjvValidator(schema, schemaRefs)

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
export function getFinalProp (globalProp, prop, defaultValue) {
  if (prop !== undefined) {
    if (typeOf(defaultValue) === 'boolean') {
      return ['', true].includes(prop)
    } else if (isPlainObject(prop)) {
      return {
        ...defaultValue,
        ...globalProp,
        ...prop,
      }
    } else {
      return prop
    }
  } else if (globalProp !== undefined) {
    if (isPlainObject(globalProp)) {
      return {
        ...defaultValue,
        ...globalProp,
      }
    } else {
      return globalProp
    }
  } else {
    return defaultValue
  }
}

export default {
  name: 'json-editor-vue',
  components: { VueJsonViewer },
  inject: {
    elForm: {
      default: {}
    },
  },
  props: {
    value: {
      validator: value => ['null', 'object', 'array', 'string'].includes(typeOf(value)),
    },
    vueJsonViewerProps: Object,
    readonly: {
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
    Readonly () {
      return getFinalProp(
        globalProps.readonly,
        this.readonly,
        Boolean(this.elForm.disabled)
      )
    },
    svelteJsoneditorProps () {
      let temp = {}
      Object.keys(this.$attrs).filter(v => !Object.keys(this.$props).includes(v)).map(v => {
        temp[v] = getFinalProp(globalProps[v], this.$attrs[v])
      })
      return {
        //navigationBar: false,
        //statusBar: false,
        mainMenuBar: false,
        mode: 'code',
        ...temp
      }
    },
    VueJsonViewerProps () {
      return getFinalProp(
        globalProps.vueJsonViewerProps,
        this.vueJsonViewerProps,
        {
          copyable: { copyText: '复制', copiedText: '已复制', timeout: 2000 },
          boxed: true,
          previewMode: true,
        })
    },
  },
  watch: {
    value: {
      deep: true,
      handler (n) {
        if (this.jsonEditor) {
          if (this.synchronizing) {
            console.log(`${typeOf(n)} value: `, n)
            this.synchronizing = false
          } else {
            this.jsonEditor.set(n)
          }
        }
      }
    },
    svelteJsoneditorProps: {
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
      const parseText = (json, text) => {
        if (!json && text) {
          if (
            (text.startsWith('{') && text.endsWith('}')) ||
            (text.startsWith('[') && text.endsWith(']'))
          ) {
            try {
              return JSON.parse(text)
            } catch (e) {
              return text
            }
          }
          return text
        }
        return text
      }

      if (!this.syncValueThrottle) {
        this.syncValueThrottle = throttle(({
          json, text, onlySyncJson
        }) => {
          const newValue = parseText(json, text)
          if (onlySyncJson) {
            if (['array', 'object'].includes(typeOf(newValue))) {
              this.$emit('input', newValue)
            }
            return
          }
          this.$emit('input', newValue)
        }, 500, {
          leading: false, // true会导致：如果调用≥2次 则至少触发2次 但此时可能只期望触发1次
          trailing: true
        })
      }

      this.jsonEditor = new JSONEditor({
        target: this.$refs.jsonEditorVue,
        props: {
          ...this.svelteJsoneditorProps,
          json: this.value,
          onChange: (content) => {
            // content is an object { json: JSON | undefined, text: string | undefined }
            console.log(content)
            let { json, text } = content
            this.synchronizing = true
            this.syncValueThrottle({ json, text })

            //fix: 用于el表单中 且校验触发方式为blur时 没有生效
            if (this.$parent?.$options?._componentTag === ('el-form-item') && this.$parent.rules?.trigger === 'blur') {
              // fix: el-form-item深层嵌套时事件触发过早
              this.$parent.$nextTick(() => {
                this.$parent.$emit('el.form.blur')
              })
            }

            this.svelteJsoneditorProps.onChange?.()
          },
          onBlur: () => {
            if (typeOf(this.value) === 'string' && this.value) {
              let newValue = this.value
              newValue = jsonrepair(newValue)
              console.log(`repaired value: `, newValue)

              //newValue = JSON.stringify(JSON.parse(newValue), null, 2)
              //console.log('formatted value: ', newValue)

              //this.synchronizing = true
              this.syncValueThrottle({
                text: newValue,
                onlySyncJson: true
              })
            }

            this.svelteJsoneditorProps.onBlur?.()
          },
        },
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.json-editor-vue {

  & > div {
    height: 200px;
  }

  & > .jv-container {
    overflow: auto; // 引起svelte-jsoneditor闪烁
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
