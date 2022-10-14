import {
  defineComponent,
  getCurrentInstance,
  h,
  isVue3,
  onMounted,
  onUnmounted,
  ref,
  unref,
  watch,
} from 'vue-demi'
import type {
  ComponentPublicInstance,
  PropType,
} from 'vue-demi'
import { JSONEditor } from 'vanilla-jsoneditor'
import { conclude } from 'vue-global-config'
import { debounce } from 'lodash-es'
import { globalAttrs, globalProps } from './index'

export type Mode = 'tree' | 'text'
type ValueKey = 'json' | 'text'

const defaultMode: Mode = 'tree'

const modelValueProp = isVue3 ? 'modelValue' : 'value'
const updateModelValue = isVue3 ? 'update:modelValue' : 'input'

const boolAttrs = [
  'mainMenuBar',
  'navigationBar',
  'statusBar',
  'readOnly',
  'escapeControlCharacters',
  'escapeUnicodeCharacters',
]

export default defineComponent({
  name: 'JsonEditorVue',
  props: {
    [modelValueProp]: {},
    mode: {
      type: String as PropType<Mode>,
    },
    ...Object.fromEntries(Array.from(boolAttrs, boolAttr => [boolAttr, {
      type: Boolean,
      default: undefined,
    }])),
  },
  emits: [updateModelValue, 'update:mode'],
  setup(props, { attrs, emit, expose }) {
    const modeToContentKey = (mode?: Mode): ValueKey => ({ text: 'text', tree: 'json' }[mode ?? defaultMode] as ValueKey)

    const currentInstance = getCurrentInstance()?.proxy as ComponentPublicInstance
    const jsonEditor = ref()

    const preventUpdate = ref(false)
    const preventOnChange = ref(false)

    const initialMode = conclude([props.mode, globalProps.mode])
    const initialValue = conclude([props[modelValueProp], globalProps[modelValueProp]])
    const initialBoolAttrs = Object.fromEntries(Array.from(boolAttrs, boolAttr =>
      [boolAttr, conclude([props[boolAttr], globalProps[boolAttr]])])
      .filter(([, v]) => v !== undefined))
    const initialAttrs = conclude([attrs, globalAttrs, {
      // Both user input & setting value programmatically will trigger onChange
      onChange: debounce((updatedContent: { text: string; json: any }) => {
        if (preventOnChange.value) {
          preventOnChange.value = false
          return
        }
        preventUpdate.value = true
        emit(updateModelValue, updatedContent.text === undefined
          ? updatedContent.json
          : updatedContent.text)
      }, 100),
      onChangeMode(mode: Mode) {
        emit('update:mode', mode)
      },
      mode: initialMode,
      ...initialBoolAttrs,
      ...initialValue !== undefined && {
        content: {
          [modeToContentKey(initialMode)]: initialValue,
        },
      },
    }], {
      camelCase: false,
      mergeFunction: (globalFunction: Function, defaultFunction: Function) => (...args: any) => {
        globalFunction(...args)
        defaultFunction(...args)
      },
    })

    watch(() => props[modelValueProp], (n: any) => {
      if (preventUpdate.value) {
        preventUpdate.value = false
        return
      }
      // undefined is not accepted by vanilla-jsoneditor
      // The default value is { text: '' }
      // Only default value can clear the editor
      preventOnChange.value = true
      jsonEditor.value.update([undefined, ''].includes(n)
        ? { text: '' }
        : {
          // Text mode take strings only
          // @ts-expect-error: props.mode can't be a boolean
            [modeToContentKey(props.mode)]: n,
          })
    }, {
      deep: true,
    })

    watch(() => props.mode, (mode) => {
      jsonEditor.value.updateProps({
        mode,
      })
    })

    watch(() => Array.from(boolAttrs, boolAttr => props[boolAttr]), (values) => {
      jsonEditor.value.updateProps(Object.fromEntries(Array.from(values, (v, i) =>
        [boolAttrs[i], v]).filter(([, v]) => v !== undefined)))
    })

    watch(() => attrs, (attrs) => {
      jsonEditor.value.updateProps(attrs)
    }, {
      deep: true,
    })

    expose?.({ jsonEditor })

    onUnmounted(() => {
      jsonEditor.value.destroy()
    })

    onMounted(() => {
      jsonEditor.value = new JSONEditor({
        target: currentInstance.$refs.jsonEditorRef as Element,
        props: initialAttrs,
      })

      // There's no expose in @vue/composition-api
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
