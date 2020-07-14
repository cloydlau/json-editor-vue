<template>
  <div :id="id"/>
</template>

<script>
import 'jsoneditor/dist/jsoneditor.min.css'
import JSONEditor from 'jsoneditor'

export default {
  name: 'json-editor-vue',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      validator: value => ['Null', 'Object'].includes(({}).toString.call(value).slice(8, -1)),
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
  watch: {
    value: {
      immediate: true,
      deep: true,
      handler (newVal) {
        if (newVal) {
          if (this.jsonEditor) {
            if (this.synchronizing) {
              this.synchronizing = false
            } else {
              this.jsonEditor.set(newVal)
            }
          } else {
            this.$nextTick(() => {
              this.jsonEditor = new JSONEditor(document.getElementById(this.id), {
                mainMenuBar: false,
                navigationBar: false,
                statusBar: false,
                mode: 'code',
                onChange: () => {
                  try {
                    this.synchronizing = true
                    this.$emit('change', this.jsonEditor.get())
                  } catch (e) {
                    this.synchronizing = false
                  }
                },
                onBlur: () => {
                  this.jsonEditor.repair()
                  this.jsonEditor.format()
                },
                ...this.options,
              }, newVal)
            })
          }
        }
      }
    },
  }
}
</script>

<style lang="scss" scoped>
::v-deep .jsoneditor {
  border: thin solid lightgrey;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
}
</style>
