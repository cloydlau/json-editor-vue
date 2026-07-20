import type { JSONContent, JSONEditorPropsOptional, TextContent } from 'vanilla-jsoneditor'
import type { App, Plugin, PropType } from 'vue-demi'
import { destr, safeDestr } from 'destr'
import { debounce } from 'lodash-es'
import { createJSONEditor, Mode } from 'vanilla-jsoneditor'
import { computed, defineComponent, getCurrentInstance, h, isVue3, onMounted, onUnmounted, ref, unref, watch, watchEffect } from 'vue-demi'
import { conclude, resolveConfig } from 'vue-global-config'
import { PascalCasedName as name } from '../package.json'
import { BOOL_ATTRS } from './constants'

type SFCWithInstall<T> = T & Plugin
type UpdatedContent = JSONContent & Partial<TextContent>
interface Parser { parse: typeof destr, stringify: typeof JSON.stringify }

const propsGlobal: Record<string, any> = {}
const attrsGlobal: Record<string, any> = {}

enum ModelValueProp {
  vue3 = 'modelValue',
  vue2 = 'value',
}
/* v8 ignore next -- Vue 2 path; tests run on Vue 3 */
const modelValueProp: ModelValueProp = isVue3 ? ModelValueProp.vue3 : ModelValueProp.vue2

enum UpdateModelValueEvent {
  vue3 = 'update:modelValue',
  vue2 = 'input',
}
/* v8 ignore next -- Vue 2 path; tests run on Vue 3 */
const updateModelValueEvent = isVue3 ? UpdateModelValueEvent.vue3 : UpdateModelValueEvent.vue2

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
    BOOL_ATTRS.map(boolAttr => [
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
  [key in typeof BOOL_ATTRS[number]]: {
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
        type: String,
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
      return conclude([props.debounce, propsGlobal.debounce, 300], {
        type: Number,
      })
    })
    const stringifiedComputed = computed(() => conclude([props.stringified, propsGlobal.stringified, true], {
      type: Boolean,
    }))
    let parse = destr

    const updateModelValue = (updatedContent: UpdatedContent) => {
      preventUpdatingContent.value = true
      if (!stringifiedComputed.value && updatedContent.text) {
        try {
          // 校验并解析本次 onChange 的 text，而不是编辑器里可能尚未同步的内容
          // 默认 destr 遇非法 JSON 不抛错，故先用 safeDestr 做校验
          safeDestr(updatedContent.text)
          updatedContent.json = parse(updatedContent.text)
        }
        catch {
          // 非法 JSON：不写入 json，最终 emit undefined
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

    // debounce 等待时间随 prop 变化时重建，避免只在挂载时生效一次
    let updateModelValueDebounced = debounce(updateModelValue, debounceComputed.value)
    watch(debounceComputed, (wait) => {
      updateModelValueDebounced.cancel()
      updateModelValueDebounced = debounce(updateModelValue, wait)
    })

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
      updateModelValueDebounced.cancel()
      jsonEditor.value?.destroy()
    })

    onMounted(() => {
      const initialValue = conclude([props[modelValueProp], propsGlobal[modelValueProp]])
      const initialBoolAttrs = Object.fromEntries(
        Array.from(BOOL_ATTRS, boolAttr => [boolAttr, conclude([props[boolAttr], propsGlobal[boolAttr]])]).filter(
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
                // 编辑器用 safeDestr，避免非法 JSON 干扰 validate()
                // stringified 关闭时，onChange 路径先 safeDestr 校验再走 parse（默认 destr）
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

      jsonEditor.value = createJSONEditor({
        target: currentInstance?.$refs.jsonEditorRef as HTMLDivElement,
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
        () => Array.from(BOOL_ATTRS, boolAttr => props[boolAttr]),
        (values) => {
          jsonEditor.value?.updateProps(
            Object.fromEntries(Array.from(values, (v, i) => [BOOL_ATTRS[i], v]).filter(([, v]) => v !== undefined)),
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
      /* v8 ignore start */
      if (!expose) {
        expose = (exposed: Record<string, any> | undefined): void => {
          for (const k in exposed) {
            (currentInstance as any)[k] = unref(exposed[k])
          }
        }
        expose({ jsonEditor })
      }
      /* v8 ignore stop */
    })

    return () => h('div', { ref: 'jsonEditorRef' })
  },
})

export default JsonEditorVue as SFCWithInstall<typeof JsonEditorVue>
