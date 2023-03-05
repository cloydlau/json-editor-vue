import { resolveConfig } from 'vue-global-config'
import type { App, Component } from 'vue-demi'
import component from './component'
import type { Mode } from './component'

const globalProps: Record<keyof any, any> = {}
const globalAttrs: Record<keyof any, any> = {}

type SFCWithInstall = Component & {
  install: (app: App, options?: Record<keyof any, any>) => void
}

function withInstall(sfc: Component): SFCWithInstall {
  ;(sfc as SFCWithInstall).install = (app: App, options = {}): void => {
    const { props, attrs } = resolveConfig(options, component.props)
    Object.assign(globalProps, props)
    Object.assign(globalAttrs, attrs)
    app.component(sfc.name as string, sfc as Object)
  }

  return sfc as SFCWithInstall
}

export { globalProps, globalAttrs, Mode }
export default withInstall(component)
