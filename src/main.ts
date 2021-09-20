import JsonEditorVue from './index.vue'
import { init } from './config'

// @ts-ignore
JsonEditorVue.install = (app, options) => {
  init(options)
  app.component(JsonEditorVue.name, JsonEditorVue)
}

export default JsonEditorVue
