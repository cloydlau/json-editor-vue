import { resolveConfig } from 'vue-global-config'
import type { Plugin, install } from 'vue-demi'
import Component from './Component'
import type { Mode } from './Component'

type SFCWithInstall<T> = T & Plugin & { install: typeof install }

const withInstall = <T, E extends Record<string, any>>(main: T, extra?: E) => {
  ;(main as SFCWithInstall<T>).install = (app): void => {
    for (const comp of [main, ...Object.values(extra ?? {})]) {
      app?.component(comp.name, comp)
    }
  }

  if (extra) {
    for (const [key, comp] of Object.entries(extra)) {
      ;(main as any)[key] = comp
    }
  }
  return main as SFCWithInstall<T> & E
}

const globalProps: Record<string, any> = {}
const globalAttrs: Record<string, any> = {}

const ComponentWithInstall = withInstall(Component)

ComponentWithInstall.install = (app: any, options = {}) => {
  const { props, attrs } = resolveConfig(options, Component.props)
  Object.assign(globalProps, props)
  Object.assign(globalAttrs, attrs)
  app.component(ComponentWithInstall.name, ComponentWithInstall)
}

export { globalProps, globalAttrs, Mode }
export default ComponentWithInstall
