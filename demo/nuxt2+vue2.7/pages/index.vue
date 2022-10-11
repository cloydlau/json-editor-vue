<template>
  <client-only>
    <JsonEditorVue v-model="value" />
  </client-only>
</template>

<script setup>
import { ref } from 'vue'

/* import JsonEditorVue from 'json-editor-vue'

Vue.use(() => process.client
  ? import('json-editor-vue')
  : Promise.resolve({ render: h => h('div') })) */

const value = ref(undefined)
</script>
