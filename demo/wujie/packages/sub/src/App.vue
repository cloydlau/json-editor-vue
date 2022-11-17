<script setup lang="ts">
import JsonEditorVue from 'json-editor-vue'
</script>

<template>
  <div style="border: 1px solid lightgrey; padding: 1rem;">
    I am sub.
    <JsonEditorVue :modelValue="123" style="width: 370px;" />
  </div>
</template>
