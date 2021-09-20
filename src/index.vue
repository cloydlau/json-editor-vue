<template>
  <div v-show="!Readonly" ref="jsonEditorVue"/>
  <json-viewer
    v-show="Readonly&&$props.modelValue"
    :value="$props.modelValue"
    v-bind="VueJsonViewerProps"
  />
</template>

<script>
export default {
  name: 'JsonEditorVue',
}
</script>

<script setup>
import { ref, reactive, computed, watch, inject, toRaw, useAttrs, nextTick, onMounted, onUnmounted } from 'vue-demi'
import { JSONEditor } from 'svelte-jsoneditor/dist/jsoneditor.js'
import jsonrepair from 'jsonrepair'
import { getFinalProp, getGlobalAttrs } from 'kayran'
//import Vue3JsonViewer from 'vue3-json-viewer'
import globalConfig from './config.ts'
import { elFormKey } from 'element-plus/lib/tokens'

//const validator = createAjvValidator(schema, schemaRefs)

const $props = defineProps([
  'modelValue',
  'vueJsonViewerProps',
  'readonly'
])
const emit = defineEmits(['update:modelValue', 'change'])

let elForm = inject(elFormKey, {})
let jsonEditor = reactive({})
let syncing = ref(false)
const Readonly = computed(() => getFinalProp([
  [true, ''].includes($props.readonly) ? true : $props.readonly,
  globalConfig.readonly,
  Boolean(elForm.disabled)
], {
  type: 'boolean'
}))

function syncValue (n) {
  syncing.value = true
  let { text, json } = n
  let value = text ?? json
  if (typeof value === 'string' && value) {
    try {
      value = jsonrepair(value)
    } catch (e) {
      //console.warn(e)
    }
  }
  emit('update:modelValue', value)
}

const VueJsonViewerProps = computed(() => getFinalProp([
  toRaw($props.vueJsonViewerProps),
  globalConfig.vueJsonViewerProps,
  {
    copyable: {
      copyText: '复制',
      copiedText: '已复制',
      timeout: 2000
    },
    boxed: true,
    previewMode: true,
  }
], {
  type: 'object'
}))
const SvelteJsoneditorProps = computed(() => {
  return getFinalProp([
    { ...useAttrs() },
    getGlobalAttrs(globalConfig, toRaw($props)),
    /*{
      navigationBar: false,
      statusBar: false,
      mainMenuBar: false,
      mode: 'code',
    }*/
  ], {
    mergeFunction: (accumulator, item) => n => {
      item?.(n)
      accumulator(n)
    },
    default: ({ mode }) => mode === 'code' ? {
      onBlur: () => {
        // tree模式无法获取编辑状态下的值，包括onBlur时，所以失焦同步仅适用于code模式
        syncValue(jsonEditor.get())
      }
    } : {
      onChange: n => {
        syncValue(n)
      }
    },
    defaultIsDynamic: true,
  })
})

let jsonEditorVue = ref(null)

function init () {
  if (!Readonly.value) {
    jsonEditor = new JSONEditor({
      target: jsonEditorVue.value,
      props: {
        ...SvelteJsoneditorProps.value,
        content: {
          json: toRaw($props.modelValue) ?? '',
        },
      },
    })
  }
}

watch(() => $props.modelValue, (n, o) => {
  if (syncing.value) {
    syncing.value = false
  } else {
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
    jsonEditor?.update({ text, json })
  }
})

watch(SvelteJsoneditorProps, n => {
  console.log(n)
  /*jsonEditor.destroy()
  jsonEditor = null
  init()*/
  jsonEditor.updateProps(n)
}, {
  deep: true,
})
watch(Readonly, n => {
  if (!n && !jsonEditor) {
    nextTick(init)
  }
})

onMounted(() => {
  init()
})

onUnmounted(() => {
  jsonEditor.destroy?.()
})
</script>

<style lang="scss" scoped>
/*:deep(.jsoneditor-main) {
  height: 200px;
}*/

/*.jv-container {
  //overflow: auto; // 引起svelte-jsoneditor闪烁

  :deep(.jv-code) {
    padding: 0;
  }

  :deep(.jv-code.boxed) {
    max-height: 160px;
  }
}*/

/*:deep(.jsoneditor-main) {
  border: thin solid lightgrey;
  box-shadow: none !important;

  &:hover {
    box-shadow: 0 0 10px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04) !important;
  }
}*/
</style>
