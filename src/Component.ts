import {
  isVue3,
  defineComponent,
  ref,
  computed,
  watch,
  onMounted,
  onUnmounted,
  h,
  getCurrentInstance,
  //vShow, // 不支持 Vue 2
  //withDirectives, // 不支持 Vue 2
} from 'vue-demi'
import type { ComponentInternalInstance } from 'vue-demi'
import { JSONEditor } from 'svelte-jsoneditor/dist/jsoneditor.js'
//import jsonrepair from 'jsonrepair'
import { conclude } from 'vue-global-config'
import { globalAttrs } from './index'
import { throttle, cloneDeep } from 'lodash-es'

type Mode = 'tree' | 'code' | undefined
type ValueKey = 'json' | 'text'

const valuePropName = isVue3 ? 'modelValue' : 'value'

export default defineComponent({
  name: 'JsonEditorVue',
  props: [valuePropName],
  setup(props, { attrs, emit }) {
    const currentInstance = getCurrentInstance() as ComponentInternalInstance
    const syncingValue = ref(false)
    const eventName = isVue3 ? 'update:modelValue' : 'input'
    const jsonEditor = ref() as JSONEditor
    // 防止被 computed 追踪
    const initialValue = cloneDeep(props[valuePropName])

    const syncValue = throttle((updatedContent: { text: string, json: any }) => {
      syncingValue.value = true
      emit(eventName, updatedContent[valueKey.value])
    }, 100, {
      leading: false,
      trailing: true
    })

    const modeToValueKey = (mode: Mode): ValueKey =>
      mode === 'code' ? 'text' : 'json'

    const SvelteJsoneditorProps = computed(() => {
      return conclude([attrs, globalAttrs, {
        //onBlur: () => {syncValue(true)}, // 回车会触发失焦
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
          default: (userProp: { [key: string]: any }) => ({
            content: {
              [modeToValueKey(userProp.mode)]: initialValue,
            },
          }),
          defaultIsDynamic: true,
        }
      })
    })

    const valueKey = ref<ValueKey>(modeToValueKey(SvelteJsoneditorProps.value.mode))

    watch(() => props[valuePropName], (n, o) => {
      if (syncingValue.value) {
        syncingValue.value = false
        return
      }
      jsonEditor.value.update(
        // svelte-jsoneditor 不接受 undefined
        // 其默认值为 { text: '' }
        // 只有 { text: '' } 才能清空编辑器
        n === undefined ? { text: '' } :
          {
            [valueKey.value]:
              // code 模式只接受 string
              (typeof n !== 'string' && valueKey.value === 'text') ?
                JSON.stringify(n) :
                n
          }
      )
    }, {
      deep: true
    })

    watch(SvelteJsoneditorProps, n => {
      valueKey.value = modeToValueKey(n.mode)
      delete n.content // 不删除 content 将导致 content 被初始值覆盖
      jsonEditor.value.updateProps(n)
    }, {
      deep: true
    })

    onMounted(() => {
      jsonEditor.value = new JSONEditor({
        target: currentInstance.refs.jsonEditorRef,
        props: SvelteJsoneditorProps.value,
      })
    })

    onUnmounted(() => {
      jsonEditor.value.destroy()
    })

    return () => h('div', {
      ref: 'jsonEditorRef',
      /*...isVue3 ?
        {
          onMouseout: syncValue,
        } :
        {
          on: {
            mouseout: syncValue,
          }
        }*/
    })
  },
  /*render (ctx: any) {
    // vue 2 中 ctx 为渲染函数 h
    return h('div', { ref: isVue3 ? ctx.jsonEditorRef : 'jsonEditorRef' })
  }*/
})
