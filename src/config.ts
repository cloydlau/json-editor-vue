let globalProps: { [key: string]: any } = {}

export const init = (opts: { [key: string]: any } = {}) => {
  for (let k in opts) {
    globalProps[k] = opts[k]
  }
}

export default globalProps
