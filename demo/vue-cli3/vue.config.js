module.exports = {
  // Vue CLI 3 ~ 4.5.14 可用
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.mjs$/,
          include: /node_modules/,
          type: 'javascript/auto',
        },
      ],
    },
  },
  // 仅 Vue CLI 3 可用
  /* chainWebpack(config) {
    // config.resolve.extensions.prepend('.mjs')
    config.module
      .rule('mjs')
      // .test(/\.mjs$/)
      .include.add(/node_modules/)
      .type('javascript/auto')
      .end()
  }, */
  transpileDependencies: ['json-editor-vue'],
}
