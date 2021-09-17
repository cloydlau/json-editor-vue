<template>
  <div class="json-editor-vue">
    <Vue3JsonViewer
      v-show="Readonly&&$props.modelValue"
      :value="$props.modelValue"
      v-bind="VueJsonViewerProps"
    />
    <div v-show="!Readonly" ref="jsonEditorVue"/>
  </div>
</template>

<script>
import { ref, computed, watch, inject, toRaw, useAttrs, nextTick, onMounted, onUnmounted } from 'vue-demi'
import { JSONEditor } from 'svelte-jsoneditor/dist/jsoneditor.js'
import jsonrepair from 'jsonrepair'
import { getFinalProp, getGlobalAttrs } from 'kayran'
import Vue3JsonViewer from 'vue3-json-viewer'
import globalConfig from './config.ts'
import { cloneDeep } from 'lodash-es'

//const validator = createAjvValidator(schema, schemaRefs)

export default {
  setup (props, context) {
    const name = 'json-editor-vue'
    /*const props = defineProps({
      modelValue: {},
      vueJsonViewerProps: {},
      readonly: {}
    })*/
    //const emit = defineEmits(['update:modelValue'])

    let elForm = inject('elForm')
    let jsonEditor = ref(null)
    let jsonEditorVue = ref(null)

    const Readonly = computed(() => getFinalProp([
      [true, ''].includes(props.readonly) ? true : props.readonly,
      globalConfig.readonly,
      Boolean(elForm?.disabled)
    ], {
      type: 'boolean'
    }))
    const VueJsonViewerProps = computed(() => getFinalProp([
      props.vueJsonViewerProps,
      globalConfig.vueJsonViewerProps,
      {
        copyable: { copyText: '复制', copiedText: '已复制', timeout: 2000 },
        boxed: true,
        previewMode: true,
      }
    ], {
      type: 'object'
    }))
    console.log(cloneDeep(context.attrs))
    const SvelteJsoneditorProps = computed(() => {
      return getFinalProp([
        //toRaw(useAttrs()),
        getGlobalAttrs(globalConfig, toRaw(props)),
        {
          //navigationBar: false,
          //statusBar: false,
          mainMenuBar: false,
          mode: 'code',
        }
      ])
    })

    function init () {
      console.log('\n-------------------------\n')
      console.log(toRaw(props.modelValue))
      console.log('-------------------------\n\n')
      jsonEditor = new JSONEditor({
        target: jsonEditorVue.value,
        props: {
          ...SvelteJsoneditorProps.value,
          json: toRaw(props.modelValue),
          onBlur: () => {
            let { text, json } = jsonEditor.get()
            console.log(text, json)
            if (typeof text === 'string' && text) {
              try {
                text = jsonrepair(text)
              } catch (e) {
                //console.warn(e)
              }
            }
            //emit('update:modelValue', text)
            SvelteJsoneditorProps.value.onBlur?.()
          },
        },
      })
    }

    watch(SvelteJsoneditorProps, n => {
      jsonEditor.destroy()
      jsonEditor = null
      init()
    }, {
      deep: true,
    })

    watch(Readonly, n => {
      if (!n && !jsonEditor.value) {
        nextTick(init)
      }
    })

    /*onMounted(() => {
      console.log('\n-------------------------\n')
      console.log(1)
      console.log('-------------------------\n\n')
      init()
    })*/

    onUnmounted(() => {
      jsonEditor.destroy()
    })

    return {
      Readonly,
      VueJsonViewerProps,
      jsonEditorVue,
    }
  },
  mounted () {
    console.log('\n-------------------------\n')
    console.log(2)
    console.log('-------------------------\n\n')
  }
}
</script>

<style lang="scss" scoped>
.json-editor-vue {

  :deep(.jsoneditor-main) {
    height: 200px;
  }

  & > .jv-container {
    //overflow: auto; // 引起svelte-jsoneditor闪烁

    :deep(.jv-code) {
      padding: 0;
    }

    :deep(.jv-code.boxed) {
      max-height: 160px;
    }
  }

  :deep(.jsoneditor-main) {
    border: thin solid lightgrey;
    box-shadow: none !important;

    &:hover {
      box-shadow: 0 0 10px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04) !important;
    }
  }
}
</style>
