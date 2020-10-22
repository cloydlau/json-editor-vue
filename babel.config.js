module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    ['import', {
      libraryName: 'plain-kit',
      libraryDirectory: 'lib',
      style: false,
      camel2DashComponentName: false
    }, 'plain-kit']
  ]
}
