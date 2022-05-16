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
import { JSONEditor } from 'svelte-jsoneditor/dist/jsoneditor.js'
//import jsonrepair from 'jsonrepair'
import { conclude } from 'vue-global-config'
import { globalAttrs } from './index'
import { throttle, cloneDeep } from 'lodash-es'

const valuePropName = isVue3 ? 'modelValue' : 'value'

export default defineComponent({
  name: 'JsonEditorVue',
  props: [valuePropName],
  setup(props, { attrs, emit }) {
    const currentInstance = getCurrentInstance()
    const syncingValue = ref(false)
    const eventName = isVue3 ? 'update:modelValue' : 'input'
    const jsonEditor = ref(null)
    // 防止被 computed 追踪
    const initialValue = cloneDeep(props[valuePropName])

    const syncValue = throttle((updatedContent: { text: string | null, json: any }) => {
      syncingValue.value = true
      emit(eventName, updatedContent[valueKey.value])
    }, 100, {
      leading: false,
      trailing: true
    })

    const modeToValueKey = (mode: string): string =>
      mode === 'code' ? 'text' : 'json'

    const SvelteJsoneditorProps = computed(() => {
      return conclude([attrs, globalAttrs, {
        //onBlur: () => {syncValue(true)}, // 回车会触发失焦
        onChange: syncValue, // 考虑到有切换 boolean 值的情况，还是用 onChange 更加合适
        onChangeMode(mode: string) {
          valueKey.value = modeToValueKey(mode)
        },
      }], {
        camelCase: false,
        mergeFunction: (globalFunction: Function, defaultFunction: Function) => (...args: any) => {
          globalFunction(...args)
          defaultFunction(...args)
        },
        default: (userProp: { [key: string]: any }) => ({
          content: {
            [modeToValueKey(userProp.mode)]: initialValue,
          },
        }),
        defaultIsDynamic: true,
      })
    })

    const valueKey = ref(modeToValueKey(SvelteJsoneditorProps.value.mode))

    watch(() => props[valuePropName], (n, o) => {
      if (syncingValue.value) {
        syncingValue.value = false
        return
      }
      // code 模式只接受 string
      if (valueKey.value === 'text' && typeof n !== 'string') {
        n = String(n)
      }
      // svelte-jsoneditor 不接受 undefined
      jsonEditor.value.update({ [valueKey.value]: n ?? null })
    })

    onMounted(() => {
      jsonEditor.value = new JSONEditor({
        target: currentInstance.refs.jsonEditorRef,
        props: SvelteJsoneditorProps.value,
      })
    })

    watch(SvelteJsoneditorProps, n => {
      valueKey.value = modeToValueKey(n.mode)
      delete n.content // 不删除 content 将导致 content 被初始值覆盖
      jsonEditor.value.updateProps(n)
    }, {
      deep: true
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
