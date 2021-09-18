import { createApp } from 'vue'
import App from './index.vue'

import 'element-plus/dist/index.css'
import ElementPlus from 'element-plus'

import Vue3JsonViewer from 'vue3-json-viewer'

createApp(App)
.use(ElementPlus)
.use(Vue3JsonViewer)
.mount('#app')
