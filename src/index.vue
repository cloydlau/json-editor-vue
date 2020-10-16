<template>
  <div :id="id"/>
</template>

<script>
import 'jsoneditor/dist/jsoneditor.min.css'
import JSONEditor from 'jsoneditor'
import { options } from './config.ts'

export default {
  name: 'json-editor-vue',
  model: {
    prop: 'value',
    event: 'change'
  },
  inject: {
    elForm: {
      default: ''
    },
  },
  props: {
    value: {
      validator: value => ['Null', 'Object', 'Array'].includes(({}).toString.call(value).slice(8, -1)),
    },
    options: Object,
  },
  data () {
    return {
      id: `json-editor-vue.${new Date().getTime() + Math.random()}`,
      jsonEditor: null,
      synchronizing: false
    }
  },
  computed: {
    Disabled () {
      return this.disabled || (this.elForm || {}).disabled
    },
    Options () {
      //this.options中存在__ob__
      return Object.getOwnPropertyNames(this.options || {}).length > 1 ? this.options : options
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
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.jsonEditor = new JSONEditor(document.getElementById(this.id), {
        mainMenuBar: false,
        navigationBar: false,
        statusBar: false,
        mode: 'code',
        onChange: () => {
          this.synchronizing = true
          try {
            this.$emit('change', this.jsonEditor.get())
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
            this.$emit('change', this.jsonEditor.get())
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
