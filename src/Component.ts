import {
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

type Mode = 'tree' | 'text' | undefined
type ValueKey = 'json' | 'text'

const valuePropName = isVue3 ? 'modelValue' : 'value'
const eventName = isVue3 ? 'update:modelValue' : 'input'

export default defineComponent({
  name: 'JsonEditorVue',
  props: [valuePropName],
  setup(props, { attrs, emit, expose }) {
    const currentInstance = getCurrentInstance() as ComponentInternalInstance
    const syncingValue = ref(false)
    const jsonEditor = ref()
    // 初始模式为 tree，故初始 valueKey 为 json
    const valueKey = ref<ValueKey>('json')

    const syncValue = debounce((updatedContent: { text: string; json: any }) => {
      syncingValue.value = true
      emit(eventName, updatedContent[valueKey.value])
    }, 100)

    const modeToValueKey = (mode: Mode): ValueKey =>
      mode ? { text: 'text', tree: 'json' }[mode] as ValueKey : valueKey.value

    const SvelteJsoneditorProps = conclude([attrs, globalAttrs, {
      // onBlur: () => {syncValue(true)}, // 回车会触发失焦
      onChange: syncValue, // 考虑到有切换 boolean 值的情况，还是用 onChange 更加合适
      onChangeMode(mode: Mode) {
        valueKey.value = modeToValueKey(mode)
      },
    }], {
      camelCase: false,
      mergeFunction: (globalFunction: Function, defaultFunction: Function) => (...args: any) => {
        globalFunction(...args)
        defaultFunction(...args)
      },
      ...props[valuePropName] !== undefined && {
        default: ({ mode }: { mode: Mode }) => {
          valueKey.value = modeToValueKey(mode)
          return {
            content: {
              [valueKey.value]: props[valuePropName],
            },
          }
        },
        defaultIsDynamic: true,
      },
    })

    watch(() => props[valuePropName], (n) => {
      if (syncingValue.value) {
        syncingValue.value = false
        return
      }
      jsonEditor.value.set(
        // svelte-jsoneditor 不接受 undefined
        // 其默认值为 { text: '' }
        // 只有默认值才能清空编辑器
        n === undefined
          ? { text: '' }
          : {
              [valueKey.value]:
              // text 模式只接受 string
              (typeof n !== 'string' && valueKey.value === 'text')
                ? JSON.stringify(n)
                : n,
            },
      )
    }, {
      deep: true,
    })

    watch(() => attrs, (n) => {
      valueKey.value = modeToValueKey(n.mode as Mode)
      jsonEditor.value.updateProps(n)
    }, {
      deep: true,
    })

    onMounted(() => {
      jsonEditor.value = new JSONEditor({
        target: currentInstance.proxy?.$refs.jsonEditorRef as Element,
        props: SvelteJsoneditorProps,
      })
    })

    onUnmounted(() => {
      jsonEditor.value.destroy()
    })

    if (isVue3)
      expose({ jsonEditor })

    return () => h('div', { ref: 'jsonEditorRef' })
  },
})
