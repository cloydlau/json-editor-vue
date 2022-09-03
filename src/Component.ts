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
import type { ComponentInternalInstance } from 'vue-demi'
import { JSONEditor } from 'vanilla-jsoneditor'
import { conclude } from 'vue-global-config'
import { debounce } from 'lodash-es'
import { globalAttrs } from './index'

type Mode = 'tree' | 'text'
type ValueKey = 'json' | 'text'

const defaultMode: Mode = 'tree'

const valuePropName = isVue3 ? 'modelValue' : 'value'
const eventName = isVue3 ? 'update:modelValue' : 'input'

export default defineComponent({
  name: 'JsonEditorVue',
  props: {
    [valuePropName]: {},
  },
  setup(props, { attrs, emit, expose }) {
    // 如果用户指定了模式就用用户指定的模式
    // 否则根据初始值的类型，如果是字符串，则使用 text 模式
    // 否则使用 vanilla-jsoneditor 默认的 tree 模式
    const handleMode = (mode?: Mode): Mode => mode ?? (typeof props[valuePropName] === 'string' ? 'text' : defaultMode)
    const modeToValueKey = (mode: Mode): ValueKey => ({ text: 'text', tree: 'json' }[mode] as ValueKey)

    const currentInstance = getCurrentInstance() as ComponentInternalInstance
    const jsonEditor = ref()
    const mode = ref<Mode>(defaultMode)
    const valueKey = computed(() => modeToValueKey(mode.value))

    const syncValue = debounce((updatedContent: { text: string; json: any }) => {
      emit(eventName, updatedContent.text === undefined ? updatedContent.json : updatedContent.text)
    }, 100)

    const JsoneditorProps = conclude([attrs, globalAttrs, {
      // vanilla-jsoneditor@0.7 以后，用户输入 / 编程式设值 / 改变模式 都会触发 onChange
      onChange: syncValue,
      onChangeMode(newMode: Mode) {
        mode.value = newMode
      },
    }], {
      camelCase: false,
      mergeFunction: (globalFunction: Function, defaultFunction: Function) => (...args: any) => {
        globalFunction(...args)
        defaultFunction(...args)
      },
      ...props[valuePropName] !== undefined && {
        default: (userProp: { [key: string]: any }) => {
          mode.value = handleMode(userProp.mode)
          return {
            mode: mode.value,
            content: {
              [valueKey.value]: props[valuePropName],
            },
          }
        },
        defaultIsDynamic: true,
      },
    })

    watch(() => props[valuePropName], (n: any) => {
      // vanilla-jsoneditor 不接受 undefined
      // 其默认值为 { text: '' }
      // 只有默认值才能清空编辑器
      jsonEditor.value.update([undefined, ''].includes(n)
        ? { text: '' }
        : {
          // text 模式只接受 string
            [valueKey.value]: (typeof n !== 'string' && mode.value === 'text')
              ? JSON.stringify(n)
              : n,
          })
    }, {
      deep: true,
    })

    watch(() => attrs, (n) => {
      mode.value = handleMode(n.mode as Mode | undefined)
      jsonEditor.value.updateProps(n)
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

    if (isVue3)
      expose({ jsonEditor, mode })

    return () => h('div', { ref: 'jsonEditorRef' })
  },
})
