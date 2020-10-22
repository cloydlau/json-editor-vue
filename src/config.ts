let options, vueJsonViewerProps, disabled

export const init = (opts: {
  options?: object
  vueJsonViewerProps?: object
  disabled?: boolean
} = {}) => {
  options = opts.options
  vueJsonViewerProps = opts.vueJsonViewerProps
  disabled = opts.disabled
}

export {
  options
}
