/*
<template>
  <div v-show="!Readonly" ref="jsonEditorVue"/>
  <json-viewer
    v-show="Readonly&&props.modelValue"
    :value="props.modelValue"
    v-bind="ReadonlyOptions"
  />
</template>
*/

import {
  isVue3,
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
  h,
  vShow, // 不支持Vue2
  withDirectives, // 不支持Vue2
} from 'vue-demi'
import { JSONEditor } from 'svelte-jsoneditor/dist/jsoneditor.js'
import jsonrepair from 'jsonrepair'
import { getFinalProp, getGlobalAttrs } from 'kayran'
import { JsonViewer } from 'vue3-json-viewer'
import Vue2JsonViewer from 'vue-json-viewer'
import globalConfig from './config.ts'
//import { elFormKey } from 'element-plus/lib/tokens'
//const validator = createAjvValidator(schema, schemaRefs)

export default defineComponent({
  name: 'JsonEditorVue',
  props: [
    'modelValue',
    'readonlyOptions',
    'readonly'
  ],
  setup (props, { attrs, slots, emit }) {
    /*
    const props = defineProps([
      'modelValue',
      'readonlyOptions',
      'readonly'
    ])
    const emit = defineEmits(['update:modelValue', 'change'])
    */

    let elForm = inject('elForm', { disabled: false })
    let jsonEditor = ref(null)
    let syncing = ref(false)
    const Readonly = computed(() => getFinalProp([
      [true, ''].includes(props.readonly) ? true : props.readonly,
      globalConfig.readonly,
      Boolean(elForm.disabled)
    ], {
      type: 'boolean'
    }))

    function syncValue (n: any) {
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

    const ReadonlyOptions = computed(() => getFinalProp([
      toRaw(props.readonlyOptions),
      globalConfig.readonlyOptions,
      {
        /*copyable: {
          copyText: '复制',
          copiedText: '已复制',
          timeout: 2000
        },*/
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
        {
          //navigationBar: false,
          //statusBar: false,
          //mainMenuBar: false,
          //mode: 'code',
          readOnly: Boolean(elForm.disabled),
        }
      ], {
        mergeFunction: (accumulator, item) => n => {
          item?.(n)
          accumulator(n)
        },
        default: ({ mode }) => mode === 'code' ? {
          onBlur: () => {
            // tree模式无法获取编辑状态下的值，包括onBlur时，所以失焦同步仅适用于code模式
            syncValue(jsonEditor.value?.get())
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
        jsonEditor.value = new JSONEditor({
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
        jsonEditor.value?.update({ text, json })
      }
    })

    watch(SvelteJsoneditorProps, n => {
      /*jsonEditor.value?.destroy()
      jsonEditor.value = null
      init()*/
      jsonEditor.value?.updateProps(n)
    }, {
      deep: true,
    })
    watch(Readonly, n => {
      if (!n && !jsonEditor.value) {
        nextTick(init)
      }
    })

    onMounted(() => {
      init()
    })

    onUnmounted(() => {
      jsonEditor.value?.destroy?.()
    })

    return {
      JsonViewer: isVue3 ? JsonViewer : Vue2JsonViewer,
      props,
      jsonEditorVue,
      ReadonlyOptions,
      Readonly,
    }
  },
  render (ctx: any) {
    // vue2中ctx为渲染函数h
    return isVue3 ?
      [
        withDirectives(h('div', {
          ref: 'jsonEditorVue'
        }), [
          [vShow, !ctx.Readonly]
        ]),
        withDirectives(h(ctx.JsonViewer, {
          ...ctx.ReadonlyOptions,
          value: ctx.props.modelValue,
        }), [
          [vShow, ctx.Readonly && ctx.props.modelValue],
        ]),
      ] :
      h('div', undefined, [
        h('div', {
          ref: 'jsonEditorVue',
          directives: [
            {
              name: 'show',
              value: !this.Readonly
            },
          ]
        }),
        h(this.JsonViewer, {
          ...this.ReadonlyOptions,
          props: {
            value: this.props.modelValue,
          },
          directives: [
            {
              name: 'show',
              value: this.Readonly && this.props.modelValue
            },
          ]
        })
      ])
  }
})
