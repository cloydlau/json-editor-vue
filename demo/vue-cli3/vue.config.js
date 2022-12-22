module.exports = {
  /* configureWebpack: {
      module: {
        rules: [
          {
            test: /\.mjs$/,
            type: 'javascript/auto',
            include: /node_modules/,
          },
        ],
      },
    }, */
  chainWebpack(config) {
    // config.resolve.extensions.prepend('.mjs')
    config.module
      .rule('mjs')
      // .test(/\.mjs$/)
      .type('javascript/auto')
      .include.add(/node_modules/)
      .end()
  },
  transpileDependencies: ['json-editor-vue'],
}
