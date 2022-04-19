<template>
  <div>
    <json-editor-vue v-model="data.value" v-bind="data.props"/>

    <p>Value</p>
    {{ JSON.stringify(data.value) }}
    <button @click="data.value = 321">编程式设值</button>

    <p>Props</p>
    <json-editor-vue v-model="data.props"/>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import JsonEditorVue from '../src'

let data = reactive({
  value: 123,
  props: {
    mode: 'tree'
  }
})
</script>

<!--<script>
import JsonEditorVue from '../src'

export default {
  components: { JsonEditorVue },
  data () {
    return {
      data: {
        value: 123,
        props: {
          mode: 'tree'
        }
      }
    }
  },
}
</script>-->
