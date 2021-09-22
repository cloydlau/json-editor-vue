/*
<template>
  <div v-show="!Readonly" ref="jsonEditorVue"/>
  <json-viewer
    v-show="Readonly&&props.modelValue"
    :value="props.modelValue"
    v-bind="VueJsonViewerProps"
  />
</template>
*/

import {
  defineComponent,
  ref,
  reactive,
  computed,
  watch,
  inject,
  toRaw,
  nextTick,
  onMounted,
  onUnmounted,
  vShow,
  withDirectives,
  h,
} from 'vue-demi'
import { JSONEditor } from 'svelte-jsoneditor/dist/jsoneditor.js'
import jsonrepair from 'jsonrepair'
import { getFinalProp, getGlobalAttrs } from 'kayran'
import { JsonViewer } from 'vue3-json-viewer'
import globalConfig from './config.ts'
//import { elFormKey } from 'element-plus/lib/tokens'
//const validator = createAjvValidator(schema, schemaRefs)

export default defineComponent({
  name: 'JsonEditorVue',
  props: [
    'modelValue',
    'vueJsonViewerProps',
    'readonly'
  ],
  setup (props, { attrs, slots, emit }) {
    /*
    const props = defineProps([
      'modelValue',
      'vueJsonViewerProps',
      'readonly'
    ])
    const emit = defineEmits(['update:modelValue', 'change'])
    */

    let elForm = inject('elForm', {})
    let jsonEditor = reactive({})
    let syncing = ref(false)
    const Readonly = computed(() => getFinalProp([
      [true, ''].includes(props.readonly) ? true : props.readonly,
      globalConfig.readonly,
      Boolean(elForm.disabled)
    ], {
      type: 'boolean'
    }))

    function syncValue (n) {
      syncing.value = true
      let { text, json } = n
      let value = text ?? json
      if (typeof value === 'string' && value) {
        try {
          value = jsonrepair(value)
        } catch (e) {
          //console.warn(e)
        }
      }
      emit('update:modelValue', value)
    }

    const VueJsonViewerProps = computed(() => getFinalProp([
      toRaw(props.vueJsonViewerProps),
      globalConfig.vueJsonViewerProps,
      {
        copyable: {
          copyText: '复制',
          copiedText: '已复制',
          timeout: 2000
        },
        boxed: true,
        previewMode: true,
      }
    ], {
      type: 'object'
    }))
    const SvelteJsoneditorProps = computed(() => {
      return getFinalProp([
        { ...attrs },
        getGlobalAttrs(globalConfig, toRaw(props)),
        /*{
          navigationBar: false,
          statusBar: false,
          mainMenuBar: false,
          mode: 'code',
        }*/
      ], {
        mergeFunction: (accumulator, item) => n => {
          item?.(n)
          accumulator(n)
        },
        default: ({ mode }) => mode === 'code' ? {
          onBlur: () => {
            // tree模式无法获取编辑状态下的值，包括onBlur时，所以失焦同步仅适用于code模式
            syncValue(jsonEditor.get())
          }
        } : {
          onChange: n => {
            syncValue(n)
          }
        },
        defaultIsDynamic: true,
      })
    })

    let jsonEditorVue = ref(null)

    function init () {
      if (!Readonly.value) {
        jsonEditor = new JSONEditor({
          target: jsonEditorVue.value,
          props: {
            ...SvelteJsoneditorProps.value,
            content: {
              json: toRaw(props.modelValue) ?? '',
            },
          },
        })
      }
    }

    watch(() => props.modelValue, (n, o) => {
      if (syncing.value) {
        syncing.value = false
      } else {
        let text, json
        if (n) {
          if (typeof text === 'string') {
            text = n
          } else {
            json = n
          }
        } else {
          text = ''
        }
        jsonEditor?.update({ text, json })
      }
    })

    watch(SvelteJsoneditorProps, n => {
      /*jsonEditor.destroy()
      jsonEditor = null
      init()*/
      jsonEditor.updateProps(n)
    }, {
      deep: true,
    })
    watch(Readonly, n => {
      if (!n && !jsonEditor) {
        nextTick(init)
      }
    })

    onMounted(() => {
      init()
    })

    onUnmounted(() => {
      jsonEditor.destroy?.()
    })

    return {
      JsonViewer,
      Readonly,
      props,
      VueJsonViewerProps,
      jsonEditorVue,
    }
  },
  render (ctx: any) {
    return [
      withDirectives(h('div', {
        ref: 'jsonEditorVue'
      }), [
        [vShow, !ctx.Readonly]
      ]),
      withDirectives(h(ctx.JsonViewer, {
        value: ctx.props.modelValue,
        ...ctx.VueJsonViewerProps,
      }), [
        [vShow, ctx.Readonly && ctx.props.modelValue],
      ])
    ]
  }
})
