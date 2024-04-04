<script setup>
const value = ref()
</script>

<template>
  <client-only>
    <JsonEditorVue v-model="value" />
  </client-only>
</template>
