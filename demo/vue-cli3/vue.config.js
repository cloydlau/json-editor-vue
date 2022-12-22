module.exports = {
  /* configureWebpack: {
      module: {
        rules: [
          {
            test: /\.mjs$/,
            include: /node_modules/,
            type: 'javascript/auto',
          },
        ],
      },
    }, */
  chainWebpack(config) {
    // config.resolve.extensions.prepend('.mjs')
    config.module
      .rule('mjs')
      // .test(/\.mjs$/)
      .include.add(/node_modules/)
      .type('javascript/auto')
      .end()
  },
  transpileDependencies: ['json-editor-vue'],
}
