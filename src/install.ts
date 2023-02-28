import { resolveConfig } from 'vue-global-config'
import type { App, Component } from 'vue-demi'
import component from './component'
import type { Mode } from './component'

const globalProps: Record<string | symbol, any> = {}
const globalAttrs: Record<string | symbol, any> = {}

type SFCWithInstall = Component & {
  install: (app: App, options?: Record<string | symbol, any>) => void
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
