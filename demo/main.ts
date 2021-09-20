import { createApp } from 'vue-demi'
import App from './index.vue'

import 'element-plus/dist/index.css'
import ElementPlus from 'element-plus'

createApp(App)
.use(ElementPlus)
.mount('#app')
