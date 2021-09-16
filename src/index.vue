<template>
  <div class="json-editor-vue">
    <vue-json-viewer
      v-show="Readonly"
      v-if="value"
      :value="value"
      v-bind="VueJsonViewerProps"
    />
    <div v-show="!Readonly" ref="jsonEditorVue"/>
  </div>
</template>

<script setup>
import { ref, computed, watch, inject, useAttrs, nextTick, onMounted, onUnmounted } from 'vue-demi'
import { JSONEditor } from 'svelte-jsoneditor/dist/jsoneditor.js'
import jsonrepair from 'jsonrepair'
import { getFinalProp, getGlobalAttrs } from 'kayran'
import VueJsonViewer from 'vue-json-viewer'
import globalConfig from './config.ts'

//const validator = createAjvValidator(schema, schemaRefs)

const name = 'json-editor-vue'
const props = defineProps({
  modelValue: {},
  vueJsonViewerProps: {},
  readonly: {}
})
const emit = defineEmits(['input'])

let elForm = inject('elForm')
let jsonEditor = ref(null)
let jsonEditorVue = ref(null)

const Readonly = computed(() => getFinalProp([
  [true, ''].includes(props.readonly) ? true : props.readonly,
  globalConfig.readonly,
  Boolean(elForm?.disabled)
], {
  type: 'boolean'
}))
const VueJsonViewerProps = computed(() => getFinalProp([
  props.vueJsonViewerProps,
  globalConfig.vueJsonViewerProps,
  {
    copyable: { copyText: '复制', copiedText: '已复制', timeout: 2000 },
    boxed: true,
    previewMode: true,
  }
], {
  type: 'object'
}))
const SvelteJsoneditorProps = computed(() => {
  return getFinalProp([
    useAttrs(),
    getGlobalAttrs(globalConfig, props),
    {
      //navigationBar: false,
      //statusBar: false,
      mainMenuBar: false,
      mode: 'code',
    }
  ])
})

function init () {
  jsonEditor = new JSONEditor({
    target: jsonEditorVue.value,
    props: {
      ...SvelteJsoneditorProps.value,
      json: props.modelValue,
      onBlur: () => {
        let newVal = jsonEditor.get()
        if (typeof newVal === 'string' && newVal) {
          try {
            newVal = jsonrepair(newVal)
          } catch (e) {
            //console.warn(e)
          }
        }
        emit('update:modelValue', newVal)
        SvelteJsoneditorProps.value.onBlur?.()
      },
    },
  })
}

watch(SvelteJsoneditorProps, n => {
  jsonEditor.destroy()
  jsonEditor = null
  init()
}, {
  deep: true,
})

watch(Readonly, n => {
  if (!n && !jsonEditor.value) {
    nextTick(init)
  }
})

onMounted(init)

onUnmounted(() => {
  jsonEditor.destroy()
})
</script>

<style lang="scss" scoped>
.json-editor-vue {

  ::v-deep .jsoneditor-main {
    height: 200px;
  }

  & > .jv-container {
    //overflow: auto; // 引起svelte-jsoneditor闪烁

    ::v-deep .jv-code {
      padding: 0;
    }

    ::v-deep .jv-code.boxed {
      max-height: 160px;
    }
  }

  ::v-deep .jsoneditor-main {
    border: thin solid lightgrey;
    box-shadow: none !important;

    &:hover {
      box-shadow: 0 0 10px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04) !important;
    }
  }
}
</style>
