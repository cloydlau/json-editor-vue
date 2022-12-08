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
import type { PropType } from 'vue-demi'
import { JSONEditor } from 'vanilla-jsoneditor'
import { conclude } from 'vue-global-config'
import { debounce } from 'lodash-es'
import { pascalCasedName as name } from '../package.json'
import { globalAttrs, globalProps } from './install'

export type Mode = 'tree' | 'text' | 'table'

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
  name,
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
    const currentInstance = getCurrentInstance()?.proxy
    const jsonEditor = ref()

    const preventUpdate = ref(false)
    const preventOnChange = ref(false)

    const initialMode = conclude([props.mode, globalProps.mode])
    const initialValue = conclude([props[modelValueProp], globalProps[modelValueProp]], {
      camelCase: false,
    })
    const initialBoolAttrs = Object.fromEntries(Array.from(boolAttrs, boolAttr =>
      [boolAttr, conclude([props[boolAttr], globalProps[boolAttr]])])
      .filter(([, v]) => v !== undefined))

    const onChange = debounce((updatedContent: { text: string; json: any }) => {
      if (preventOnChange.value) {
        preventOnChange.value = false
        return
      }
      preventUpdate.value = true
      emit(updateModelValue, updatedContent.text === undefined
        ? updatedContent.json
        : updatedContent.text)
    }, 100)

    const onChangeMode = (mode: Mode) => {
      emit('update:mode', mode)
    }

    const mergeFunction = (previousValue: Function, currentValue: Function) => (...args: any) => {
      previousValue(...args)
      currentValue(...args)
    }

    const initialAttrs = conclude([attrs, globalAttrs, {
      // Both user input & setting value programmatically will trigger onChange
      onChange,
      onChangeMode,
      mode: initialMode,
      ...initialBoolAttrs,
      ...initialValue !== undefined && {
        content: {
          json: initialValue,
        },
      },
    }], {
      camelCase: false,
      mergeFunction,
    })

    watch(() => props[modelValueProp], (n: any) => {
      if (preventUpdate.value) {
        preventUpdate.value = false
        return
      }
      preventOnChange.value = true
      // `jsonEditor.value` could be `undefined` in Vue 2.6 (dev environment)
      jsonEditor.value?.update([undefined, ''].includes(n)
        // `undefined` is not accepted by vanilla-jsoneditor
        // The default value is `{ text: '' }`
        // Only default value can clear the editor
        ? { text: '' }
        : { json: n })
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

    watch(() => attrs, (newAttrs) => {
      // Functions need to be merged again
      const defaultFunctionAttrs: { onChange?: Function; onChangeMode?: Function } = {}
      if (newAttrs.onChange) {
        defaultFunctionAttrs.onChange = onChange
      }
      if (newAttrs.onChangeMode) {
        defaultFunctionAttrs.onChangeMode = onChangeMode
      }
      jsonEditor.value.updateProps(Object.getOwnPropertyNames(defaultFunctionAttrs).length > 0
        ? conclude([newAttrs, defaultFunctionAttrs], {
          camelCase: false,
          mergeFunction,
        })
        : newAttrs)
    }, {
      deep: true,
    })

    expose?.({ jsonEditor })

    onUnmounted(() => {
      jsonEditor.value.destroy()
    })

    onMounted(() => {
      jsonEditor.value = new JSONEditor({
        target: currentInstance?.$refs.jsonEditorRef as Element,
        props: initialAttrs,
      })

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
