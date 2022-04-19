let globalProps = {}, globalAttrs = {}, globalListeners = {}, globalHooks = {}
import { useGlobalConfig } from 'vue-global-config'
import Component from './Component'

Component.install = (app: any, options = {}) => {
  if (!Component.name) {
    throw Error(`Name is required for a global component.`)
  } else if (Component.install.installed) {
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
export { globalProps, globalAttrs, globalListeners, globalHooks }
