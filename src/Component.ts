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
  // vShow, // 不支持 Vue 2
  // withDirectives, // 不支持 Vue 2
} from 'vue-demi'
import type { ComponentInternalInstance } from 'vue-demi'
import { JSONEditor } from 'vanilla-jsoneditor'
// import jsonrepair from 'jsonrepair'
import { conclude } from 'vue-global-config'
import { cloneDeep, debounce } from 'lodash-es'
import { globalAttrs } from './index'

type Mode = 'tree' | 'text' | undefined
type ValueKey = 'json' | 'text'

const valuePropName = isVue3 ? 'modelValue' : 'value'

export default defineComponent({
  name: 'JsonEditorVue',
  props: [valuePropName],
  setup(props, { attrs, emit }) {
    const currentInstance = getCurrentInstance() as ComponentInternalInstance
    const syncingValue = ref(false)
    const eventName = isVue3 ? 'update:modelValue' : 'input'
    const jsonEditor = ref()
    // 初始模式为 tree，故初始 valueKey 为 json
    const valueKey = ref<ValueKey>('json')
    // 防止被 computed 追踪
    const initialValue = cloneDeep(props[valuePropName])

    const syncValue = debounce((updatedContent: { text: string; json: any }) => {
      syncingValue.value = true
      emit(eventName, updatedContent[valueKey.value])
    }, 100)

    const modeToValueKey = (mode: Mode): ValueKey =>
      mode ? { text: 'text', tree: 'json' }[mode] as ValueKey : valueKey.value

    const SvelteJsoneditorProps = computed(() => {
      return conclude([attrs, globalAttrs, {
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
        ...initialValue !== undefined && {
          default: ({ mode }: { mode: Mode }) => {
            valueKey.value = modeToValueKey(mode)
            return {
              content: {
                [valueKey.value]: initialValue,
              },
            }
          },
          defaultIsDynamic: true,
        },
      })
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

    watch(SvelteJsoneditorProps, (n) => {
      valueKey.value = modeToValueKey(n.mode)
      delete n.content // 不删除 content 将导致 content 被初始值覆盖
      jsonEditor.value.updateProps(n)
    }, {
      deep: true,
    })

    onMounted(() => {
      jsonEditor.value = new JSONEditor({
        target: currentInstance.proxy.$refs.jsonEditorRef,
        props: SvelteJsoneditorProps.value,
      })
    })

    onUnmounted(() => {
      jsonEditor.value.destroy()
    })

    return () => h('div', {
      ref: 'jsonEditorRef',
      /* ...isVue3 ?
        {
          onMouseout: syncValue,
        } :
        {
          on: {
            mouseout: syncValue,
          }
        } */
    })
  },
  /* render (ctx: any) {
    // vue 2 中 ctx 为渲染函数 h
    return h('div', { ref: isVue3 ? ctx.jsonEditorRef : 'jsonEditorRef' })
  } */
})
