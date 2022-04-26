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
import { throttle } from 'lodash-es'
//import { formContextKey } from 'element-plus'

export default defineComponent({
  name: 'JsonEditorVue',
  props: [isVue3 ? 'modelValue' : 'value'],
  setup(props, { attrs, emit }) {
    const currentInstance = getCurrentInstance()
    const syncingValue = ref(false)
    const eventName = isVue3 ? 'update:modelValue' : 'input'

    const syncValue = throttle(() => {
      syncingValue.value = true
      let { text, json } = jsonEditor.value?.get()
      let value = text ?? json
      /*if (typeof value === 'string' && value) {
        try {
          value = jsonrepair(value)
        } catch (e) {
          //console.warn(e)
        }
      }*/
      emit(eventName, value)
    }, 100, {
      leading: false,
      trailing: true
    })

    //const elForm = inject(isVue3 ? formContextKey : 'elForm', { disabled: false })

    const jsonEditor = ref(null)

    // Vue 2 中报错
    //const jsonEditorRef = ref(null)

    const SvelteJsoneditorProps = computed(() => {
      return conclude([attrs, globalAttrs, {
        //readOnly: Boolean(elForm.disabled),
        //onBlur: () => {syncValue(true)}, // 回车会触发失焦
        onChange: syncValue, // 考虑到有切换 boolean 值的情况，还是用 onChange 更加合适
      }], {
        camelCase: false,
        mergeFunction: (globalFunction: Function, defaultFunction: Function) => (...args: any) => {
          globalFunction(...args)
          defaultFunction(...args)
        },
      })
    })

    watch(() => props[isVue3 ? 'modelValue' : 'value'], (n, o) => {
      if (syncingValue.value) {
        syncingValue.value = false
        return
      }

      let text, json
      if (n) {
        if (typeof text === 'string') {
          text = n
        } else {
          json = n
        }
      } else {
        text = ''
      }
      jsonEditor.value?.update({ text, json })
    })

    onMounted(() => {
      jsonEditor.value = new JSONEditor({
        target: currentInstance.refs.jsonEditorRef,
        props: {
          ...SvelteJsoneditorProps.value,
          content: {
            json: props[isVue3 ? 'modelValue' : 'value'] ?? '',
          },
        },
      })
    })

    watch(SvelteJsoneditorProps, n => {
      jsonEditor.value?.updateProps(n)
    }, {
      deep: true,
    })

    onUnmounted(() => {
      jsonEditor.value?.destroy?.()
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
