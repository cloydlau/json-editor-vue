import { useGlobalConfig } from 'vue-global-config'
import Component from './Component'
import type { Mode } from './Component'
let globalProps: { [key: string]: any } = {}
let globalAttrs: { [key: string]: any } = {}
let globalListeners: { [key: string]: any } = {}
let globalHooks: { [key: string]: any } = {}

Component.install = (app: any, options = {}) => {
  if (!Component.name) {
    throw new Error('Name is required for a global component.')
  }
  else if (Component.install.installed) {
    console.warn(`${Component.name} has been registered.`)
    return
  }

  const { props, attrs, listeners, hooks } = useGlobalConfig(options, Component.props)
  globalProps = props
  globalAttrs = attrs
  globalListeners = listeners
  globalHooks = hooks

  app.component(Component.name, Component)
  Component.install.installed = true
}

export default Component
export {
  globalProps, globalAttrs, globalListeners, globalHooks,
  Mode,
}
