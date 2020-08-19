import Vue from 'vue'
import App from './index.vue'

Vue.config.productionTip = false

import 'element-ui/lib/theme-chalk/index.css'
import ElementUI from 'element-ui'

Vue.use(ElementUI)

/**
 * 全局参数会被组件props中的同名参数（如果有）的值覆盖
 */
//import JsonEditorVue from '../src/main.ts'
/*Vue.use(JsonEditorVue, {
  options: {
    mainMenuBar: true,
    navigationBar: true,
    statusBar: true,
  },
})*/

new Vue({
  render: h => h(App),
}).$mount('#app')
