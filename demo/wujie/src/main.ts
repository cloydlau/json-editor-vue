import { createApp } from 'vue'
import './style.css'
import WujieVue from 'wujie-vue3'
import App from './App.vue'

const { setupApp, preloadApp } = WujieVue

const name = 'sub'

setupApp({
  name,
  url: 'http://localhost:5500/',
  exec: true,
  fetch: (url: string, options: Record<keyof any, any>) => window.fetch(url, { ...options, credentials: 'omit' }),
  degrade: false,
})
if (window.localStorage.getItem('preload') !== 'false') {
  preloadApp({ name })
}

createApp(App)
  .use(WujieVue)
  .mount('#app')
