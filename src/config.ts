let globalProps: any = {}

export const init = (opts: any = {}) => {
  for (let k in opts) {
    globalProps[k] = opts[k]
  }
}

export default globalProps
