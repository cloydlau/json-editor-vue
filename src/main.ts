import JsonEditorVue from './index.vue'
import {init} from "./config.ts"

const install = (Vue, opts = {}) => {
  if (install.installed) {
    return
  }
  init(opts)
  Vue.component(JsonEditorVue.name, JsonEditorVue)
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export default {
  install,
  JsonEditorVue
}
