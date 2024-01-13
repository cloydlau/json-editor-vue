<script setup>
import { ref } from 'vue'

// import JsonEditorVue from 'json-editor-vue'

function JsonEditorVue() {
  return process.client
    ? import('json-editor-vue')
    : Promise.resolve({ render: h => h('div') })
}

const value = ref()
</script>

<template>
  <!-- <ClientOnly>
    <JsonEditorVue v-model="value" />
  </ClientOnly> -->
  <JsonEditorVue v-model="value" />
</template>
