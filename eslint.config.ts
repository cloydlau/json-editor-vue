import antfu from '@antfu/eslint-config'

export default antfu(
  {
    formatters: true,
    ignores: ['demo/'],
  },
  {
    rules: {
      'curly': ['error', 'multi-line'],
      'no-console': 'off',
      'style/brace-style': ['error', '1tbs', { allowSingleLine: true }],
      'vue/attribute-hyphenation': 'off',
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
