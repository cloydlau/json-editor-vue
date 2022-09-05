import {
  computed,
  defineComponent,
  getCurrentInstance,
  h,
  isVue3,
  onMounted,
  onUnmounted,
  ref,
  watch,
} from 'vue-demi'
import type {
  ComponentInternalInstance,
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

export default defineComponent({
  name: 'JsonEditorVue',
  props: {
    [modelValueProp]: {},
    mode: {
      type: String as PropType<Mode>,
    },
  },
  emits: [updateModelValue, 'update:mode'],
  setup(props, { attrs, emit, expose }) {
    const modeToContentKey = (mode?: Mode): ValueKey => ({ text: 'text', tree: 'json' }[mode ?? defaultMode] as ValueKey)

    const currentInstance = getCurrentInstance() as ComponentInternalInstance
    const preventUpdate = ref(false)
    const preventOnChange = ref(false)
    const jsonEditor = ref()
    const valueKey = computed(() => modeToValueKey(handleMode(props.mode as Mode)))
    const JsoneditorProps = conclude([attrs, globalAttrs, {
      // vanilla-jsoneditor@0.7 以后，用户输入 / 编程式设值 / 模式变更为 tree 都会触发 onChange
    const initialMode = conclude([props.mode, globalProps.mode])
    const initialValue = conclude([props[modelValueProp], globalProps[modelValueProp]])
      onChange: debounce((updatedContent: { text: string; json: any }) => {
        if (preventOnChange.value) {
          preventOnChange.value = false
          return
        }
        preventUpdate.value = true
        emit(updateModelValue, updatedContent.text === undefined ? updatedContent.json : updatedContent.text)
      }, 100),
      onChangeMode(mode: Mode) {
        emit('update:mode', mode)
      },
      mode: initialMode,
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

    emit('update:mode', JsoneditorProps.mode)

    watch(() => props[modelValueProp], (n: any) => {
      if (preventUpdate.value) {
        preventUpdate.value = false
        return
      }
      // vanilla-jsoneditor 不接受 undefined
      // 其默认值为 { text: '' }
      // 只有默认值才能清空编辑器
      preventOnChange.value = true
      jsonEditor.value.update([undefined, ''].includes(n)
        ? { text: '' }
        : {
          // text 模式只接受 string
            [valueKey.value]: (typeof n !== 'string' && props.mode === 'text')
              ? JSON.stringify(n)
              : n,
          })
    }, {
      deep: true,
    })

    watch(() => props.mode, (mode) => {
      jsonEditor.value.updateProps({
        mode,
      })
    })

    watch(() => attrs, (props) => {
      jsonEditor.value.updateProps(props)
    }, {
      deep: true,
    })

    onMounted(() => {
      jsonEditor.value = new JSONEditor({
        target: currentInstance.proxy?.$refs.jsonEditorRef as Element,
        props: JsoneditorProps,
      })
    })

    onUnmounted(() => {
      jsonEditor.value.destroy()
    })

    // vue@2.6 中没有 expose
    expose?.({ jsonEditor })

    return () => h('div', { ref: 'jsonEditorRef' })
  },
})
