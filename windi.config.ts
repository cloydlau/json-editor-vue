import { defineConfig } from 'vite-plugin-windicss'

export default defineConfig({
  // 全局样式重置 会影响到引用该组件的业务代码
  preflight: false,
})
