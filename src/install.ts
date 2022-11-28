import type { Plugin } from 'vue'
import { useGlobalConfig } from 'vue-global-config'
import Component from './Component'
import type { Mode } from './Component'

type SFCWithInstall<T> = T & Plugin

const withInstall = <T, E extends Record<string, any>>(
  main: T,
  extra?: E,
) => {
  (main as SFCWithInstall<T>).install = (app): void => {
    for (const comp of [main, ...Object.values(extra ?? {})]) {
      app.component(comp.name, comp)
    }
  }

  if (extra) {
    for (const [key, comp] of Object.entries(extra)) {
      (main as any)[key] = comp
    }
  }
  return main as SFCWithInstall<T> & E
}

const globalProps: Record<string, any> = {}
const globalAttrs: Record<string, any> = {}
const globalListeners: Record<string, any> = {}
const globalHooks: Record<string, any> = {}

const ComponentWithInstall = withInstall(Component)

ComponentWithInstall.install = (app: any, options = {}) => {
  const { props, attrs, listeners, hooks } = useGlobalConfig(options, Component.props)
  Object.assign(globalProps, props)
  Object.assign(globalAttrs, attrs)
  Object.assign(globalListeners, listeners)
  Object.assign(globalHooks, hooks)
  app.component(ComponentWithInstall.name, ComponentWithInstall)
}

export default ComponentWithInstall
export {
  globalProps, globalAttrs, globalListeners, globalHooks,
  Mode,
}
