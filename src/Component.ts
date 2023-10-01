import { debounce } from 'lodash-es'
import { JSONEditor } from 'vanilla-jsoneditor'
import type { Content, JSONContent, TextContent } from 'vanilla-jsoneditor'
import { defineComponent, getCurrentInstance, h, isVue3, onMounted, onUnmounted, ref, unref, watch } from 'vue-demi'
import type { PropType } from 'vue-demi'
import { conclude } from 'vue-global-config'
import { PascalCasedName as name } from '../package.json'
import { globalAttrs, globalProps } from './install'

export type Mode = 'text' | 'tree' | 'table'
type ModelValueProp = 'modelValue' | 'value'

const modelValueProp: ModelValueProp = isVue3 ? 'modelValue' : 'value'
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
  props: {
    [modelValueProp]: {},
    mode: {
      type: String as PropType<Mode>,
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
  } & { mode: { type: PropType<Mode> } } & {
    [key in typeof boolAttrs[number]]: {
      type: PropType<boolean>
      default: undefined
    }
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
    const preventUpdatingModelValue = ref(false)

    const onChange = debounce((updatedContent: Content) => {
      if (preventUpdatingModelValue.value) {
        preventUpdatingModelValue.value = false
        return
      }
      preventUpdatingContent.value = true
      emit(
        updateModelValue,
        (updatedContent as TextContent).text === undefined
          ? (updatedContent as JSONContent).json
          : (updatedContent as TextContent).text,
      )
    }, 100)

    const onChangeMode = (mode: Mode) => {
      emit('update:mode', mode)
    }

    const mergeFunction = (previousValue: (...args: any) => unknown, currentValue: (...args: any) => unknown) => (...args: any) => {
      previousValue(...args)
      currentValue(...args)
    }

    expose?.({ jsonEditor })

    onUnmounted(() => {
      jsonEditor.value?.destroy()
    })

    onMounted(() => {
      const initialMode = conclude([props.mode, globalProps.mode], {
        type: String as PropType<Mode>,
      })
      const initialValue = conclude([props[modelValueProp], globalProps[modelValueProp]])
      const initialBoolAttrs = Object.fromEntries(
        Array.from(boolAttrs, boolAttr => [boolAttr, conclude([props[boolAttr], globalProps[boolAttr]])]).filter(
          ([, v]) => v !== undefined,
        ),
      )
      const initialAttrs = conclude(
        [
          attrs,
          globalAttrs,
          {
            // Both user input & setting value programmatically will trigger onChange
            onChange,
            onChangeMode,
            mode: initialMode,
            ...initialBoolAttrs,
            ...(initialValue !== undefined && {
              content: {
                json: initialValue,
              },
            }),
          },
        ],
        {
          type: Object,
          mergeFunction,
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
            preventUpdatingModelValue.value = true
            jsonEditor.value.set(
              [undefined, ''].includes(newModelValue)
                // `undefined` is not accepted by vanilla-jsoneditor
                // The default value is `{ text: '' }`
                // Only default value can clear the editor
                ? { text: '' }
                : { json: newModelValue },
            )
          }
        },
        {
          deep: true,
        },
      )

      watch(
        () => props.mode,
        (mode) => {
          // `jsonEditor.value` could be `undefined` in Vue 2.6
          jsonEditor.value?.updateProps({
            mode,
          })
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
          if (newAttrs.onChange) {
            defaultFunctionAttrs.onChange = onChange
          }
          if (newAttrs.onChangeMode) {
            defaultFunctionAttrs.onChangeMode = onChangeMode
          }
          jsonEditor.value?.updateProps(
            Object.getOwnPropertyNames(defaultFunctionAttrs).length > 0
              ? conclude([newAttrs, defaultFunctionAttrs], {
                type: Object,
                mergeFunction,
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
