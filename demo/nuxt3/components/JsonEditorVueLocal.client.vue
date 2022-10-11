<template>
  <JsonEditorVue v-model="value" />
</template>

<script setup>
import JsonEditorVue from 'json-editor-vue'

const value = ref()
</script>
