import { debounce } from 'lodash-es'
import type { Mode } from 'vanilla-jsoneditor'
import { JSONEditor } from 'vanilla-jsoneditor'
import { computed, defineComponent, getCurrentInstance, h, isVue3, onMounted, onUnmounted, ref, unref, watch, watchEffect } from 'vue-demi'
import type { App, PropType } from 'vue-demi'
import { conclude, resolveConfig } from 'vue-global-config'
import { PascalCasedName as name } from '../package.json'

const propsGlobal: Record<string | number | symbol, any> = {}
const attrsGlobal: Record<string | number | symbol, any> = {}
const modeDefault = 'tree'
const modelValueProp = isVue3 ? 'modelValue' : 'value'
const updateModelValue = isVue3 ? 'update:modelValue' : 'input'
const boolAttrs = [
  'mainMenuBar',
  'navigationBar',
  'statusBar',
  'askToFormat',
  'readOnly',
  'escapeControlCharacters',
  'escapeUnicodeCharacters',
  'flattenColumns',
] as const

export default defineComponent({
  name,
  install(app: App, options = {}): void {
    const { props, attrs } = resolveConfig(options, { props: this.$props as any })
    Object.assign(propsGlobal, props)
    Object.assign(attrsGlobal, attrs)
    app.component(name, this)
  },
  props: {
    [modelValueProp]: Object,
    mode: {
      type: String as PropType<Mode>,
    },
    debounce: {
      type: Number,
    },
    stringified: {
      type: Boolean,
      default: undefined,
    },
    mainMenuBar: {
      type: Boolean,
      default: undefined,
    },
    navigationBar: {
      type: Boolean,
      default: undefined,
    },
    statusBar: {
      type: Boolean,
      default: undefined,
    },
    ...Object.fromEntries(
      boolAttrs.map(boolAttr => [
        boolAttr,
        {
          type: Boolean as PropType<boolean>,
          default: undefined,
        },
      ]),
    ),
  },
  emits: {
    [updateModelValue](_payload: any) {
      return true
    },
    'update:mode': function (_payload: Mode) {
      return true
    },
  },
  setup(props, { attrs, emit, expose }) {
    const currentInstance = getCurrentInstance()?.proxy
    const jsonEditor = ref()
    const preventUpdatingContent = ref(false)

    const modeComputed = ref()
    watchEffect(() => {
      modeComputed.value = conclude([props.mode, propsGlobal.mode], {
        type: String as PropType<Mode>,
      })
      jsonEditor.value?.updateProps({
        mode: modeComputed.value || modeDefault,
      })
    })
    const onChangeMode = (mode: Mode) => {
      emit('update:mode', mode)
    }
    // Synchronize the local `mode` with the global one
    if (propsGlobal.mode !== undefined && props.mode === undefined) {
      onChangeMode(propsGlobal.mode)
    }

    const debounceComputed = computed(() => {
      return conclude([props.debounce, propsGlobal.debounce, 100], {
        type: Number as PropType<number>,
      })
    })
    const stringifiedComputed = computed(() => conclude([props.stringified, propsGlobal.stringified, true], {
      type: Boolean as PropType<boolean>,
    }))
    const onChange = debounce((updatedContent: { json?: any, text?: string }) => {
      preventUpdatingContent.value = true
      if (!stringifiedComputed.value && updatedContent.text) {
        if (jsonEditor.value && !jsonEditor.value.validate()) {
          updatedContent.json = JSON.parse(updatedContent.text)
        }
        updatedContent.text = undefined
      }
      emit(
        updateModelValue,
        updatedContent.text === undefined
          ? updatedContent.json
          : updatedContent.text,
      )
    }, debounceComputed.value)

    const mergeFunction = (previousValue: (...args: any) => unknown, currentValue: (...args: any) => unknown) => (...args: any) => {
      previousValue(...args)
      currentValue(...args)
    }

    expose?.({ jsonEditor })

    onUnmounted(() => {
      jsonEditor.value?.destroy()
    })

    onMounted(() => {
      const initialValue = conclude([props[modelValueProp], propsGlobal[modelValueProp]])
      const initialBoolAttrs = Object.fromEntries(
        Array.from(boolAttrs, boolAttr => [boolAttr, conclude([props[boolAttr], propsGlobal[boolAttr]])]).filter(
          ([, v]) => v !== undefined,
        ),
      )
      const initialAttrs = conclude(
        [
          initialBoolAttrs,
          attrs,
          attrsGlobal,
          {
            onChange,
            onChangeMode,
            mode: modeComputed.value,
            ...(initialValue !== undefined && {
              content: {
                [(typeof initialValue === 'string' && modeComputed.value === 'text' && stringifiedComputed.value)
                  ? 'text'
                  : 'json']: initialValue,
              },
            }),
          },
        ],
        {
          camelizeObjectKeys: true,
          mergeFunction,
          type: Object,
        },
      )

      jsonEditor.value = new JSONEditor({
        target: currentInstance?.$refs.jsonEditorRef as Element,
        props: initialAttrs,
      })

      watch(
        () => props[modelValueProp],
        (newModelValue: any) => {
          if (preventUpdatingContent.value) {
            preventUpdatingContent.value = false
            return
          }
          if (jsonEditor.value) {
            // jsonEditor.value.update cannot render new props in json
            // `undefined` is not accepted by vanilla-jsoneditor
            // The default value is `{ text: '' }`
            // Only default value can clear the editor
            jsonEditor.value.set(
              [undefined, ''].includes(newModelValue)
                ? {
                    text: '',
                  }
                : {
                    [(typeof newModelValue === 'string' && modeComputed.value === 'text' && stringifiedComputed.value)
                      ? 'text'
                      : 'json']: newModelValue,
                  },
            )
          }
        },
        {
          deep: true,
        },
      )

      watch(
        () => Array.from(boolAttrs, boolAttr => props[boolAttr]),
        (values) => {
          jsonEditor.value?.updateProps(
            Object.fromEntries(Array.from(values, (v, i) => [boolAttrs[i], v]).filter(([, v]) => v !== undefined)),
          )
        },
      )

      watch(
        () => attrs,
        (newAttrs) => {
          // Functions need to be merged again
          const defaultFunctionAttrs: {
            onChange?: (...args: any) => unknown
            onChangeMode?: (...args: any) => unknown
          } = {}
          if (newAttrs.onChange || newAttrs['on-change']) {
            defaultFunctionAttrs.onChange = onChange
          }
          if (newAttrs.onChangeMode || newAttrs['on-change-mode']) {
            defaultFunctionAttrs.onChangeMode = onChangeMode
          }
          jsonEditor.value?.updateProps(
            Object.getOwnPropertyNames(defaultFunctionAttrs).length > 0
              ? conclude([newAttrs, defaultFunctionAttrs], {
                camelizeObjectKeys: true,
                mergeFunction,
                type: Object,
              })
              : newAttrs,
          )
        },
        {
          deep: true,
        },
      )

      // There's no `expose` in @vue/composition-api
      if (!expose) {
        expose = (exposed: Record<string, any> | undefined): void => {
          for (const k in exposed) {
            (currentInstance as any)[k] = unref(exposed[k])
          }
        }
        expose({ jsonEditor })
      }
    })

    return () => h('div', { ref: 'jsonEditorRef' })
  },
})
