import JsonEditorVue from './index.vue'
import { init } from './config'

interface installInterface {
  installed?: boolean

  (Vue: any, opts?: object): void
}

const install: installInterface = (Vue, opts = {}) => {
  if (install.installed) {
    return
  }
  init(opts)
  Vue.component(JsonEditorVue.name, JsonEditorVue)
  install.installed = true
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

// @ts-ignore
JsonEditorVue.install = install

export default JsonEditorVue

// todo: deprecated
export {
  JsonEditorVue
}
