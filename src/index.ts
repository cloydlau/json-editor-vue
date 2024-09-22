import type { JSONContent, JSONEditorPropsOptional, TextContent } from 'vanilla-jsoneditor'
import type { App, Plugin, PropType } from 'vue-demi'
import { destr, safeDestr } from 'destr'
import { debounce } from 'lodash-es'
import { JSONEditor, Mode } from 'vanilla-jsoneditor'
import { computed, defineComponent, getCurrentInstance, h, isVue3, onMounted, onUnmounted, ref, unref, watch, watchEffect } from 'vue-demi'
import { conclude, resolveConfig } from 'vue-global-config'
import { PascalCasedName as name } from '../package.json'

type SFCWithInstall<T> = T & Plugin
type UpdatedContent = JSONContent & Partial<TextContent>
interface Parser { parse: typeof destr, stringify: typeof JSON.stringify }

const propsGlobal: Record<string, any> = {}
const attrsGlobal: Record<string, any> = {}

enum ModelValueProp {
  vue3 = 'modelValue',
  vue2 = 'value',
}
const modelValueProp: ModelValueProp = isVue3 ? ModelValueProp.vue3 : ModelValueProp.vue2

enum UpdateModelValueEvent {
  vue3 = 'update:modelValue',
  vue2 = 'input',
}
const updateModelValueEvent = isVue3 ? UpdateModelValueEvent.vue3 : UpdateModelValueEvent.vue2

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

const props = {
  [modelValueProp]: {},
  mode: {
    type: String as PropType<Mode>,
  },
  debounce: {
    type: Number as PropType<number>,
  },
  stringified: {
    type: Boolean as PropType<boolean>,
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
} as {
  [key in ModelValueProp]: object
} & {
  mode: { type: PropType<Mode> }
  debounce: { type: PropType<number> }
  stringified: { type: PropType<boolean>, default: undefined }
} & {
  [key in typeof boolAttrs[number]]: {
    type: PropType<boolean>
    default: undefined
  }
}

const JsonEditorVue = defineComponent({
  name,
  install(app: App, options?: typeof props): void {
    const optionsGlobal = resolveConfig(options || {}, { props })
    Object.assign(propsGlobal, optionsGlobal.props)
    Object.assign(attrsGlobal, optionsGlobal.attrs)
    app.component(name, this)
  },
  props,
  emits: {
    [updateModelValueEvent](_payload: any) {
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
        mode: modeComputed.value || Mode.tree,
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
    let parse = destr

    const updateModelValue = (updatedContent: UpdatedContent) => {
      preventUpdatingContent.value = true
      if (!stringifiedComputed.value && updatedContent.text) {
        if (jsonEditor.value && !jsonEditor.value.validate()) {
          updatedContent.json = parse(updatedContent.text)
        }
        updatedContent.text = undefined
      }
      emit(
        updateModelValueEvent,
        updatedContent.text === undefined
          ? updatedContent.json
          : updatedContent.text,
      )
    }
    const updateModelValueDebounced = debounce(updateModelValue, debounceComputed.value)

    const onChange = (updatedContent: UpdatedContent) => {
      if (modeComputed.value === 'text') {
        updateModelValueDebounced(updatedContent)
      }
      else {
        updateModelValue(updatedContent)
      }
    }

    const mergeFunction = (accumulator: (...args: any) => unknown, currentValue: (...args: any) => unknown) => (...args: any) => {
      accumulator(...args)
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
        ],
        {
          camelizeObjectKeys: true,
          defaultIsDynamic: true,
          default: (userProp: JSONEditorPropsOptional) => {
            parse = (userProp.parser as Parser)?.parse || destr
            return {
              onChange,
              onChangeMode,
              mode: modeComputed.value,
              // Can not just pass one of parse and stringify
              parser: {
                // SafeDestr is used by default so that it will not affect the result of jsonEditor.value.validate()
                // When stringified is disabled, destr is used by default for better performance (destr is only called when JSON is valid)
                parse: safeDestr,
                stringify: JSON.stringify,
              },
              ...(initialValue !== undefined && {
                content: {
                  [(typeof initialValue === 'string' && modeComputed.value === 'text' && stringifiedComputed.value)
                    ? 'text'
                    : 'json']: initialValue,
                },
              }),
            }
          },
          mergeFunction,
          mergeObject: 'shallow',
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
          parse = (newAttrs.parser as Parser)?.parse || destr
          jsonEditor.value?.updateProps(
            Object.getOwnPropertyNames(defaultFunctionAttrs).length > 0
              ? conclude([newAttrs, defaultFunctionAttrs], {
                camelizeObjectKeys: true,
                mergeFunction,
                mergeObject: 'shallow',
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

export default JsonEditorVue as SFCWithInstall<typeof JsonEditorVue>
