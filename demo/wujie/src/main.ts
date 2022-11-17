import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

import WujieVue from "wujie-vue3"
const { bus, setupApp, preloadApp, destroyApp } = WujieVue

const name = 'sub'

setupApp({
  name,
  url: 'http://localhost:5500/',
  exec: true,
  fetch: (url, options) => window.fetch(url, { ...options, credentials: "omit" }),
  degrade: false,
})
if (window.localStorage.getItem("preload") !== "false") {
  preloadApp({ name })
}

createApp(App)
  .use(WujieVue)
  .mount('#app')
