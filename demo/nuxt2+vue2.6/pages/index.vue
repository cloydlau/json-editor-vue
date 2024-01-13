<script>
import Vue from 'vue'
import VueCompositionAPI from '@vue/composition-api'

Vue.use(VueCompositionAPI)

export default {
  components: {
    JsonEditorVue: () => process.client
      ? import('json-editor-vue')
      : Promise.resolve({ render: h => h('div') }),
  },
  data() {
    return {
      value: undefined,
    }
  },
}
</script>

<template>
  <!-- <ClientOnly>
    <JsonEditorVue v-model="value" />
  </ClientOnly> -->
  <JsonEditorVue v-model="value" />
</template>
