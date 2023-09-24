import antfu from '@antfu/eslint-config'

export default antfu(
  // Configures for antfu's config
  {
    stylistic: true, // enable stylistic formatting rules
    typescript: true,
    vue: true,
    jsonc: true,
    yml: false,
  },
  // From the second arguments they are ESLint Flat Configs
  // you can have multiple configs
  {
    rules: {
      '@typescript-eslint/brace-style': ['error', '1tbs', { allowSingleLine: true }],
      'brace-style': ['error', '1tbs', { allowSingleLine: true }],
      'curly': ['error', 'multi-line'],
      'no-console': 'off',
      'vue/attribute-hyphenation': 'off',
      'vue/component-tags-order': ['error', { order: [['script', 'template'], 'style'] }],
      'vue/custom-event-name-casing': 'off',
      'vue/max-attributes-per-line': ['error', { singleline: 1, multiline: 1 }],
      'vue/no-deprecated-v-bind-sync': 'off',
      'vue/no-deprecated-v-on-native-modifier': 'off',
      'vue/no-deprecated-destroyed-lifecycle': 'off',
      'vue/no-deprecated-dollar-listeners-api': 'off',
      'vue/no-deprecated-dollar-scopedslots-api': 'off',
      'vue/singleline-html-element-content-newline': 'off',
    },
  },
)
