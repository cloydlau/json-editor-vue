import JsonEditorVue from './index.vue'

const install = Vue => {
  if (install.installed) {
    return
  }
  Vue.component(JsonEditorVue.name, JsonEditorVue)
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export default {
  install,
  JsonEditorVue
}
