import JSONEditorVue from './index.vue'
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
  Vue.component(JSONEditorVue.name, JSONEditorVue)
  install.installed = true
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

// @ts-ignore
JSONEditorVue.install = install

export default JSONEditorVue
